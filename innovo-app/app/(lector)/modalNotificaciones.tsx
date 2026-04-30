import React, { useEffect, useMemo } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import {
  AlertCircle,
  Bell,
  ChevronLeft,
  FileText,
  Mail,
  MailOpen,
  Trash2,
} from "lucide-react-native";
import { useGlobalContext } from "@/contexts/GlobalContext";
import type { Notificacion } from "@/types/interfaces";
import { deleteNotificacion, getNotificaciones, updateStateNotificacion } from "@/api/trabajador";
import { AppHeader, Badge, Card, EmptyState, IconButton, Screen } from "@/components/ui";
import { colors, fontSizes, radius, spacing } from "@/constants/theme";

export default function NotificacionesModal() {
  const { notificaciones, setNotificaciones } = useGlobalContext();

  useEffect(() => {
    if (notificaciones.length === 0) {
      getNotificaciones().then((nextNotificaciones) => {
        setNotificaciones(nextNotificaciones || []);
      });
    }
  }, []);

  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case "alert":
        return <AlertCircle size={22} color={colors.warning} />;
      case "msg":
        return <Mail size={22} color={colors.brand} />;
      case "document":
        return <FileText size={22} color={colors.info} />;
      default:
        return <Bell size={22} color={colors.brand} />;
    }
  };

  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: Notificacion[] } = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notificaciones.forEach((notificacion: Notificacion) => {
      const notifDate = new Date(notificacion.fecha);
      let groupKey;

      if (notifDate.toDateString() === today.toDateString()) {
        groupKey = "Hoy";
      } else if (notifDate.toDateString() === yesterday.toDateString()) {
        groupKey = "Ayer";
      } else {
        groupKey = notifDate.toLocaleDateString("es-CL", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notificacion);
    });

    return Object.entries(groups).sort((a, b) => {
      if (a[0] === "Hoy") return -1;
      if (b[0] === "Hoy") return 1;
      if (a[0] === "Ayer") return -1;
      if (b[0] === "Ayer") return 1;
      return new Date(b[1][0].fecha).getTime() - new Date(a[1][0].fecha).getTime();
    });
  }, [notificaciones]);

  const handleNotificationPress = (notification: Notificacion) => {
    updateStateNotificacion(notification.id).then((res) => {
      if (res.ok) {
        const updatedNotifications = notificaciones.map((notificacion: Notificacion) =>
          notificacion.id === notification.id
            ? { ...notificacion, estado: true }
            : notificacion
        );
        setNotificaciones(updatedNotifications);
      } else {
        Alert.alert("Error", "No se pudo actualizar el estado de la notificación.");
      }
    });
    router.push({
      pathname: "/(lector)/modalNotificacion",
      params: { notification: JSON.stringify(notification) },
    });
  };

  const handleDeleteNotification = (id: string) => {
    Alert.alert(
      "Eliminar notificación",
      "Al eliminar la notificación aceptas la responsabilidad sobre su contenido. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: async () => {
            const res = await deleteNotificacion(id);
            if (res.ok) {
              const updatedNotifications = notificaciones.filter(
                (notificacion: Notificacion) => notificacion.id !== id
              );
              setNotificaciones(updatedNotifications);
            } else {
              Alert.alert("Error", "No se pudo eliminar la notificación.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const renderNotificationItem = (item: Notificacion) => (
    <Pressable
      style={({ pressed }) => [styles.notificationItem, pressed && styles.pressed]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIcon}>{getIconForType(item.tipo)}</View>
      <View style={styles.notificationContent}>
        <View style={styles.titleRow}>
          <Text numberOfLines={1} style={styles.notificationTitle}>
            {item.titulo || "Notificación"}
          </Text>
          {item.estado ? (
            <MailOpen size={18} color={colors.success} />
          ) : (
            <Mail size={18} color={colors.warning} />
          )}
        </View>
        <Text style={styles.notificationDescription} numberOfLines={2} ellipsizeMode="tail">
          {item.mensaje}
        </Text>
        <Text style={styles.notificationTime}>
          {new Date(item.fecha).toLocaleTimeString("es-CL", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
      <IconButton
        label="Eliminar notificación"
        variant="danger"
        size={38}
        icon={<Trash2 size={18} color={colors.danger} />}
        onPress={() => handleDeleteNotification(item.id)}
      />
    </Pressable>
  );

  return (
    <Screen contentStyle={styles.content}>
      <View style={styles.topRow}>
        <IconButton
          label="Volver"
          variant="plain"
          size={44}
          icon={<ChevronLeft size={24} color={colors.text} />}
          onPress={() => router.back()}
        />
      </View>

      <AppHeader
        eyebrow="Bandeja"
        title="Notificaciones"
        subtitle="Avisos, documentos y mensajes enviados por administración."
        icon={<Bell size={24} color={colors.brand} />}
        action={<Badge label={`${notificaciones.length}`} tone={notificaciones.length > 0 ? "brand" : "neutral"} />}
      />

      {groupedNotifications.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={groupedNotifications}
          keyExtractor={(item) => item[0]}
          contentContainerStyle={styles.listContent}
          renderItem={({ item: [title, notifications] }) => (
            <View style={styles.group}>
              <Text style={styles.sectionTitle}>{title}</Text>
              <View style={styles.groupItems}>
                {notifications.map((notification) => (
                  <React.Fragment key={notification.id}>
                    {renderNotificationItem(notification)}
                  </React.Fragment>
                ))}
              </View>
            </View>
          )}
        />
      ) : (
        <Card>
          <EmptyState
            icon={<Bell size={24} color={colors.textMuted} />}
            title="Sin notificaciones"
            description="Cuando recibas nuevos avisos aparecerán en esta bandeja."
          />
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },
  topRow: {
    alignItems: "flex-start",
  },
  listContent: {
    paddingBottom: spacing.xxxl,
    gap: spacing.lg,
  },
  group: {
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    fontWeight: "900",
    marginLeft: spacing.xs,
  },
  groupItems: {
    gap: spacing.sm,
  },
  notificationItem: {
    minHeight: 104,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: {
    opacity: 0.74,
  },
  notificationIcon: {
    width: 46,
    height: 46,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  notificationContent: {
    flex: 1,
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  notificationTitle: {
    flex: 1,
    color: colors.text,
    fontSize: fontSizes.md,
    fontWeight: "900",
  },
  notificationDescription: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    lineHeight: 19,
  },
  notificationTime: {
    color: colors.textSubtle,
    fontSize: fontSizes.xs,
    fontWeight: "700",
  },
});
