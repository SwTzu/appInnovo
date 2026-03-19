import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Modal,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalContext";
import {
  Bell,
  Mail,
  FileText,
  AlertCircle,
  ChevronLeft,
  X,
  MailOpen,
} from "lucide-react-native";
import type{ Notificacion } from "@/types/interfaces";
import { deleteNotificacion, getNotificaciones, updateStateNotificacion } from "@/api/trabajador";
export default function NotificacionesModal() {
  const { notificaciones, setNotificaciones} = useGlobalContext();
  useEffect(() => {
    if (notificaciones.length === 0) {
      getNotificaciones().then((notificaciones) => {
        setNotificaciones(notificaciones);
      });
    }
  }, []);

  const [selectedNotification, setSelectedNotification] =
    useState<Notificacion | null>(null);
  const getIconForType = (tipo: string) => {
    switch (tipo) {
      case "alert":
        return <AlertCircle size={24} color="#2196F3" />;
      case "msg":
        return <Mail size={24} color="#2196F3" />;
      case "document":
        return <FileText size={24} color="#2196F3" />;
      default:
        return <Bell size={24} color="#2196F3" />;
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
        groupKey = notifDate.toLocaleDateString("es-ES", {
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
      return (
        new Date(b[1][0].fecha).getTime() - new Date(a[1][0].fecha).getTime()
      );
    });
  }, [notificaciones]);
  const handleNotificationPress = (notification: Notificacion) => {
    updateStateNotificacion(notification.id).then((res) => {
      if (res.ok) {
        const updatedNotifications = notificaciones.map((notificacion:Notificacion) =>
          notificacion.id === notification.id
            ? { ...notificacion, estado: true }
            : notificacion
        );
        setNotificaciones(updatedNotifications);
      } else {
        Alert.alert("Error", "No se pudo actualizar el estado de la notificación");
      }
    });
    router.push({
      pathname: "/(lector)/modalNotificacion",
      params: { notification: JSON.stringify(notification) }
    });
  };
  const handleDeleteNotification = (id: string) => {
    Alert.alert(
      "Eliminar notificación",
      "Al eliminar la notificación aceptas la responsabilidad sobre su contenido.\nEsta acción no se puede deshacer.\n¿Continuar?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          onPress: async () => {
            // Delete notification
            const res = await deleteNotificacion(id);
            if (res.ok) {
              setSelectedNotification(null);
              const updatedNotifications = notificaciones.filter(
                (notificacion: { id: string }) => notificacion.id !== id
              );
              setNotificaciones(updatedNotifications);
            } else {
              Alert.alert("Error", "No se pudo eliminar la notificación");
            }
          },
          style: "destructive",
        },
      ]
    );
  };
  const renderNotificationItem = ({ item }: { item: Notificacion }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIcon}>{getIconForType(item.tipo)}</View>
      <View style={styles.notificationContent}>
        <Text numberOfLines={1} style={styles.notificationTitle}>{item.titulo}</Text>
        <Text
          style={styles.notificationDescription}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
            {item.mensaje}
        </Text>
        <View style={{ flex: 1, justifyContent: "flex-end" }}>
          <Text style={styles.notificationTime}>
            {new Date(item.fecha).toLocaleTimeString("es-ES", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
      <View style={styles.moreButton}>
        <TouchableOpacity
          onPress={() => handleDeleteNotification(item.id)}
        >
          <X size={20} color="black" />
        </TouchableOpacity>
        {item.estado ? (
          <MailOpen size={20} color="#74dfa2" />
        ) : (
          <Mail size={20} color="#f7b750" />
        )}
      </View>
    </TouchableOpacity>
  );
  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>
      <FlatList
      showsVerticalScrollIndicator={false}
        data={groupedNotifications}
        renderItem={({ item: [title, notifications] }) => (
          <View>
            {renderSectionHeader({ section: { title } })}
            <View style={{ gap: 10 }}>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  {renderNotificationItem({ item: notification })}
                </React.Fragment>
              ))}
            </View>
          </View>
        )}
        keyExtractor={(item) => item[0]}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    elevation: 8,
    zIndex: 1,
    textAlign: "center",
    alignContent: "center",
  },
  backButton: {
    position: "absolute",
    left: 8,
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  listContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 5,
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    gap: 8,
    marginHorizontal: 8,
    height: 100,
    borderRadius: 8,
    elevation: 8,
  },
  notificationIcon: {
    backgroundColor: "#ebf9ff",
    alignItems: "center",
    justifyContent: "center",
    width: "10%",
    height: "100%",
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  notificationContent: {
    flex: 1,
    justifyContent: "flex-start",
    height: "100%",
    paddingVertical: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#757575",
    paddingHorizontal: 10,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 12,
    color: "#9E9E9E",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },
  moreButton: {
    alignItems: "center",
    height: "100%",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 5,
    borderRadius: 8,
  },
});
