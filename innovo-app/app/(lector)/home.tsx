import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { CalendarDays, ClipboardList } from "lucide-react-native";
import { router } from "expo-router";
import TablaAte from "@/components/home/TablaAte";
import IndiceUV from "@/components/home/InidiceUV";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { AppHeader, Badge, Card, Screen } from "@/components/ui";
import { colors, fontSizes, radius, spacing } from "@/constants/theme";

LocaleConfig.locales.es = {
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
};
LocaleConfig.defaultLocale = "es";

export default function HomeScreen() {
  const { markedDates, setCalendarSelected, asignaciones, dataAte } = useGlobalContext();

  const handleDayPress = (day: { dateString: string }) => {
    const asignacion = asignaciones.find(
      (item) => item.fecha_asignacion === day.dateString
    );

    if (!asignacion) {
      return;
    }

    setCalendarSelected(asignacion);
    router.push("/(lector)/modalCalendar");
  };

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader
        eyebrow="Panel de terreno"
        title="Inicio"
        subtitle="Resumen de exposición, atenciones especiales y calendario operativo."
        icon={<ClipboardList size={24} color={colors.brand} />}
      />

      <IndiceUV />
      <TablaAte />

      <Card style={styles.calendarCard}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Calendario</Text>
            <Text style={styles.sectionSubtitle}>Toca una fecha marcada para ver el detalle.</Text>
          </View>
          <Badge
            label={`${asignaciones.length} asignaciones`}
            tone={asignaciones.length > 0 ? "brand" : "neutral"}
            icon={<CalendarDays size={14} color={asignaciones.length > 0 ? colors.brand : colors.textMuted} />}
          />
        </View>

        <Calendar
          style={styles.calendar}
          hideExtraDays
          disableArrowLeft
          disableArrowRight
          theme={{
            calendarBackground: colors.surface,
            monthTextColor: colors.text,
            textMonthFontWeight: "800",
            textMonthFontSize: 18,
            textDayFontSize: 15,
            textDayHeaderFontSize: 12,
            dayTextColor: colors.text,
            todayTextColor: colors.brand,
            selectedDayBackgroundColor: colors.brand,
            selectedDayTextColor: colors.white,
            textSectionTitleColor: colors.textMuted,
            textDisabledColor: colors.textSubtle,
          }}
          headerStyle={styles.calendarHeader}
          onDayPress={handleDayPress}
          markedDates={markedDates}
        />
      </Card>

      <View style={styles.footerStats}>
        <Badge label={`ATE pendientes: ${dataAte.length}`} tone={dataAte.length > 0 ? "warning" : "success"} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.xl,
  },
  calendarCard: {
    paddingBottom: spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: fontSizes.lg,
    fontWeight: "900",
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    marginTop: spacing.xs,
    maxWidth: 210,
  },
  calendar: {
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  calendarHeader: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  footerStats: {
    alignItems: "center",
    paddingBottom: spacing.xl,
  },
});
