import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { FilePenLine, MapPin, X } from "lucide-react-native";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { AppButton, AppHeader, Badge, IconButton, InfoRow, ModalSheet } from "@/components/ui";
import { colors, fontSizes, spacing } from "@/constants/theme";

const ModalAte = () => {
  const { newAte } = useGlobalContext();

  const handlerClose = () => {
    router.back();
  };

  const handlerAte = () => {
    router.replace("/(lector)/novedad");
  };

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
        title={newAte.tipo || "Atención especial"}
        subtitle="Revisa el detalle antes de iniciar la respuesta."
        icon={<MapPin size={22} color={colors.brand} />}
        action={<Badge label={newAte.sector || "Sin sector"} tone="neutral" />}
        style={styles.header}
      />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <InfoRow label="Dirección" value={newAte.direccion} />
        <InfoRow label="Número medidor" value={newAte.numeroMedidor} />
        <InfoRow label="Sector" value={newAte.sector} />
        <InfoRow label="Observación" value={newAte.comentario} />
        <InfoRow label="Latitud" value={newAte.lat} />
        <InfoRow label="Longitud" value={newAte.lng} last />
      </ScrollView>

      <Text style={styles.hint}>
        Al continuar, el formulario se cargará con los datos de esta atención.
      </Text>

      <AppButton
        title="Realizar atención especial"
        icon={<FilePenLine size={20} color={colors.white} />}
        onPress={handlerAte}
      />
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
  scroll: {
    maxHeight: 360,
  },
  hint: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginVertical: spacing.lg,
  },
});

export default ModalAte;
