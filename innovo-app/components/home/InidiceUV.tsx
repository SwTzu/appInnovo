import { ThermometerSun } from "lucide-react-native";
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/AuthProvider";
const IndiceUV: React.FC = () => {
  const { uvData} = useAuth(); 
  return (
    <View style={styles.container_indice}>
      <View style={styles.bloque_indice}>
        <ThermometerSun size={34} color="black" style={styles.iconUv} />
        <View style={styles.indice_bloque}>
          <Text style={styles.cardContent}>{"Máxima\nhoy"}</Text>
          <Text style={styles.cardTitle}>{uvData.indiceUV_h}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.indice_bloque}>
          <Text style={styles.cardContent}>{"Máxima\nmañana"}</Text>
          <Text style={styles.cardTitle}>{uvData.indiceUV_m}</Text>
          <Text style={styles.indice_url}>indiceuv.cl</Text>
        </View>
      </View>
      <View style={styles.tag}>
        <Text style={styles.tag_text}>
          Se recomienda el uso de protector solar.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container_indice: {
    backgroundColor: "white",
    borderRadius: 12,
    flexDirection: "column",
    justifyContent: "center",
    maxHeight: "30%", //estandarizar
    marginHorizontal: 10, //estandarizar
    marginTop: 10, //estandarizar
  },
  bloque_indice: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 48, //estandarizar
    fontWeight: "bold",
    color: "black",
    marginBottom: 20, //estandarizar
  },
  cardContent: {
    fontSize: 22, //estandarizar
    color: "black",
    textAlign: "center",
  },
  indice_bloque: {
    marginTop: 10,
    fontSize: 18, //estandarizar
    fontWeight: "bold",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderColor: "#e7e7e7",
  },
  iconUv: {
    width: 50,
    height: 50,
    position: "absolute",
    top: 0,
    left: 0,
  },
  indice_url: {
    fontSize: 18, //estandarizar
    color: "black",
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  tag: {
    margin: 10,
    backgroundColor: "#ffc0c0",
    borderRadius: 12,
  },
  tag_text: {
    fontSize: 13, //estandarizar
    fontWeight: "bold",
    color: "#ff5757",
    textAlign: "center",
  },
  separator: {
    backgroundColor: "#e7e7e7",
    height: "80%",
    position: "absolute",
    alignSelf: "center",
    width: 2,
  },
});

export default IndiceUV;
