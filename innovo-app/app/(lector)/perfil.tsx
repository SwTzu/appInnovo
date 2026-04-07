import {
  UserRound,
  FileText,
  CreditCard,
  Mail,
  BriefcaseBusiness,
  UserCircle,
  Camera,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  PixelRatio,
  Linking,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { getPerfil, updatePerfil } from "@/api/trabajador";
import type { DatoPerfil, Documento } from "@/types/interfaces";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 375;

function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}
export default function PerfilScreen() {
  const [datosPerfil, setDatosPerfil] = useState<DatoPerfil | null>(null);
  const [imageURL, setImageURL] = useState(String);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      const res = await updatePerfil(result.assets[0].uri);
      if (res) {
        setImageURL('');
        // Una vez que se subió exitosamente, volvemos a pedir el perfil
        const updatedPerfil = await getPerfil();
        setDatosPerfil(updatedPerfil);
        setImageURL(`${apiUrl}IMG_PERFILES${updatedPerfil.perfil.split("/IMG_PERFILES")[1]}`);
        await Image.clearDiskCache();
        Alert.alert(
          "✅ Foto de perfil actualizada",
          "La foto de perfil se ha actualizado correctamente"
        );
      } else {
        Alert.alert(
          "❌ Foto de perfil no actualizada",
          "La foto de perfil no se ha actualizado correctamente"
        );
      }
    }
  };

  useEffect(() => {
    getPerfil().then((data: DatoPerfil) => {
      setDatosPerfil(data);
      setImageURL(`${apiUrl}IMG_PERFILES${data.perfil.split("/IMG_PERFILES")[1]}`);
    });
  }, []);
  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Error al abrir el URL:", err)
    );
  };
  const groupDocumentsByType = (documentos: Documento[]) => {
    return documentos.reduce((acc, doc) => {
      const type = doc.tipo.value;
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(doc);
      return acc;
    }, {} as Record<string, Documento[]>);
  };
  const renderDocumentItems = () => {
    if (!datosPerfil?.documentos) return null;

    const groupedDocuments = groupDocumentsByType(datosPerfil.documentos);
    return Object.entries(groupedDocuments).map(([type, docs]) => {
      if (type === "Notificacion") return null;
      return (
      <View key={type}>
        <Text style={styles.documentTypeTitle}>{type}</Text>
        {docs.map((doc) => (
        <TouchableOpacity
          key={doc._id}
          style={styles.documentItem}
          onPress={async () => {
            const token = await SecureStore.getItemAsync("token");
            if (!token) {
              Alert.alert("Sesión expirada", "Vuelve a iniciar sesión para abrir el documento.");
              return;
            }
            handleOpenURL(
              `${apiUrl}${doc.url}?access_token=${encodeURIComponent(token)}`
            );
          }}
        >
          <FileText size={24} color="#0057b7" />
          <View style={styles.documentItemContent}>
          <Text style={styles.documentText}>{doc.tipo.value}</Text>
          <Text style={styles.documentDate}>
            {new Date(doc.fecha).toLocaleDateString()}
          </Text>
          </View>
        </TouchableOpacity>
        ))}
      </View>
      );
    });
  };
  //IMG_PERFILES
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {datosPerfil?.perfil ? (
            <Image
              style={styles.profileImage}
              source={imageURL}
              contentFit="cover"
              transition={1000}
              cachePolicy={"disk"}
            />
          ) : (
            <UserCircle size={200} color="#0057b7" />
          )}

          <TouchableOpacity
            style={styles.changePhotoButton}
            onPress={pickImageAsync}
          >
            <Camera size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Personal Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información personal</Text>

        <View style={styles.infoItem}>
          <UserRound size={24} color="#0057b7" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Nombre</Text>
            <Text style={styles.infoValue}>{datosPerfil?.Nombre}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <Mail size={24} color="#0057b7" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Correo electrónico</Text>
            <Text style={styles.infoValue}>{datosPerfil?.correo}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <BriefcaseBusiness size={24} color="#0057b7" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Cargo</Text>
            <Text style={styles.infoValue}>
              {datosPerfil?.cargo === "administracion"
                ? "Administración"
                : datosPerfil?.cargo === "lector"
                ? "Lector"
                : datosPerfil?.cargo === "supervisor"
                ? "Supervisor"
                : datosPerfil?.cargo === "inspector"
                ? "Inspector"
                : datosPerfil?.cargo}
            </Text>
          </View>
        </View>
      </View>

      {/* Credential Button */}
      <TouchableOpacity style={styles.credentialButton}>
        <CreditCard size={24} color="#ffffff" />
        <Text style={styles.credentialButtonText}>Ver credencial digital</Text>
      </TouchableOpacity>

      {/* Documents Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Documentos</Text>
        {renderDocumentItems()}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7e7e7",
  },
  header: {
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    position: "relative",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  changePhotoButton: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "#0057b7",
    borderRadius: 100,
    padding: 8,
    borderWidth: 3,
    borderColor: "white",
  },
  changePhotoText: {
    color: "#0057b7",
    fontSize: normalize(14),
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: normalize(14),
    color: "#666",
  },
  infoValue: {
    fontSize: normalize(16),
    color: "#333",
    fontWeight: "500",
  },
  credentialButton: {
    backgroundColor: "#0057b7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
  },
  credentialButtonText: {
    color: "white",
    fontSize: normalize(16),
    fontWeight: "bold",
    marginLeft: 10,
  },
  documentTypeTitle: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#333",
    marginTop: 15,
    marginBottom: 10,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 10,
  },
  documentItemContent: {
    flex: 1,
    marginLeft: 15,
  },
  documentText: {
    fontSize: normalize(16),
    color: "#333",
  },
  documentDate: {
    fontSize: normalize(12),
    color: "#666",
    marginTop: 4,
  },
});
