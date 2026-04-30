import { StyleSheet, View } from "react-native";
import Map from "@/components/Map/map";
import { colors } from "@/constants/theme";

export default function RutaScreen() {
  return (
    <View style={styles.container}>
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
