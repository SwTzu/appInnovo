import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { CalendarDays, X } from "lucide-react-native";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { AppHeader, Badge, IconButton, InfoRow, ModalSheet } from "@/components/ui";
import { colors, fontSizes, spacing } from "@/constants/theme";

const formatTitle = (value?: string) => {
  if (!value) return "Asignación";
  return value.charAt(0).toUpperCase() + value.slice(1);
};

const ModalCalendar = () => {
  const { calendarSelected, setCalendarSelected } = useGlobalContext();

  const handlerClose = () => {
    setCalendarSelected(undefined);
    router.back();
  };

  const dateLabel = calendarSelected?.fecha_asignacion
    ? new Date(calendarSelected.fecha_asignacion).toLocaleDateString("es-CL")
    : "";

  return (
    <ModalSheet>
      <View style={styles.close}>
        <IconButton
          label="Cerrar"
          variant="plain"
          size={40}
          icon={<X size={20} color={colors.text} />}
          onPress={handlerClose}
        />
      </View>

      <AppHeader
        title={formatTitle(calendarSelected?.tipo)}
        subtitle="Detalle de la asignación seleccionada."
        icon={<CalendarDays size={22} color={colors.brand} />}
        action={
          <Badge
            label={calendarSelected?.ate && calendarSelected.ate > 0 ? `${calendarSelected.ate} ATE` : "Sin ATE"}
            tone={calendarSelected?.ate && calendarSelected.ate > 0 ? "warning" : "success"}
          />
        }
        style={styles.header}
      />

      <InfoRow label="Ruta" value={calendarSelected?.ruta} />
      <InfoRow label="Sector" value={calendarSelected?.sector} />
      <InfoRow label="Fecha" value={dateLabel} />
      <InfoRow label="Zonal" value={calendarSelected?.empresa} />
      <InfoRow label="Direcciones" value={calendarSelected?.direcciones} last />

      <Text style={styles.hint}>Esta información proviene del calendario mensual de asignaciones.</Text>
    </ModalSheet>
  );
};

const styles = StyleSheet.create({
  close: {
    alignItems: "flex-end",
    marginBottom: spacing.xs,
  },
  header: {
    marginBottom: spacing.md,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginTop: spacing.lg,
  },
});

export default ModalCalendar;
