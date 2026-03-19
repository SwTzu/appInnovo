import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  //Dimensions,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import DropDownPicker from "react-native-dropdown-picker";
import { useGlobalContext } from "@/contexts/GlobalContext";
import {
  ImagePlus,
  CircleX,
  Camera,
  ClipboardPen,
  XCircle,
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useCameraPermissions } from "expo-camera";
import OmnipotentInput from "@/components/novedad/OmnipotentInput";
import { sendAte, sendNovedad } from "@/api/trabajador";
import NetInfo from "@react-native-community/netinfo";
import type { Novedad, Ate } from "@/types/interfaces";
import { router } from "expo-router";
export default function Novedad() {
  const {
    offLine,
    setOffLine,
    newNovedad,
    setNewNovedad,
    newAte,
    tipoNovedad,
    clearAte,
    setDataAte,
    dataAte,
    photoUri,
    setPhotoUri,
  } = useGlobalContext();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [open_novedad, setOpen_novedad] = useState(false);
  const [photoArray, setPhotoArray] = useState<string[]>([]);
  const [items_tipo, setItems_tipo] = useState(
    tipoNovedad.map((item) => ({ label: item.value, value: item._id }))
  );
  const filteredItems = !newAte.tipo
    ? items_tipo.filter(
        (item) =>
          item.label !== "Atención Especial-Lectura" &&
          item.label !== "Atención Especial-Reparto"
      )
    : items_tipo;
  const [value_direccion, setValue_direccion] = useState(
    newAte.direccion || null
  );
  const [value_tipoNovedad, setValue_tipoNovedad] = useState(
    items_tipo.find((item) => item.label === newAte.tipo)?.value || null
  );
  const [wasConnected, setWasConnected] = useState<boolean | null>(false);
  const [value_lectura, setValue_lectura] = useState<number | null>(null);
  const [value_comentario, setValue_comentario] = useState<string | null>(null);
  const [value_medidor, setValue_medidor] = useState(
    newAte.numeroMedidor ? newAte.numeroMedidor.toString() : null
  );
  const openCamera = async () => {
    if (!cameraPermission) {
      const permission = await requestCameraPermission();
      if (!permission.granted) {
        Alert.alert(
          "Permiso denegado",
          "Se requieren permisos para acceder a la cámara."
        );
        return;
      }
    }
    setPhotoUri(null);
    setNewNovedad({
      numeroMedidor: Number(value_medidor),
      direccion: value_direccion,
      tipoNovedad: value_tipoNovedad,
      lectura: value_lectura,
      comentario: value_comentario,
      foto: [photoUri].filter((uri) => uri !== null),
    });
    router.push("/(lector)/modalCam");
  };
  const handlerSend = async () => {
    if (!value_direccion || !value_tipoNovedad || !value_comentario) {
      Alert.alert("Error", "Por favor llene todos los campos.");
      return;
    }
    const newNovedad: Novedad = {
      direccion: value_direccion,
      numeroMedidor: Number(value_medidor),
      tipoNovedad:
        filteredItems.find((item) => item.value === value_tipoNovedad)?.label ||
        null,
      comentario: value_comentario,
      lectura: value_lectura || null,
      foto:
        value_tipoNovedad === "67ac4d7e13432b2cbf379597"
          ? photoArray.filter((uri) => uri !== null)
          : [photoUri].filter((uri) => uri !== null),
    };
    const netInfo = await NetInfo.fetch();
    if (newAte.tipo) {
      if (!photoUri) {
        Alert.alert("Error", "Por favor llene todos los campos.");
        return;
      }
      if (netInfo.isConnected) {
        sendAte(
          newAte.id_ate,
          newAte.tipo,
          newNovedad.foto ? newNovedad.foto.join(",") : null
        )
          .then(() => {
            Alert.alert("Éxito", "ATE enviado correctamente.");
            setDataAte(dataAte.filter((ate) => ate.id_ate !== newAte.id_ate));
            handlerClean();
          })
          .catch((error) => {
            Alert.alert("Error", error.message);
          });
      } else {
        SaveAteOffline(
          newAte.id_ate,
          newAte.tipo,
          newNovedad.foto ? newNovedad.foto.join(",") : null
        );
      }
    } else {
      if (netInfo.isConnected) {
        const matchingData = offLine.find(
          (item) =>
            item.NumeroMedidor.toString() ===
            newNovedad.numeroMedidor?.toString()
        );
        sendNovedad(newNovedad, matchingData?._id || "")
          .then(() => {
            Alert.alert("Éxito", "Novedad enviado correctamente.");
            const filter = offLine.filter(
              (item) => item.NumeroMedidor !== newNovedad.numeroMedidor
            );
            setOffLine(filter);
            handlerClean();
          })
          .catch((error) => {
            Alert.alert("Error", error.message);
          });
      } else {
        SaveOffline(newNovedad);
      }
    }
  };
  const handlerClean = () => {
    clearAte();
    setValue_medidor(null);
    setValue_direccion(null);
    setValue_tipoNovedad(null);
    setValue_lectura(null);
    setValue_comentario(null);
    setPhotoUri(null);
    if (newNovedad) {
      setNewNovedad({
        direccion: null,
        numeroMedidor: null,
        comentario: null,
        lectura: null,
        foto: null,
        tipoNovedad: null,
      });
    }
  };
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: value_tipoNovedad != "67ac4d7e13432b2cbf379597",
      allowsMultipleSelection: value_tipoNovedad === "67ac4d7e13432b2cbf379597",
      selectionLimit: 2,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      if (value_tipoNovedad === "67ac4d7e13432b2cbf379597") {
        setPhotoArray(result.assets.map((item) => item.uri));
      } else {
        setPhotoUri(result.assets[0].uri);
      }
    }
  };
  const SaveOffline = async (newNovedad: Novedad) => {
    try {
      let storedNovedades = await SecureStore.getItemAsync("pendingNovedades");
      let novedadesArray = storedNovedades ? JSON.parse(storedNovedades) : [];

      // Check if a novedad with the same numeroMedidor already exists
      const exists = novedadesArray.some(
        (novedad: Novedad) => novedad.numeroMedidor === newNovedad.numeroMedidor
      );
      if (exists) {
        Alert.alert(
          "Error",
          "Ya existe una novedad con este número de medidor."
        );
        handlerClean();
        return;
      }
      novedadesArray.push(newNovedad);
      await SecureStore.setItemAsync(
        "pendingNovedades",
        JSON.stringify(novedadesArray)
      );
      alert("✅ Novedad guardada localmente.");
      handlerClean();
    } catch (error) {
      console.error("❌ Error guardando la novedad:", error);
    }
  };
  const SaveAteOffline = async (
    id_ate: string | null,
    tipo: string,
    fotoUri: string | null
  ) => {
    try {
      let storedAte = await SecureStore.getItemAsync("pendingAte");
      let ateArray = storedAte ? JSON.parse(storedAte) : [];

      // Check if a novedad with the same numeroMedidor already exists
      const exists = ateArray.some((ate: any) => ate.id_ate === id_ate);
      if (exists) {
        Alert.alert("Error", "Ya existe una ATE con este número de medidor.");
        handlerClean();
        return;
      }
      ateArray.push({ id_ate, tipo, fotoUri });
      await SecureStore.setItemAsync("pendingAte", JSON.stringify(ateArray));
      alert("✅ Atencion especial guardada localmente.");
      handlerClean();
    } catch (error) {
      console.error("❌ Error guardando la ATE:", error);
    }
  };
  const filterElement = async (numeroMedidor: Number) => {
    const filter = offLine.filter(
      (item) => item.NumeroMedidor !== numeroMedidor
    );
    setOffLine(filter);
  };
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (wasConnected === false && state.isConnected) {
        SecureStore.getItemAsync("pendingNovedades").then((novedades) => {
          if (novedades) {
            let novedadesArray = JSON.parse(novedades);
            let novedadesPendientes: Novedad[] = [];

            novedadesArray.forEach(async (novedad: Novedad) => {
              try {
                const matchingData = offLine.find(
                  (item) =>
                    item.NumeroMedidor.toString() ===
                    novedad.numeroMedidor?.toString()
                );
                await sendNovedad(novedad, matchingData?._id || "").then(
                  async () => {
                    console.log(
                      "✅ Novedad enviada correctamente desde local."
                    );
                    if (novedad.numeroMedidor !== null) {
                      await filterElement(novedad.numeroMedidor);
                    }
                  }
                );
              } catch (error) {
                console.log("❌ Error al enviar la novedad:", error);
                novedadesPendientes.push(novedad); // Guardar solo las que fallaron
              }
            });

            // Actualizar almacenamiento con las pendientes
            if (novedadesPendientes.length > 0) {
              SecureStore.setItemAsync(
                "pendingNovedades",
                JSON.stringify(novedadesPendientes)
              );
            } else {
              SecureStore.deleteItemAsync("pendingNovedades");
            }
          }
        });

        SecureStore.getItemAsync("pendingAte").then((ate) => {
          if (ate) {
            let ateArray = JSON.parse(ate);
            let atePendientes: Ate[] = [];
            ateArray.forEach(async (ateItem: Ate) => {
              try {
                await sendAte(ateItem.id_ate, ateItem.tipo, ateItem.fotoUri);
                console.log("✅ ATE enviada correctamente desde local.");
              } catch (error) {
                console.error("❌ Error al enviar la ATE:", error);
                atePendientes.push(ateItem);
              }
            });

            // Actualizar almacenamiento con las que fallaron
            if (atePendientes.length > 0) {
              SecureStore.setItemAsync(
                "pendingAte",
                JSON.stringify(atePendientes)
              );
            } else {
              SecureStore.deleteItemAsync("pendingAte");
            }
          }
        });
      }
      setWasConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, [wasConnected]);

  useEffect(() => {
    if (newNovedad) {
      setValue_medidor(newNovedad.numeroMedidor?.toString() || null);
      setValue_direccion(newNovedad.direccion);
      setValue_tipoNovedad(
        items_tipo.find((item) => item.value === newNovedad.tipoNovedad)
          ?.value || null
      );
      setValue_lectura(newNovedad.lectura);
      setValue_comentario(newNovedad.comentario);
    }
  }, [newNovedad]);
  useEffect(() => {
    if (newAte.numeroMedidor) {
      setValue_medidor(newAte.numeroMedidor.toString());
      setValue_direccion(newAte.direccion);
      setValue_tipoNovedad(
        items_tipo.find((item) => item.label === newAte.tipo)?.value || null
      );
    }
  }, [newAte]);
  //console.log(tipoNovedad);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.containerTitle}>
          <View style={styles.titleContainer}>
            <ClipboardPen size={32} color="black" strokeWidth={2} />
            <Text style={styles.title}>Formulario</Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.nMedidorContainer}>
            <Text style={styles.label}>Número de medidor</Text>
            {newAte.numeroMedidor && (
              <TouchableOpacity
                onPress={handlerClean}
                style={styles.clearButtom}
              >
                <XCircle size={24} color="red" />
              </TouchableOpacity>
            )}
          </View>
          <OmnipotentInput
            value={value_medidor ? value_medidor.toString() : ""}
            onChangeText={(text) => setValue_medidor(text)}
            setDireccion={setValue_direccion}
            editable={!newAte.numeroMedidor}
          />

          <Text style={styles.label}>Dirección</Text>
          <Text style={styles.inputDireccion}>{value_direccion}</Text>
          <Text style={styles.label}>Tipo</Text>
          <DropDownPicker
            style={styles.dropdown}
            listMode="SCROLLVIEW"
            placeholder="Seleccione tipo de formulario"
            containerStyle={styles.dropdownContainer}
            labelStyle={styles.dropdownLabel}
            open={open_novedad}
            value={value_tipoNovedad}
            items={filteredItems}
            setOpen={setOpen_novedad}
            setValue={setValue_tipoNovedad}
            setItems={setItems_tipo}
            disabled={newAte.tipo ? true : false}
          />
          {/*value_tipoNovedad != '67ac4d7e13432b2cbf379597'*/}
          {value_tipoNovedad != "67ac4d7e13432b2cbf379597" ? (
            <>
              <Text style={styles.label}>Comentarios</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Ingrese comentario"
                multiline
                numberOfLines={4}
                maxLength={240}
                onChangeText={(text) => setValue_comentario(text)}
                value={value_comentario || undefined}
              />
              {value_tipoNovedad === "678ef5f4501063e29023da47" ? (
                <></>
              ) : (
                <>
                  <Text style={styles.label}>Lectura correcta</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese lectura correcta"
                    keyboardType="numeric"
                    maxLength={5}
                    onChangeText={(text) => setValue_lectura(Number(text))}
                    value={value_lectura ? value_lectura.toString() : ""}
                  />
                </>
              )}
            </>
          ) : (
            <>
              <Text style={styles.label}>Lectura Caldera</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese lectura correcta"
                keyboardType="numeric"
                maxLength={5}
                onChangeText={(text) => setValue_comentario(text)}
                value={value_comentario || undefined}
              />
              <Text style={styles.label}>Lectura Corrector</Text>
              <TextInput
                style={styles.input}
                placeholder="Ingrese lectura correcta"
                keyboardType="numeric"
                maxLength={5}
                onChangeText={(text) => setValue_lectura(Number(text))}
                value={value_lectura ? value_lectura.toString() : ""}
              />
            </>
          )}
          <View style={styles.photoContainer}>
            <Text style={styles.label}>Fotografía</Text>
            <View style={styles.photoActions}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={pickImageAsync}
              >
                <ImagePlus size={42} color="#989898" />
              </TouchableOpacity>
              {value_tipoNovedad != "67ac4d7e13432b2cbf379597" ? (
                <>
                  <TouchableOpacity
                    style={styles.iconButton}
                    onPress={openCamera}
                  >
                    <Camera size={42} color="#989898" />
                  </TouchableOpacity>
                  <View style={styles.fileInput}>
                    <Text style={styles.fileName}>
                      {photoUri
                        ? photoUri.split("/").pop()?.slice(0, 8) + "... .jpg"
                        : "No hay imagen adjunta"}
                    </Text>
                    {photoUri && (
                      <TouchableOpacity onPress={() => setPhotoUri(null)}>
                        <CircleX size={24} color="red" />
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              ) : (
                <View style={styles.fileInput2}>
                  {photoArray && (
                    <TouchableOpacity
                      onPress={() => setPhotoArray([])}
                      style={styles.clearButtom2}
                    >
                      <CircleX size={24} color="red" />
                    </TouchableOpacity>
                  )}
                  <Text style={styles.fileName}>
                    {photoArray.length > 0
                      ? photoArray[0].split("/").pop()?.slice(0, 8) + "... .jpg"
                      : "No hay imagen adjunta"}
                  </Text>
                  <Text style={styles.fileName}>
                    {photoArray[1]
                      ? photoArray[1].split("/").pop()?.slice(0, 8) + "... .jpg"
                      : "No hay imagen adjunta"}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handlerSend}>
            <Text style={styles.submitButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  nMedidorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#e7e7e7",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: "#e7e7e7",
  },
  containerTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "5%",
    borderBottomColor: "black",
    borderBottomWidth: 1,
    backgroundColor: "white",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  formContainer: {
    padding: "5%",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3d3d3d",
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  inputDireccion: {
    textAlignVertical: "center",
    fontSize: 14,
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
  },
  textArea: {
    fontSize: 16,
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
    textAlignVertical: "top",
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdown: {
    borderColor: "#d1d1d1",
    borderRadius: 12,
  },
  dropdownLabel: {
    color: "black",
  },
  photoContainer: {
    marginBottom: 20,
  },
  photoActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    width: 65,
    height: 65,
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#d1d1d1",
  },
  fileInput: {
    flex: 1,
    flexDirection: "row",
    height: 65,
    padding: 10,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileName: {
    fontSize: 16,
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#0057b7",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButtom: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  clearButtom2: {
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    position: "absolute",
    right: 0,
    top: 0,
  },
  fileInput2: {
    flex: 1,
    flexDirection: "column",
    height: 65,
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
});
