import { CameraView } from "expo-camera";
import { useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { CameraIcon, X } from "lucide-react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { IconButton } from "@/components/ui";
import { colors, fontSizes, radius, shadows, spacing } from "@/constants/theme";

export default function CamScreen() {
  const cameraRef = useRef<CameraView>(null);
  const { setPhotoUri } = useGlobalContext();
  const insets = useSafeAreaInsets();

  const takePhoto = async () => {
    const photo = await cameraRef.current?.takePictureAsync();
    if (photo) {
      setPhotoUri(photo.uri);
      router.push("/(lector)/novedad");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={[styles.topBar, { top: insets.top + spacing.md }]}>
          <IconButton
            label="Cerrar cámara"
            variant="plain"
            size={44}
            icon={<X color={colors.text} size={22} />}
            onPress={() => router.back()}
          />
          <View style={styles.topCopy}>
            <Text style={styles.topTitle}>Fotografía</Text>
            <Text style={styles.topSubtitle}>Alinea el medidor y captura la evidencia.</Text>
          </View>
        </View>

        <View style={[styles.captureWrap, { bottom: insets.bottom + spacing.xxl }]}>
          <IconButton
            label="Tomar fotografía"
            variant="solid"
            size={76}
            icon={<CameraIcon color={colors.white} size={34} />}
            onPress={takePhoto}
            style={styles.captureButton}
          />
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: colors.black,
  },
  camera: {
    flex: 1,
  },
  topBar: {
    position: "absolute",
    left: spacing.lg,
    right: spacing.lg,
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    padding: spacing.sm,
    ...shadows.floating,
  },
  topCopy: {
    flex: 1,
  },
  topTitle: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: "900",
  },
  topSubtitle: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  captureWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  captureButton: {
    borderWidth: 4,
    borderColor: colors.white,
  },
});
