import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import { GoogleMap, InfoWindowF, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import { LocateFixed, MapPin, Route } from "lucide-react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalContext";
import type { Ate } from "@/types/interfaces";
import { Badge, IconButton } from "@/components/ui";
import { colors, fontSizes, radius, shadows, spacing } from "@/constants/theme";

type LatLng = {
  lat: number;
  lng: number;
};

const defaultCenter = {
  lat: -33.04806072577398,
  lng: -71.44460058399616,
};

const mapContainerStyle: CSSProperties = {
  width: "100%",
  height: "100%",
};

const googleMapsApiKey =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  Constants.expoConfig?.extra?.GOOGLE_MAPS_API_KEY ||
  "";

export default function Map() {
  const { setNewAte, dataAte } = useGlobalContext();
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [selectedPoint, setSelectedPoint] = useState<Ate | null>(null);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "innovo-google-map",
    googleMapsApiKey,
  });

  const routePoints = useMemo(
    () =>
      dataAte.filter(
        (punto) => typeof punto.lat === "number" && typeof punto.lng === "number"
      ),
    [dataAte]
  );

  const center = useMemo(() => {
    if (userLocation) return userLocation;
    const firstPoint = routePoints[0];

    if (firstPoint?.lat != null && firstPoint?.lng != null) {
      return { lat: firstPoint.lat, lng: firstPoint.lng };
    }

    return defaultCenter;
  }, [routePoints, userLocation]);

  const handlerAte = useCallback(
    (item: Ate) => {
      setNewAte(item);
      router.push("/(lector)/modalAte");
    },
    [setNewAte]
  );

  const recenter = useCallback(() => {
    if (!mapInstance) return;
    mapInstance.panTo(userLocation || center);
    mapInstance.setZoom(userLocation ? 16 : 14);
  }, [center, mapInstance, userLocation]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Ubicación no disponible en este navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      () => {
        setLocationError("No se pudo obtener la ubicación actual.");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
      }
    );
  }, []);

  if (!googleMapsApiKey) {
    return (
      <View style={styles.emptyContainer}>
        <MapPin color={colors.textMuted} size={32} />
        <Text style={styles.emptyTitle}>Google Maps no configurado</Text>
        <Text style={styles.emptyText}>Falta la API key para mostrar el mapa web.</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.emptyContainer}>
        <MapPin color={colors.danger} size={32} />
        <Text style={styles.emptyTitle}>No se pudo cargar el mapa</Text>
        <Text style={styles.emptyText}>Revisa la API key y los dominios permitidos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={routePoints.length ? 14 : 13}
          onLoad={setMapInstance}
          onUnmount={() => setMapInstance(null)}
          options={{
            clickableIcons: false,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
          }}
        >
          {userLocation ? (
            <MarkerF
              position={userLocation}
              title="Mi ubicación"
              zIndex={2}
            />
          ) : null}

          {routePoints.map((punto, index) => {
            const position = {
              lat: punto.lat || 0,
              lng: punto.lng || 0,
            };

            return (
              <MarkerF
                key={punto.id_ate ?? index}
                position={position}
                title={punto.tipo || "Atención especial"}
                onClick={() => setSelectedPoint(punto)}
              />
            );
          })}

          {selectedPoint?.lat != null && selectedPoint?.lng != null ? (
            <InfoWindowF
              position={{ lat: selectedPoint.lat, lng: selectedPoint.lng }}
              onCloseClick={() => setSelectedPoint(null)}
            >
              <View style={styles.infoWindow}>
                <Text style={styles.infoTitle}>{selectedPoint.tipo || "Atención especial"}</Text>
                <Text style={styles.infoAddress}>
                  {selectedPoint.direccion || "Sin dirección registrada"}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => handlerAte(selectedPoint)}
                  style={styles.infoButton}
                >
                  <Text style={styles.infoButtonText}>Abrir ATE</Text>
                </Pressable>
              </View>
            </InfoWindowF>
          ) : null}
        </GoogleMap>
      ) : (
        <View style={styles.emptyContainer}>
          <Route color={colors.brand} size={32} />
          <Text style={styles.emptyTitle}>Cargando mapa</Text>
        </View>
      )}

      <View style={styles.topPanel}>
        <View style={styles.panelIcon}>
          <Route size={22} color={colors.brand} />
        </View>
        <View style={styles.panelText}>
          <Text style={styles.panelTitle}>Ruta en terreno</Text>
          <Text style={styles.panelSubtitle}>
            {locationError || "Ubicación actual y ATE pendientes"}
          </Text>
        </View>
        <Badge label={`${routePoints.length}`} tone={routePoints.length > 0 ? "warning" : "success"} />
      </View>

      <View style={styles.recenterButton}>
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
    backgroundColor: colors.background,
  },
  topPanel: {
    position: "absolute",
    top: spacing.lg,
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
  recenterButton: {
    position: "absolute",
    right: spacing.lg,
    bottom: spacing.xl,
  },
  infoWindow: {
    width: 220,
    gap: spacing.sm,
  },
  infoTitle: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: "900",
  },
  infoAddress: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    lineHeight: 18,
  },
  infoButton: {
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.brand,
    paddingHorizontal: spacing.md,
  },
  infoButtonText: {
    color: colors.white,
    fontSize: fontSizes.xs,
    fontWeight: "900",
  },
  emptyContainer: {
    flex: 1,
    minHeight: 320,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    padding: spacing.xl,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: "900",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    textAlign: "center",
  },
});
