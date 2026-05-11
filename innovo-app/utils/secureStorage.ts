import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const webStorage = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
};

export const getItemAsync = async (key: string) => {
  if (Platform.OS === "web") {
    return webStorage()?.getItem(key) ?? null;
  }

  return SecureStore.getItemAsync(key);
};

export const setItemAsync = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    webStorage()?.setItem(key, value);
    return;
  }

  return SecureStore.setItemAsync(key, value);
};

export const deleteItemAsync = async (key: string) => {
  if (Platform.OS === "web") {
    webStorage()?.removeItem(key);
    return;
  }

  return SecureStore.deleteItemAsync(key);
};
