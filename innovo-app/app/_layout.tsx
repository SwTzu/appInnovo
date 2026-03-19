import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/components/useColorScheme";
import { AuthProvider } from "@/contexts/AuthProvider";
import * as NavigationBar from 'expo-navigation-bar';
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "_index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
        <RootLayoutNav />
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  NavigationBar.setVisibilityAsync('hidden');
  NavigationBar.setPositionAsync('absolute');
  NavigationBar.setBehaviorAsync('overlay-swipe'
  )
  NavigationBar.setBackgroundColorAsync('#ffffff00')
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="_index" options={{ headerShown: false }} />
        <Stack.Screen name="(lector)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
