import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { CircleUserRound, LocateFixed, MapPin, Route } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGlobalContext } from "@/contexts/GlobalContext";
import type { Ate } from "@/types/interfaces";
import { Badge, IconButton } from "@/components/ui";
import { colors, fontSizes, radius, shadows, spacing } from "@/constants/theme";

export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setNewAte, dataAte } = useGlobalContext();
  const mapViewRef = useRef<MapView>(null);
  const insets = useSafeAreaInsets();
  const initialRegion = useMemo(
    () => ({
      latitude: -33.04806072577398,
      longitude: -71.44460058399616,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }),
    []
  );
  const [region, setRegion] = useState<Region>(initialRegion);

  const handlerAte = useCallback(
    (item: Ate) => {
      setNewAte(item);
      router.push("/(lector)/modalAte");
    },
    [setNewAte]
  );

  const routePoints = useMemo(
    () => dataAte.filter((punto) => typeof punto.lat === "number" && typeof punto.lng === "number"),
    [dataAte]
  );

  const memoizedMarkers = useMemo(() => {
    return routePoints.map((punto, index) => (
      <Marker
        key={punto.id_ate ?? index}
        coordinate={{
          latitude: punto.lat || 0,
          longitude: punto.lng || 0,
        }}
        title={punto.tipo || "Atención especial"}
        description={punto.direccion || "Ver detalle"}
        onCalloutPress={() => handlerAte(punto)}
      >
        <View style={styles.routeMarkerContainer}>
          <View style={styles.routeMarker}>
            <MapPin color={colors.white} size={22} />
          </View>
          <View style={styles.routeMarkerShadow} />
        </View>
      </Marker>
    ));
  }, [routePoints, handlerAte]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;
    let mounted = true;

    const setupLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permiso de ubicación denegado");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      if (!mounted) {
        return;
      }

      setLocation(currentLocation);
      setRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 3000,
        },
        (update) => setLocation(update)
      );
    };

    setupLocation();

    return () => {
      mounted = false;
      subscription?.remove();
    };
  }, []);

  const recenter = () => {
    if (location && mapViewRef.current) {
      mapViewRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        700
      );
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapViewRef}
        initialRegion={initialRegion}
        region={region}
        onRegionChangeComplete={setRegion}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            tracksViewChanges={false}
            flat={false}
            title="Mi ubicación"
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.userLocationMarker}>
              <View style={styles.userLocationOuterRing} />
              <View style={styles.userLocationMiddleRing} />
              <CircleUserRound
                size={32}
                color={colors.info}
                style={styles.userIcon}
              />
            </View>
          </Marker>
        )}
        {memoizedMarkers}
      </MapView>

      <View style={[styles.topPanel, { top: insets.top + spacing.md }]}>
        <View style={styles.panelIcon}>
          <Route size={22} color={colors.brand} />
        </View>
        <View style={styles.panelText}>
          <Text style={styles.panelTitle}>Ruta en terreno</Text>
          <Text style={styles.panelSubtitle}>Ubicación actual y ATE pendientes</Text>
        </View>
        <Badge label={`${routePoints.length}`} tone={routePoints.length > 0 ? "warning" : "success"} />
      </View>

      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

      <View style={[styles.recenterButton, { bottom: spacing.xxl }]}>
        <IconButton
          label="Centrar mapa"
          variant="solid"
          size={54}
          icon={<LocateFixed color={colors.white} size={24} />}
          onPress={recenter}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  map: {
    flex: 1,
  },
  topPanel: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.floating,
  },
  panelIcon: {
    width: 42,
    height: 42,
    borderRadius: radius.lg,
    backgroundColor: colors.brandSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  panelText: {
    flex: 1,
  },
  panelTitle: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: "900",
  },
  panelSubtitle: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  userLocationMarker: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  userLocationOuterRing: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(8, 119, 201, 0.12)",
  },
  userLocationMiddleRing: {
    position: "absolute",
    width: 39,
    height: 39,
    borderRadius: 18,
    backgroundColor: "rgba(8, 119, 201, 0.22)",
  },
  userIcon: {
    backgroundColor: colors.white,
    borderRadius: 16,
  },
  routeMarkerContainer: {
    alignItems: "center",
  },
  routeMarker: {
    backgroundColor: colors.brand,
    borderRadius: radius.md,
    padding: spacing.sm,
    ...shadows.card,
  },
  routeMarkerShadow: {
    width: 8,
    height: 8,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 16,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: colors.brand,
    marginTop: -4,
  },
  recenterButton: {
    position: "absolute",
    right: spacing.lg,
  },
  errorText: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    color: colors.danger,
    fontSize: fontSizes.sm,
    fontWeight: "800",
    backgroundColor: colors.surface,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    overflow: "hidden",
  },
});
