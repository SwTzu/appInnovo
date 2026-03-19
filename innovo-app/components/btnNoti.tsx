import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Bell } from "lucide-react-native";
import { router, usePathname } from "expo-router";
export default function Noti() {
    const rutaActual= usePathname();
  return (
    rutaActual !== "/modalNotificaciones" && rutaActual !== "/modalCam"&& rutaActual !== "/modalNotificacion" ? (
      <TouchableOpacity
        style={styles.btnNoti}
        onPress={() => router.push("/(lector)/modalNotificaciones")}
      >
        <Bell size={32} color="white"/>
      </TouchableOpacity>
    ) : null
  );
}
const styles = StyleSheet.create({
  btnNoti: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#0057b7",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
});
