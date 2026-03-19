import { StyleSheet,  View } from "react-native";
import Map from "@/components/Map/map";
export default function RutaScreen() {
  return (
    <View style={styles.container}>
      <Map/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  picker: {
    height: 50, // Ajustado para ser menos intrusivo
    width: 300,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
  },
});
