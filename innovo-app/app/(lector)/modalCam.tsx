import { CameraView} from "expo-camera";
import { useRef, useEffect} from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {CameraIcon } from "lucide-react-native";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { router } from "expo-router";
export default function CamScreen() {
  const cameraRef = useRef<CameraView>(null);
  const { setPhotoUri } = useGlobalContext();
  const takePhoto = async () => {
    if (cameraRef) {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        if (photo) {
          setPhotoUri(photo.uri);
          router.push("/(lector)/novedad");
        }
      }
    }
  };
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={takePhoto}>
            <CameraIcon color="white" size={42} />
          </TouchableOpacity>
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
    backgroundColor: "red",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  closeButton: {
    position: "absolute",
    bottom: 30,
    transform: [{ translateX: 0 }],
    backgroundColor: "#8e2de2",
    padding: 10,
    borderColor: "white",
    borderWidth: 2,
    borderRadius: 100,
    alignSelf: "center",
    width: "20%",
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
});
