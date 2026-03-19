import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalContext";
import {X, FilePenLine} from "lucide-react-native";

const ModalAte = () => {
  const { newAte } = useGlobalContext();
  const data = newAte;

  const handlerClose = () => {
    router.back();
  };
  const handlerAte = () => {
    router.replace("/(lector)/novedad");
  };
  const renderDataItem = (label: string, value: string, isLast: boolean) => (
    <View style={[styles.dataItem, isLast && styles.lastDataItem]}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.closeButton} onPress={handlerClose}>
          <X size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{data.tipo}</Text>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {renderDataItem("Dirección", data.direccion ?? '', false)}
          {renderDataItem("Número Medidor", data.numeroMedidor?.toString() ?? '', false)}
          {renderDataItem("Sector", data.sector ?? '', false)}
          {renderDataItem("Observación", data.comentario ?? '', false)}
          {renderDataItem("Latitud", data.lat?.toString() ?? '', false)}
          {renderDataItem("Longitud", data.lng?.toString() ?? '', true)}
        </ScrollView>
        <TouchableOpacity style={styles.novedadButton} onPress={handlerAte}>
          <Text>Realizar atención especial</Text>
          <FilePenLine size={24} color="#0057b7" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: '90%',
    maxHeight: '79%',
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  scrollView: {
    width: '100%',
  },
  dataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    flex: 1,
  },
  value: {
    fontSize: 12,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  lastDataItem: {
    borderBottomWidth: 0,
  },
  novedadButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    padding: 8,
    marginTop: 10,
    backgroundColor: '#D3E6FD',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#0057b7',
    alignSelf: 'flex-end',
  },
});

export default ModalAte;