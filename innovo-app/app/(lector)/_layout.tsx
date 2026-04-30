import React, { useEffect, useMemo, useState } from "react";
import { Keyboard, Pressable, StyleSheet, Text, View } from "react-native";
import { Href, Stack, usePathname, useRouter, useSegments } from "expo-router";
import { ClipboardPen, House, MapPinned, UserRound } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Nati from "@/components/btnNoti";
import { colors, fontSizes, radius, shadows, spacing } from "@/constants/theme";

const navItems = [
  { route: "/(lector)/novedad" as Href, segment: "novedad", label: "Novedad", icon: ClipboardPen },
  { route: "/(lector)/home" as Href, segment: "home", label: "Inicio", icon: House },
  { route: "/(lector)/ruta" as Href, segment: "ruta", label: "Ruta", icon: MapPinned },
  { route: "/(lector)/perfil" as Href, segment: "perfil", label: "Perfil", icon: UserRound },
];

const hiddenRoutes = ["modalCam", "modalAte", "modalNotificacion", "modalNotificaciones", "modalCalendar"];

export default function LectorLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments() as string[];
  const insets = useSafeAreaInsets();
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

  const shouldShowChrome = useMemo(
    () => !isKeyboardVisible && !hiddenRoutes.some((route) => pathname.endsWith(route)),
    [isKeyboardVisible, pathname]
  );

  return (
    <View style={styles.container}>
      {shouldShowChrome ? <Nati /> : null}
      <View style={styles.content}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="home" options={{ title: "Home" }} />
          <Stack.Screen name="novedad" options={{ title: "Novedad" }} />
          <Stack.Screen name="ruta" options={{ title: "Ruta" }} />
          <Stack.Screen name="perfil" options={{ title: "Perfil" }} />
          <Stack.Screen
            name="modalAte"
            options={{
              title: "Atenciones Especiales",
              presentation: "transparentModal",
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="modalNotificaciones"
            options={{
              title: "Notificaciones",
              presentation: "card",
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="modalNotificacion"
            options={{
              title: "Notificacion",
              presentation: "transparentModal",
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="modalCalendar"
            options={{
              title: "Calendario",
              presentation: "transparentModal",
              animation: "fade",
            }}
          />
          <Stack.Screen
            name="modalCam"
            options={{
              title: "Camera",
              presentation: "fullScreenModal",
              animation: "fade",
            }}
          />
        </Stack>
      </View>
      {shouldShowChrome ? (
        <View style={[styles.navbarWrap, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
          <View style={styles.navbar}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = segments.includes(item.segment);
              return (
                <Pressable
                key={item.segment}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                  onPress={() => router.push(item.route)}
                  style={({ pressed }) => [
                    styles.navItem,
                    active && styles.navItemActive,
                    pressed && styles.navItemPressed,
                  ]}
                >
                  <Icon size={22} color={active ? colors.white : colors.textMuted} strokeWidth={2.4} />
                  <Text style={[styles.navLabel, active && styles.navLabelActive]} numberOfLines={1}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  navbarWrap: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  navbar: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    ...shadows.floating,
  },
  navItem: {
    flex: 1,
    minHeight: 56,
    borderRadius: radius.xl,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
  },
  navItemActive: {
    backgroundColor: colors.brand,
  },
  navItemPressed: {
    opacity: 0.78,
  },
  navLabel: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    fontWeight: "800",
  },
  navLabelActive: {
    color: colors.white,
  },
});
