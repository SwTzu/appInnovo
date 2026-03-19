import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { X } from "lucide-react-native";
const ModalCalendar = () => {
  const { calendarSelected, setCalendarSelected } = useGlobalContext();
  const handlerClose = () => {
    setCalendarSelected(undefined);
    router.back();
  };
  return (
    <View style={styles.container}>
      <View style={styles.modalView}>
        <TouchableOpacity style={styles.closeButton} onPress={handlerClose}>
          <X size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>{calendarSelected?.tipo ? (calendarSelected.tipo.charAt(0).toUpperCase() + calendarSelected.tipo.slice(1)) : ''}</Text>
        <View style={styles.scrollView}>
          <View style={styles.dataItem}>
            <Text style={styles.label}>Ruta</Text>
            <Text style={styles.value}>{calendarSelected?.ruta}</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.label}>Sector</Text>
            <Text style={styles.value}>{calendarSelected?.sector}</Text>
          </View>
          <View style={styles.dataItem}>
            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.value}>
                {calendarSelected?.fecha_asignacion ? new Date(calendarSelected.fecha_asignacion).toLocaleDateString('es-ES') : ''}
            </Text>
          </View>
          {/** aplicar datos de zonal cuando se haga */}
          <View style={styles.dataItem}>
            <Text style={styles.label}>Zonal</Text>
            <Text style={styles.value}>
            {calendarSelected?.empresa}
            </Text>
          </View>
          {/** aplicar datos de zonal cuando se haga */}
          <View style={styles.dataItem}>
            <Text style={styles.label}>Direcciones</Text>
            <Text style={styles.value}>{calendarSelected?.direcciones}</Text>
          </View>
            <View style={styles.dataItemend}>
            {calendarSelected?.ate && calendarSelected.ate > 0 ? (
              <>
              <Text style={styles.label}>
                Atenciones especiales
              </Text>
              <Text style={styles.value}>
                {calendarSelected.ate}
              </Text>
              </>
            ) : (
              <Text style={styles.center}>Sin atenciones especiales</Text>
            )}
            </View>
        </View>
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
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
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
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  scrollView: {
    width: "100%",
  },
  dataItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dataItemend: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  center: {
    fontSize: 16,
    fontWeight: "semibold",
    alignSelf: "center",
    textAlign: "center",
    color: "gray",
    flex: 1,
  },
});

export default ModalCalendar;
