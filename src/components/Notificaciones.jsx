import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FiBell, FiCheck, FiX } from "react-icons/fi";

function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      // Obtener usuario actual
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) return;

      setUser(currentUser);

      // Cargar notificaciones
      await cargarNotificaciones(currentUser.id);
    };

    fetchUserAndNotifications();
  }, []);

  const cargarNotificaciones = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("notificaciones")
        .select(
          `
          *,
          eventos (
            nombre,
            tipo
          )
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar notificaciones:", error);
      } else {
        setNotificaciones(data || []);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  const marcarComoLeida = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notificaciones")
        .update({ leida: true })
        .eq("id", notificationId);

      if (!error) {
        setNotificaciones((prev) =>
          prev.map((notif) =>
            notif.id === notificationId ? { ...notif, leida: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  const eliminarNotificacion = async (notificationId) => {
    try {
      const { error } = await supabase
        .from("notificaciones")
        .delete()
        .eq("id", notificationId);

      if (!error) {
        setNotificaciones((prev) =>
          prev.filter((notif) => notif.id !== notificationId)
        );
      }
    } catch (error) {
      console.error("Error al eliminar notificación:", error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    try {
      const { error } = await supabase
        .from("notificaciones")
        .update({ leida: true })
        .eq("user_id", user.id)
        .eq("leida", false);

      if (!error) {
        setNotificaciones((prev) =>
          prev.map((notif) => ({ ...notif, leida: true }))
        );
      }
    } catch (error) {
      console.error("Error al marcar todas como leídas:", error);
    }
  };

  const formatearFecha = (fecha) => {
    const ahora = new Date();
    const fechaNotif = new Date(fecha);
    const diffMs = ahora - fechaNotif;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Hace un momento";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHoras < 24) return `Hace ${diffHoras}h`;
    if (diffDias < 7) return `Hace ${diffDias} días`;
    return fechaNotif.toLocaleDateString();
  };

  const getIconoTipo = (tipo) => {
    switch (tipo) {
      case "nuevo_participante":
        return "👥";
      case "mensaje_evento":
        return "💬";
      default:
        return "🔔";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FiBell className="text-blue-500" />
          Notificaciones
        </h1>
        {notificaciones.some((n) => !n.leida) && (
          <button
            onClick={marcarTodasComoLeidas}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {notificaciones.length === 0 ? (
        <div className="text-center py-12">
          <FiBell className="mx-auto text-gray-400 text-4xl mb-4" />
          <p className="text-gray-500">No tienes notificaciones</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notificaciones.map((notificacion) => (
            <div
              key={notificacion.id}
              className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                notificacion.leida
                  ? "bg-white border-gray-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-2xl" role="img" aria-label="icono">
                    {getIconoTipo(notificacion.tipo)}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {notificacion.titulo}
                    </h3>
                    <p className="text-gray-600 mt-1">{notificacion.mensaje}</p>
                    {notificacion.eventos && (
                      <p className="text-sm text-blue-600 mt-2">
                        📍 Evento: {notificacion.eventos.nombre}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      {formatearFecha(notificacion.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!notificacion.leida && (
                    <button
                      onClick={() => marcarComoLeida(notificacion.id)}
                      className="text-green-600 hover:bg-green-100 p-1 rounded"
                      title="Marcar como leída"
                    >
                      <FiCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => eliminarNotificacion(notificacion.id)}
                    className="text-red-600 hover:bg-red-100 p-1 rounded"
                    title="Eliminar"
                  >
                    <FiX size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notificaciones;
