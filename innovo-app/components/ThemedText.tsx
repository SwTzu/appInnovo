import React from "react";
import { StyleSheet, Text, TextProps } from "react-native";
import { colors, fontSizes } from "@/constants/theme";

export function ThemedText({ style, ...props }: TextProps) {
  return <Text style={[styles.default, style]} {...props} />;
}

const styles = StyleSheet.create({
  default: {
    color: colors.text,
    fontSize: fontSizes.md,
    lineHeight: 24,
  },
});
