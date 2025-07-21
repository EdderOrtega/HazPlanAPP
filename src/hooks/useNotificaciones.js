import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useNotificaciones() {
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let notificationChannel = null;

    const initializeNotifications = async () => {
      try {
        // Obtener usuario actual
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser();

        if (!currentUser) {
          // console.log eliminado
          return;
        }

        setUser(currentUser);
        // console.log eliminado

        // Cargar contador inicial de notificaciones
        await actualizarContadorNotificaciones(currentUser.id);

        // Crear canal único para este usuario
        const channelName = `user-notifications-${
          currentUser.id
        }-${Date.now()}`;

        // Suscribirse a nuevas notificaciones en tiempo real
        notificationChannel = supabase
          .channel(channelName)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "notificaciones",
              filter: `user_id=eq.${currentUser.id}`,
            },
            (payload) => {
              // console.log eliminado

              // Actualizar contador
              actualizarContadorNotificaciones(currentUser.id);

              // Mostrar notificación del navegador si está permitido
              if (Notification.permission === "granted") {
                new Notification(payload.new.titulo, {
                  body: payload.new.mensaje,
                  icon: "/iconoHazPlanRedondo.png",
                });
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "notificaciones",
              filter: `user_id=eq.${currentUser.id}`,
            },
            () => {
              // Actualizar contador cuando se marque como leída
              actualizarContadorNotificaciones(currentUser.id);
            }
          )
          .on(
            "postgres_changes",
            {
              event: "DELETE",
              schema: "public",
              table: "notificaciones",
              filter: `user_id=eq.${currentUser.id}`,
            },
            () => {
              // Actualizar contador cuando se elimine
              actualizarContadorNotificaciones(currentUser.id);
            }
          )
          .subscribe((status) => {
            // console.log eliminado
          });
      } catch (error) {
        console.error("❌ Error al inicializar notificaciones:", error);
      }
    };

    initializeNotifications();

    // Solicitar permisos de notificación del navegador
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Cleanup function
    return () => {
      if (notificationChannel) {
        // console.log eliminado
        supabase.removeChannel(notificationChannel);
      }
    };
  }, []);

  const actualizarContadorNotificaciones = async (userId) => {
    try {
      // Contar notificaciones no leídas
      const { count: notifCount, error: notifError } = await supabase
        .from("notificaciones")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("leida", false);

      if (notifError) {
        // Si la tabla no existe, crear contadores en 0
        if (notifError.code === "PGRST116") {
          console.warn(
            "⚠️ Tabla de notificaciones no existe, usando valores por defecto"
          );
          setNotificacionesNoLeidas(0);
          setMensajesNoLeidos(0);
          return;
        }
        throw notifError;
      }

      setNotificacionesNoLeidas(notifCount || 0);

      // Contar mensajes no leídos (notificaciones de tipo mensaje_evento)
      const { count: msgCount, error: msgError } = await supabase
        .from("notificaciones")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("tipo", "mensaje_evento")
        .eq("leida", false);

      if (msgError) {
        console.warn("⚠️ Error al contar mensajes:", msgError);
        setMensajesNoLeidos(0);
        return;
      }

      setMensajesNoLeidos(msgCount || 0);

      // console.log eliminado
    } catch (error) {
      console.error("❌ Error al actualizar contadores:", error);
      // En caso de error, mantener valores por defecto
      setNotificacionesNoLeidas(0);
      setMensajesNoLeidos(0);
    }
  };

  return {
    notificacionesNoLeidas,
    mensajesNoLeidos,
    actualizarContadorNotificaciones: () =>
      user && actualizarContadorNotificaciones(user.id),
  };
}
