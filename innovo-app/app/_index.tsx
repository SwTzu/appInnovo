import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Image,
  ScrollView,
} from "react-native";
import { formatRut } from "react-rut-formatter";
import * as NavigationBar from "expo-navigation-bar";
import { useAuth } from "@/contexts/AuthProvider";
import { router } from "expo-router";
import { delay } from "lodash";
NavigationBar.setVisibilityAsync("hidden");
/*const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const scale = SCREEN_WIDTH / 375;
function normalize(size: number) {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
}*/

export default function IndexScreen() {
  const { login, isAuthenticated } = useAuth();
  const [rut, setRut] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!rut || !password) {
      alert("Por favor, complete todos los campos.");
      return;
    }
    await login(rut, password);
  };
  useEffect(() => {
    if (isAuthenticated) {
      delay(() => {
        router.dismissTo("/(lector)/home");
      }, 400);
    }
  }, [isAuthenticated]);
  return (
    <KeyboardAvoidingView style={styles.container} behavior="height">
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.header}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={{ width: 150, height: 150 }}
          />
          <Text style={styles.headerTitle}>Innovo APP</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.headerSubtitle}>Ingresa tus credenciales</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rut</Text>
              <TextInput
                style={styles.input}
                placeholder="Introduce tu Rut"
                inputMode="numeric"
                keyboardType="default"
                autoCapitalize="none"
                value={rut}
                onChangeText={(text) => {
                  setRut(formatRut(text)); // Aplicar formateo al cambiar texto
                }}
                maxLength={10}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <TextInput
                style={styles.input}
                placeholder="Introduce tu contraseña"
                secureTextEntry={true}
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => setPassword(text)}
                maxLength={20}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Ingresar" color="#0057b7" onPress={handleLogin} />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  header: {
    width: "100%",
    aspectRatio: 16 / 9, // Esto mantendrá una proporción constante
    backgroundColor: "#0057b7",
    justifyContent: "center",
    alignItems: "center",
    borderBottomRightRadius: 180,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    paddingBottom: 10,
  },
  headerSubtitle: {
    fontSize: 18,
    color: "black",
    marginBottom: 15,
    alignSelf: "center",
    fontFamily: "bold",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20, // Añadir padding en la parte inferior
  },
  form: {
    width: "75%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    color: "black",
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    backgroundColor: "#f2f2f2",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 12,
  },
  buttonContainer: {
    marginVertical: 16,
  },
});
