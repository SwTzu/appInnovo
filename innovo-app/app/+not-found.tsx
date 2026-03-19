import { useEffect } from "react";
import { StyleSheet, ActivityIndicator, Image } from "react-native";
import { Text, View } from "@/components/Themed";
import React from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { router } from "expo-router";
import { delay } from "lodash";
export default function LoadingScreen() {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
      if (isAuthenticated) {
        delay(() => {
          router.dismissTo("/(lector)/home");
        }, 400);
        
      }
      
    }, [isAuthenticated]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/icon.png")}
          style={{ width: 150, height: 150, resizeMode: "contain" }}
        />
        <Text style={styles.headerTitle}>Innovo APP</Text>
      </View>
      <View style={{ marginTop: 50, backgroundColor: "transparent" }}>
        <ActivityIndicator size={70} color="#2e78b7" />
        <Text style={styles.title}>Cargando...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 15,
  },
  header: {
    width: "100%",
    height: "40%",
    backgroundColor: "#0057b7", // Color azul
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
    borderBottomRightRadius: 180,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#fff",
  },
});
