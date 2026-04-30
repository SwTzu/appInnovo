import { Platform } from "react-native";

export const colors = {
  brand: "#0057b7",
  brandDark: "#003f86",
  brandSoft: "#e8f2ff",
  accent: "#13a8a3",
  background: "#f4f7fb",
  surface: "#ffffff",
  surfaceMuted: "#eef4fb",
  text: "#172033",
  textMuted: "#667085",
  textSubtle: "#98a2b3",
  border: "#d9e3ef",
  borderStrong: "#b9c8da",
  success: "#16805d",
  successSoft: "#dff7ec",
  warning: "#b66a00",
  warningSoft: "#fff2d6",
  danger: "#c62828",
  dangerSoft: "#ffe3e3",
  info: "#0877c9",
  infoSoft: "#e5f4ff",
  overlay: "rgba(9, 21, 38, 0.58)",
  white: "#ffffff",
  black: "#000000",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  pill: 999,
};

export const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 28,
  display: 34,
};

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
    },
    android: {
      elevation: 3,
    },
    default: {
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 18,
    },
  }),
  floating: Platform.select({
    ios: {
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.14,
      shadowRadius: 24,
    },
    android: {
      elevation: 8,
    },
    default: {
      shadowColor: "#0f172a",
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.14,
      shadowRadius: 24,
    },
  }),
};

export const hitSlop = {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
};
