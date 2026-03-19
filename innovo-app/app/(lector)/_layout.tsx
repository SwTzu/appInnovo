import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Keyboard, Text} from "react-native";
import { Stack, useRouter, useSegments, usePathname } from "expo-router";
import { House, MapPinned, UserRound, ClipboardPen} from "lucide-react-native";
import Nati from "@/components/btnNoti";
export default function LectorLayout() {
  const router = useRouter();
  const rutaActual= usePathname();
  const segments = useSegments() as string[]; // Saber en qué ruta estamos actualmente
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  return (
    <View style={styles.container}>
      <Nati/>
      <View style={styles.content}>
        <Stack >
          <Stack.Screen
            name="home"
            options={{ title: "Home", headerShown: false }}
          />
          <Stack.Screen
            name="novedad"
            options={{ title: "Novedad", headerShown: false }}
            
          />
          <Stack.Screen
            name="ruta"
            options={{ title: "Ruta", headerShown: false }}
          />
          <Stack.Screen
            name="perfil"
            options={{ title: "Perfil", headerShown: false }}
          />
          <Stack.Screen
            name="modalAte"
            options={{
              title: "Atenciones Especiales",
              presentation: "transparentModal",
              animation: "fade",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalNotificaciones"
            options={{
              title: "Notificaciones",
              presentation: "card",
              animation: 'fade',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalNotificacion"
            options={{
              title: "Notificacion",
              presentation: "transparentModal",
              animation: "fade",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalCalendar"
            options={{
              title: "Calendario",
              presentation: "transparentModal",
              animation: "fade",
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modalCam"
            options={{
              title: "Camera",
              presentation: "fullScreenModal",
              animation: 'fade',
              headerShown: false,
            }}
          />
        </Stack>
        {!isKeyboardVisible &&
           rutaActual!=='/modalCam'&& rutaActual!=='/modalAte'&&rutaActual!=='/modalNotificacion'&& ( // Ocultar barra si la cámara está activa
            <View style={styles.navbar}>
              <TouchableOpacity
                onPress={() => router.push("/(lector)/novedad")}
              >
                <ClipboardPen
                  size={24}
                  color={segments.includes("novedad") ? "#007aff" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(lector)/home")}
              >
                <House
                  size={24}
                  color={segments.includes("home") ? "#007aff" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(lector)/ruta")}
              >
                <MapPinned
                  size={24}
                  color={segments.includes("ruta") ? "#007aff" : "black"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/(lector)/perfil")}
              >
                <UserRound
                  size={24}
                  color={segments.includes("perfil") ? "#007aff" : "black"}
                />
              </TouchableOpacity>
            </View>
          )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  navbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  navItem: {
    color: "#007aff",
  },
  active: {
    color: "black",
    textDecorationLine: "underline",
  },
});
