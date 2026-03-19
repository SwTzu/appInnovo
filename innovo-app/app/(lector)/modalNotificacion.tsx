import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  Alert,
} from "react-native";
import { ExternalLink, CircleX } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import type { Notificacion } from "@/types/interfaces";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const ModalNotificacion = () => {
  const params = useLocalSearchParams();
  const selectedNotification: Notificacion = Array.isArray(params.notification)
    ? JSON.parse(params.notification[0])
    : JSON.parse(params.notification);

  const handleOpenURL = (url: string) => {
    Alert.alert(
      "Aceptar términos",
      "Al abrir el enlace, se acepta tanto la recepción de la información como el estar en total conocimiento del contenido.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Abrir",
          onPress: () =>
            Linking.openURL(url).catch((err) =>
              console.error("Error al abrir el URL:", err)
            ),
        },
      ],
      { cancelable: true }
    );
  };
  const handlerClose = () => {
    if (!selectedNotification.estado&&selectedNotification.tipo!='msg') {
      Alert.alert(
        "Aceptar términos",
        "Al cerrar este mensaje, se acepta tanto la recepción de la información como el estar en total conocimiento del contenido.\nDecea continuar?",
       
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Continuar",
            onPress: () => router.back(),
          },
        ],
        { cancelable: true }
      );
    } else {
      router.back();
    }
  };
  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={handlerClose}>
          <CircleX size={24} color="gray" />
        </TouchableOpacity>

        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {selectedNotification?.titulo}
            </Text>
          </View>
          <Text style={styles.modalMessage}>
            {selectedNotification?.mensaje}
          </Text>
          <Text style={styles.modalContentText}>
            {selectedNotification?.contenido}
          </Text>

          {/* Mostrar imagen o botón de enlace según la URL */}
          {selectedNotification?.url &&
            (selectedNotification.url.endsWith(".jpg") ||
            selectedNotification.url.endsWith(".jpeg") ||
            selectedNotification.url.endsWith(".png") ? (
              <Image
                source={{
                  uri: `${apiUrl}DOCS_NOTIFICACIONES${
                    selectedNotification.url.split("/DOCS_NOTIFICACIONES")[1]
                  }`,
                }}
                style={styles.modalImage}
              />
            ) : (
              <TouchableOpacity
                style={styles.urlButton}
                onPress={() =>
                  handleOpenURL(
                    `${apiUrl}DOCS_NOTIFICACIONES${
                      selectedNotification.url.split("/DOCS_NOTIFICACIONES")[1]
                    }`
                  )
                }
              >
                <ExternalLink size={20} color="#FFFFFF" />
                <Text style={styles.urlButtonText}>Abrir enlace</Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    width: "90%",
    maxHeight: "90%", // Aumentado para permitir más contenido
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  scrollViewContent: {
    flexGrow: 1, // Permite que el contenido se expanda si es necesario
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    flexShrink: 1,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  modalContentText: {
    fontSize: 14,
    color: "#757575",
    marginBottom: 10,
    textAlign: "center",
  },
  modalImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    alignSelf: "center",
  },
  urlButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    margin: 10,
    justifyContent: "center",
  },
  urlButtonText: {
    color: "#FFFFFF",
    marginLeft: 10,
    fontSize: 14,
  },
  closeButton: {
    padding: 5,
    position: "absolute",
    right: 0,
    top: 0,
  },
});

export default ModalNotificacion;
