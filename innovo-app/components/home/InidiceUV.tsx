import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ShieldCheck, ThermometerSun } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthProvider";
import { Badge, Card } from "@/components/ui";
import { colors, fontSizes, radius, spacing } from "@/constants/theme";

const getUvTone = (value: number) => {
  if (value >= 8) {
    return {
      label: "Alto",
      color: colors.danger,
      backgroundColor: colors.dangerSoft,
      badge: "danger" as const,
    };
  }

  if (value >= 5) {
    return {
      label: "Moderado",
      color: colors.warning,
      backgroundColor: colors.warningSoft,
      badge: "warning" as const,
    };
  }

  return {
    label: "Controlado",
    color: colors.success,
    backgroundColor: colors.successSoft,
    badge: "success" as const,
  };
};

const IndiceUV: React.FC = () => {
  const { uvData } = useAuth();
  const todayTone = getUvTone(Number(uvData.indiceUV_h || 0));

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconShell}>
          <ThermometerSun size={26} color={colors.brand} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.title}>Índice UV</Text>
          <Text style={styles.subtitle}>Máximas estimadas para la jornada.</Text>
        </View>
        <Badge label={todayTone.label} tone={todayTone.badge} />
      </View>

      <View style={styles.values}>
        <View style={[styles.valueBlock, { backgroundColor: todayTone.backgroundColor }]}>
          <Text style={styles.valueLabel}>Hoy</Text>
          <Text style={[styles.valueNumber, { color: todayTone.color }]}>
            {uvData.indiceUV_h ?? 0}
          </Text>
        </View>
        <View style={styles.valueBlock}>
          <Text style={styles.valueLabel}>Mañana</Text>
          <Text style={styles.valueNumber}>{uvData.indiceUV_m ?? 0}</Text>
        </View>
      </View>

      <View style={styles.recommendation}>
        <ShieldCheck size={18} color={colors.warning} />
        <Text style={styles.recommendationText}>
          Usar protector solar y mantener hidratación en ruta.
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    gap: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  iconShell: {
    width: 48,
    height: 48,
    borderRadius: radius.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.brandSoft,
  },
  headerText: {
    flex: 1,
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
  values: {
    flexDirection: "row",
    gap: spacing.md,
  },
  valueBlock: {
    flex: 1,
    minHeight: 112,
    borderRadius: radius.lg,
    padding: spacing.lg,
    backgroundColor: colors.surfaceMuted,
    justifyContent: "space-between",
  },
  valueLabel: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: "800",
  },
  valueNumber: {
    color: colors.text,
    fontSize: 44,
    fontWeight: "900",
  },
  recommendation: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.warningSoft,
  },
  recommendationText: {
    flex: 1,
    color: colors.warning,
    fontSize: fontSizes.sm,
    fontWeight: "800",
  },
});

export default IndiceUV;
