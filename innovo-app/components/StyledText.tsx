import React from "react";
import { StyleSheet, TextProps } from "react-native";
import { ThemedText } from "@/components/ThemedText";

export function MonoText({ style, ...props }: TextProps) {
  return <ThemedText style={[style, styles.mono]} {...props} />;
}

const styles = StyleSheet.create({
  mono: {
    fontFamily: "SpaceMono",
  },
});
