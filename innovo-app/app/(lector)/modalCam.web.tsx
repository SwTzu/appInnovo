import React, { useCallback, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { CameraIcon, ImagePlus, X } from "lucide-react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { AppHeader, IconButton, ModalSheet } from "@/components/ui";
import { colors, fontSizes, radius, spacing } from "@/constants/theme";

const videoStyle: CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export default function CamScreen() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { setPhotoUri } = useGlobalContext();
  const [error, setError] = useState<string | null>(null);
  const [isReady, setReady] = useState(false);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const close = useCallback(() => {
    stopStream();
    router.back();
  }, [stopStream]);

  const pickImageAsync = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
      stopStream();
      router.push("/(lector)/novedad");
    }
  }, [setPhotoUri, stopStream]);

  const takePhoto = useCallback(async () => {
    const video = videoRef.current;
    if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
      setError("La cámara aún no está lista.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      setError("No se pudo capturar la imagen.");
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setError("No se pudo generar la fotografía.");
          return;
        }

        setPhotoUri(URL.createObjectURL(blob));
        stopStream();
        router.push("/(lector)/novedad");
      },
      "image/jpeg",
      0.92
    );
  }, [setPhotoUri, stopStream]);

  useEffect(() => {
    let mounted = true;

    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setError("Este navegador no permite usar la cámara.");
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
        }
      } catch (cameraError) {
        console.warn("No se pudo abrir la camara web:", cameraError);
        setError("No se pudo abrir la cámara del navegador.");
      }
    };

    startCamera();

    return () => {
      mounted = false;
      stopStream();
    };
  }, [stopStream]);

  return (
    <ModalSheet>
      <View style={styles.headerRow}>
        <AppHeader
          title="Fotografía"
          subtitle="Alinea el medidor y captura la evidencia."
          icon={<CameraIcon size={22} color={colors.brand} />}
          style={styles.header}
        />
        <IconButton
          label="Cerrar cámara"
          variant="plain"
          size={42}
          icon={<X color={colors.text} size={22} />}
          onPress={close}
        />
      </View>

      <View style={styles.cameraFrame}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={videoStyle}
        />
        {!isReady ? (
          <View style={styles.cameraOverlay}>
            <Text style={styles.overlayText}>{error || "Preparando cámara..."}</Text>
          </View>
        ) : null}
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.actions}>
        <IconButton
          label="Seleccionar imagen"
          variant="plain"
          size={58}
          icon={<ImagePlus color={colors.brand} size={28} />}
          onPress={pickImageAsync}
        />
        <IconButton
          label="Tomar fotografía"
          variant="solid"
          size={72}
          icon={<CameraIcon color={colors.white} size={32} />}
          onPress={takePhoto}
          disabled={!isReady}
        />
      </View>
    </ModalSheet>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
  },
  header: {
    flex: 1,
    marginBottom: spacing.md,
  },
  cameraFrame: {
    height: 420,
    overflow: "hidden",
    borderRadius: radius.xl,
    backgroundColor: colors.black,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.42)",
    padding: spacing.xl,
  },
  overlayText: {
    color: colors.white,
    fontSize: fontSizes.md,
    fontWeight: "800",
    textAlign: "center",
  },
  errorText: {
    color: colors.danger,
    fontSize: fontSizes.sm,
    fontWeight: "700",
    marginTop: spacing.md,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
});
