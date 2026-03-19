"use client"

import { useEffect, useState } from "react"
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  PixelRatio,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native"
import { Calendar, LocaleConfig } from "react-native-calendars"
import TablaAte from "@/components/home/TablaAte"
import { ThermometerSun, X } from "lucide-react-native"
import { getAsignaciones } from "@/api/trabajador"
import dayjs from "dayjs"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window")
const scale = SCREEN_WIDTH / 375

function normalize(size: number) {
  const newSize = size * scale
  return Math.round(PixelRatio.roundToNearestPixel(newSize))
}

interface Asignacion {
  fecha_asignacion: string
  ruta: string
  sector: string
  tipo: string
}

export default function HomeScreen() {
  const [error, setError] = useState<string | null>(null)
  const [indiceUV_h, setIndiceUV_h] = useState(0)
  const [indiceUV_m, setIndiceUV_m] = useState(0)
  const [markedDates, setMarkedDates] = useState({})
  const [selected, setSelected] = useState(dayjs().format("YYYY-MM-DD"))
  const [modalVisible, setModalVisible] = useState(false)
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([])

  useEffect(() => {
    ;(async () => {
      try {
        const asignaciones = await getAsignaciones()
        setAsignaciones(asignaciones)
        const marked = asignaciones.reduce((acc: { [x: string]: { marked: boolean; dotColor: string; selected: boolean; selectedColor: string } }, curr: { tipo: string; fecha_asignacion: string | number }) => {
          const color = curr.tipo === "lectura" ? "red" : "blue"
          acc[curr.fecha_asignacion] = {
            marked: true,
            dotColor: color,
            selected: true,
            selectedColor: color,
          }
          return acc
        }, {})
        setMarkedDates(marked)
        const response = await fetch(`https://indiceuv.cl/ws/wsIndiceUVREST.php?id_region=6`)
        const uvData = await response.json()
        setIndiceUV_h(uvData.data[0].max_diaria)
        setIndiceUV_m(uvData.data[0].max_manana)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(String(error))
        }
      }
    })()
  }, [])

  LocaleConfig.locales["es"] = {
    monthNames: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
    monthNamesShort: ["Ene.", "Feb.", "Mar.", "Abr.", "May.", "Jun.", "Jul.", "Ago.", "Sep.", "Oct.", "Nov.", "Dic."],
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Dom.", "Lun.", "Mar.", "Mié.", "Jue.", "Vie.", "Sáb."],
    today: "Hoy",
  }
  LocaleConfig.defaultLocale = "es"

  const handleDayPress = (day: { dateString: string }) => {
    setSelected(day.dateString)
    setModalVisible(true)
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {modalVisible && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <X size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Datos del {selected}</Text>
              {asignaciones
                .filter((asignacion) => asignacion.fecha_asignacion === selected)
                .map((asignacion, index) => (
                  <View key={index} style={styles.dataItem}>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Ruta:</Text>
                      <Text style={styles.value}>{asignacion.ruta}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Sector:</Text>
                      <Text style={styles.value}>{asignacion.sector}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Tipo:</Text>
                      <Text style={styles.value}>{asignacion.tipo}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        )}
        <View style={styles.container_indice}>
          <View style={styles.bloque_indice}>
            <ThermometerSun size={34} color="black" style={styles.iconUv} />
            <View style={styles.indice_bloque}>
              <Text style={styles.cardContent}>{"Máxima\nhoy"}</Text>
              <Text style={styles.cardTitle}>{indiceUV_h}</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.indice_bloque}>
              <Text style={styles.cardContent}>{"Máxima\nmañana"}</Text>
              <Text style={styles.cardTitle}>{indiceUV_m}</Text>
              <Text style={styles.indice_url}>indiceuv.cl</Text>
            </View>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tag_text}>Se recomienda el uso de protector solar</Text>
          </View>
        </View>
        <View style={styles.container_Tabla}>
          <TablaAte />
        </View>
        <View style={styles.container_calendar}>
          <Calendar
            style={styles.calendar}
            hideExtraDays
            disableArrowLeft
            disableArrowRight
            theme={{
              textMonthFontSize: normalize(18),
              textMonthFontWeight: "bold",
              monthTextColor: "black",
              textSectionTitleColor: "#3d3d3d",
              dayTextColor: "#2d4150",
              textDayFontSize: normalize(16),
              textDayHeaderFontSize: normalize(14),
            }}
            headerStyle={{
              borderBottomWidth: 1,
              borderBottomColor: "#e7e7e7",
            }}
            onDayPress={handleDayPress}
            markedDates={markedDates}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e7e7e7",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 15,
    gap: 10,
  },
  container_indice: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 10,
    padding: 10,
  },
  container_Tabla: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 10,
    padding: 10,
  },
  container_calendar: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 10,
    padding: 10,
  },
  bloque_indice: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  separator: {
    backgroundColor: "#e7e7e7",
    width: 2,
    height: "80%",
  },
  indice_bloque: {
    alignItems: "center",
    flex: 1,
  },
  tag: {
    marginTop: 10,
    backgroundColor: "#ffc0c0",
    borderRadius: 12,
    padding: 10,
  },
  tag_text: {
    fontSize: normalize(13),
    fontWeight: "bold",
    color: "#ff5757",
    textAlign: "center",
  },
  indice_url: {
    fontSize: normalize(12),
    color: "black",
    marginTop: 5,
  },
  cardTitle: {
    fontSize: normalize(36),
    fontWeight: "bold",
    color: "black",
  },
  cardContent: {
    fontSize: normalize(16),
    color: "black",
    textAlign: "center",
    marginBottom: 5,
  },
  iconUv: {
    position: "absolute",
    top: 10,
    left: 10,
  },
  calendar: {
    borderRadius: 16,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: normalize(20),
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  closeButton: {
    position: "absolute",
    right: 10,
    top: 10,
    padding: 10,
  },
  dataItem: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
    marginTop: 10,
    width: "100%",
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: normalize(14),
    color: "#333",
    fontWeight: "bold",
  },
  value: {
    fontSize: normalize(14),
    color: "#555",
  },
})

