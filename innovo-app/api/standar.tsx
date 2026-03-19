import { router } from "expo-router";
//import rutasData from "../data/rutas.json"; // Importar datos de rutas
import * as SecureStore from "expo-secure-store";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
export const test = async (state: boolean) => {
  try {
    const response = await fetch(`${apiUrl}`, {
      method: "GET",
    });
    if(response.ok){
      state = true;
    } 
  } catch (error) {
    state=false;
    console.error("error test", error);
  }
};
export const loginApi = async (rut: string, clave: string, ID:string, pushToken:string) => {
  if (!rut || !clave || !ID || !pushToken) {
    alert("Por favor, complete todos los campos");
    return false;
  }
  try {
    const response = await fetch(
      `${apiUrl}trabajador/login`,
      {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rut: rut,
        clave: clave,
        ID: ID,
        tokenPush: pushToken,
      }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      const token = data.token;
      return token;
    }
    else if (response.status === 401) {
      alert("Sesion expirada, por favor inicie sesion nuevamente");
      router.replace("/_index");
      return false;
    }
  } 
    catch (error) {
    console.error("error", error);
  }
};
export const validarToken = async () => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      const response = await fetch(`${apiUrl}token/validarToken`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
        }),
      });
      if (response.ok) {
        return token;
      }
      else if (response.status === 401) {
        alert("Sesion expirada, por favor inicie sesion nuevamente");
        return false;
      }
    } else {
      return false;
    }
  } catch (error) {
    console.error("error", error);
    return false;
  }
}
