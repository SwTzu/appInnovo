import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { CircleUserRound, MapPin } from "lucide-react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalContext";
import type{ Ate } from "@/types/interfaces";
export default function Map() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { setNewAte, dataAte } = useGlobalContext();
  const mapViewRef = useRef<MapView>(null);
  const initialRegion = useMemo(() => ({
    latitude: -33.04806072577398,
    longitude: -71.44460058399616,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  }), []);
  const [region, setRegion] = useState<Region>(initialRegion);
  const handlerAte = useCallback((item: Ate) => {
    setNewAte(item);
    router.push("/(lector)/modalAte");
  }, [setNewAte]);
  const memoizedMarkers = useMemo(() => {
    return dataAte.map((punto, index) => (
      <Marker
        key={index}
        coordinate={{
          latitude: punto.lat || 0,
          longitude: punto.lng || 0,
        }}
        title="Detalles de la Atención especial"
        onCalloutPress={() => handlerAte(punto)}
      >
        <View style={styles.routeMarkerContainer}>
          <View style={styles.routeMarker}>
            <MapPin color="#ffffff" size={24} />
          </View>
          <View style={styles.routeMarkerShadow} />
        </View>
      </Marker>
    ));
  }, [dataAte, handlerAte]);
  useEffect(() => {
    const setupLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
      if (currentLocation) {
        setRegion({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        });
      }
      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 10,
          timeInterval: 3000,
        },
        (update) => setLocation(update)
      );
    };
    setupLocation();
  }, []);
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        ref={mapViewRef}
        initialRegion={initialRegion}
        region={region}
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
                color="#4285F4"
                style={{ backgroundColor: "white", borderRadius: 16 }}
              />
            </View>
          </Marker>
        )}
        {memoizedMarkers}
      </MapView>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      <TouchableOpacity
        style={styles.recenterButton}
        onPress={() => {
          if (location && mapViewRef.current) {
            mapViewRef.current.animateToRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }, 1000);
          }
        }}
      >
        <View style={styles.recenterButtonInner}>
          <View style={styles.recenterButtonIcon} />
        </View>
      </TouchableOpacity>
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
    backgroundColor: "rgba(66, 133, 244, 0.1)",
  },
  userLocationMiddleRing: {
    position: "absolute",
    width: 39,
    height: 39,
    borderRadius: 18,
    backgroundColor: "rgba(66, 133, 244, 0.2)",
  },
  userLocationDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4285F4",
    borderWidth: 3,
    borderColor: "white",
  },
  userLocationArrow: {
    position: "absolute",
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderBottomWidth: 24,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#4285F4",
  },
  routeMarkerContainer: {
    alignItems: "center",
  },
  routeMarker: {
    backgroundColor: "#0057b7",
    borderRadius: 8,
    padding: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
    borderTopColor: "#0057b7",
    marginTop: -4,
  },
  recenterButton: {
    position: "absolute",
    right: 16,
    bottom: "8%",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "white",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: "center",
    justifyContent: "center",
  },
  recenterButtonInner: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  recenterButtonIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#4285F4",
    borderWidth: 3,
    borderColor: "#4285F4",
  },
  errorText: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    color: "red",
    fontSize: 14,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 8,
    borderRadius: 4,
  },
});
