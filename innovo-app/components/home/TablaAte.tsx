import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalContext";
interface Ate {
  id_ate: string | null;
  direccion: string | null;
  sector: string | null;
  tipo: string | null;
  comentario: string | null;
  lat: number | null;
  lng: number | null;
  numeroMedidor: number | null;
}
const TablaAte: React.FC = () => {
  const { setNewAte, dataAte} = useGlobalContext();
  const handlerAte = (item: Ate) => {
    setNewAte(item);
    router.push("/(lector)/modalAte");
  };
  return (
    <View style={styles.container}>
      <Text
        style={styles.Titulo}
      >
        Atenciones Especiales
      </Text>
      <View style={styles.header}>
        <Text style={styles.headerCell}>Dirección</Text>
        <Text style={styles.headerCell}>Sector</Text>
        <Text style={styles.headerCell}>Tipo</Text>
      </View>
      {dataAte.length > 0 ? (
        <ScrollView style={{ minHeight: 100, maxHeight:'100%'}}>
          {dataAte.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.row,
                index === dataAte.length - 1 && { borderBottomWidth: 0 },
              ]}
              onPress={() => handlerAte(item)}
            >
              <Text style={styles.cell}>{item.direccion}</Text>
              <Text style={styles.cell}>{item.sector}</Text>
              <Text style={styles.cellTipo}>{item.tipo}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No hay Atenciones Especiales asignados
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 4,
    height: "100%",
  },
  Titulo:{
    color: "black",
    borderBottomWidth: 1,
    fontWeight: "bold",
    fontSize: 16,
    paddingBottom: 8,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  headerCell: {
    flex: 1,
    padding: 4,
    textAlign: "center",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d1d1d1",
    marginHorizontal: 5, // Ajuste para reducir el ancho del borde inferior
  },
  cell: {
    flex: 1,
    padding: 4,
    textAlign: "center",
    color: "#5d5d5d",
    fontSize: 12,
  },
  cellTipo: {
    flex: 1,
    padding: 4,
    textAlign: "center",
    color: "#5d5d5d",
    fontSize: 12,
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#5d5d5d",
  },
});

export default TablaAte;
