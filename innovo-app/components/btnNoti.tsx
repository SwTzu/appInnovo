import React from "react";
import { StyleSheet, View } from "react-native";
import { Bell } from "lucide-react-native";
import { router, usePathname } from "expo-router";
import { colors, radius, shadows, spacing } from "@/constants/theme";
import { IconButton } from "@/components/ui";

const hiddenRoutes = ["modalNotificaciones", "modalCam", "modalNotificacion"];

export default function Noti() {
  const pathname = usePathname();
  const hidden = hiddenRoutes.some((route) => pathname.endsWith(route));

  if (hidden) {
    return null;
  }

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <IconButton
        label="Abrir notificaciones"
        variant="solid"
        size={52}
        icon={<Bell size={24} color={colors.white} />}
        onPress={() => router.push("/(lector)/modalNotificaciones")}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    right: spacing.lg,
    top: spacing.xl,
    zIndex: 10,
  },
  button: {
    borderRadius: radius.pill,
    ...shadows.floating,
  },
});
