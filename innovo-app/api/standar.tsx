import { router } from "expo-router";
//import rutasData from "../data/rutas.json"; // Importar datos de rutas
import * as SecureStore from "expo-secure-store";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

type LoginSession = {
  token: string;
  refreshToken?: string;
};
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
export const loginApi = async (
  rut: string,
  clave: string,
  ID: string,
  pushToken: string
): Promise<LoginSession | null> => {
  if (!rut || !clave || !ID || !pushToken) {
    alert("Por favor, complete todos los campos");
    return null;
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
      return {
        token: data.token,
        refreshToken: data.refreshToken,
      };
    }
    else if (response.status === 401) {
      alert("Sesion expirada, por favor inicie sesion nuevamente");
      router.replace("/_index");
      return null;
    }
  } 
    catch (error) {
    console.error("error", error);
  }
  return null;
};
export const validarToken = async (): Promise<string | null> => {
  try {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      const response = await fetch(`${apiUrl}token/validarToken`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        return token;
      }
      else if (response.status === 401) {
        alert("Sesion expirada, por favor inicie sesion nuevamente");
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error("error", error);
    return null;
  }
  return null;
}

export const refreshSessionApi = async (): Promise<LoginSession | null> => {
  try {
    const refreshToken = await SecureStore.getItemAsync("refreshToken");
    if (!refreshToken) {
      return null;
    }

    const response = await fetch(`${apiUrl}token/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-refresh-token": refreshToken,
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("error", error);
    return null;
  }
  return null;
}
