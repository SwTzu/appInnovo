import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, ClipboardCheck, MapPin } from "lucide-react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalContext";
import type { Ate } from "@/types/interfaces";
import { Badge, Card, EmptyState } from "@/components/ui";
import { colors, fontSizes, radius, spacing } from "@/constants/theme";

const TablaAte: React.FC = () => {
  const { setNewAte, dataAte } = useGlobalContext();

  const handlerAte = (item: Ate) => {
    setNewAte(item);
    router.push("/(lector)/modalAte");
  };

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Atenciones especiales</Text>
          <Text style={styles.subtitle}>Pendientes asignadas para tu ruta.</Text>
        </View>
        <Badge label={`${dataAte.length}`} tone={dataAte.length > 0 ? "warning" : "success"} />
      </View>

      {dataAte.length > 0 ? (
        <View style={styles.list}>
          {dataAte.map((item, index) => (
            <Pressable
              key={item.id_ate ?? `${item.numeroMedidor}-${index}`}
              accessibilityRole="button"
              onPress={() => handlerAte(item)}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View style={styles.pinShell}>
                <MapPin size={18} color={colors.brand} />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.address} numberOfLines={2}>
                  {item.direccion || "Dirección sin registrar"}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.meta} numberOfLines={1}>
                    {item.sector || "Sin sector"}
                  </Text>
                  <Text style={styles.dot}>•</Text>
                  <Text style={styles.meta} numberOfLines={1}>
                    {item.tipo || "ATE"}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color={colors.textMuted} />
            </Pressable>
          ))}
        </View>
      ) : (
        <EmptyState
          compact
          icon={<ClipboardCheck size={24} color={colors.success} />}
          title="Sin atenciones pendientes"
          description="Cuando tengas ATE asignadas aparecerán en esta lista."
        />
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: "900",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    marginTop: spacing.xs,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    minHeight: 74,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  rowPressed: {
    opacity: 0.76,
  },
  pinShell: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandSoft,
  },
  rowContent: {
    flex: 1,
    gap: spacing.xs,
  },
  address: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: "900",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  meta: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    fontWeight: "700",
    maxWidth: 110,
  },
  dot: {
    color: colors.textSubtle,
    fontSize: fontSizes.xs,
  },
});

export default TablaAte;
