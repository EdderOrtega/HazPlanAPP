import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FiMessageCircle, FiSend } from "react-icons/fi";

function Mensajes() {
  const [conversaciones, setConversaciones] = useState([]);
  const [conversacionActiva, setConversacionActiva] = useState(null);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndConversations = async () => {
      // Obtener usuario actual
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) return;

      setUser(currentUser);

      // Cargar eventos donde el usuario participa (conversaciones)
      await cargarConversaciones(currentUser.id);
    };

    fetchUserAndConversations();
  }, []);

  useEffect(() => {
    if (conversacionActiva) {
      cargarMensajes(conversacionActiva.id);

      // Suscribirse a nuevos mensajes en tiempo real
      const channel = supabase
        .channel(`mensajes-evento-${conversacionActiva.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "mensajes_evento",
            filter: `evento_id=eq.${conversacionActiva.id}`,
          },
          (payload) => {
            console.log("Nuevo mensaje recibido:", payload);
            cargarMensajes(conversacionActiva.id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversacionActiva]);

  const cargarConversaciones = async (userId) => {
    try {
      // Obtener eventos donde el usuario es creador o participante
      const { data: eventosCreados, error: errorCreados } = await supabase
        .from("eventos")
        .select("*")
        .eq("user_id", userId);

      const { data: eventosParticipando, error: errorParticipando } =
        await supabase
          .from("participantes_evento")
          .select(
            `
          eventos (*)
        `
          )
          .eq("user_id", userId);

      if (errorCreados || errorParticipando) {
        console.error(
          "Error al cargar conversaciones:",
          errorCreados || errorParticipando
        );
        return;
      }

      // Combinar eventos y eliminar duplicados
      const todosLosEventos = [
        ...(eventosCreados || []),
        ...(eventosParticipando?.map((p) => p.eventos) || []),
      ];

      const eventosUnicos = todosLosEventos.filter(
        (evento, index, arr) =>
          arr.findIndex((e) => e.id === evento.id) === index
      );

      setConversaciones(eventosUnicos);
    } catch (error) {
      console.error("Error inesperado:", error);
    } finally {
      setLoading(false);
    }
  };

  const cargarMensajes = async (eventoId) => {
    try {
      const { data, error } = await supabase
        .from("mensajes_evento")
        .select(
          `
          *,
          profiles (
            nombre,
            apellido
          )
        `
        )
        .eq("evento_id", eventoId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar mensajes:", error);
      } else {
        setMensajes(data || []);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  const enviarMensaje = async () => {
    if (!nuevoMensaje.trim() || !conversacionActiva || !user) return;

    try {
      const { error } = await supabase.from("mensajes_evento").insert({
        evento_id: conversacionActiva.id,
        user_id: user.id,
        mensaje: nuevoMensaje.trim(),
      });

      if (!error) {
        setNuevoMensaje("");
        // Los mensajes se actualizarán automáticamente por el listener de tiempo real
      } else {
        console.error("Error al enviar mensaje:", error);
      }
    } catch (error) {
      console.error("Error inesperado:", error);
    }
  };

  const formatearFecha = (fecha) => {
    const ahora = new Date();
    const fechaMensaje = new Date(fecha);
    const diffMs = ahora - fechaMensaje;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "ahora";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHoras < 24) return `${diffHoras}h`;
    return fechaMensaje.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Mensajes
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96">
        {/* Lista de conversaciones */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h2 className="font-semibold">Conversaciones</h2>
          </div>
          <div className="overflow-y-auto h-80">
            {conversaciones.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <p className="text-sm">No tienes conversaciones</p>
              </div>
            ) : (
              conversaciones.map((evento) => (
                <div
                  key={evento.id}
                  onClick={() => setConversacionActiva(evento)}
                  className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                    conversacionActiva?.id === evento.id
                      ? "bg-blue-50 border-blue-200"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm truncate">
                        {evento.nombre}
                      </h3>
                      <p className="text-xs text-gray-500 truncate">
                        {evento.ubicacion}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat activo */}
        <div className="md:col-span-2 border rounded-lg flex flex-col">
          {conversacionActiva ? (
            <>
              {/* Header del chat */}
              <div className="bg-gray-50 p-3 border-b">
                <div className="flex items-center gap-2">
                  <div>
                    <h2 className="font-semibold">
                      {conversacionActiva.nombre}
                    </h2>
                    <p className="text-xs text-gray-500">
                      {conversacionActiva.ubicacion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mensajes */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 h-64">
                {mensajes.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <p>No hay mensajes aún</p>
                    <p className="text-sm">¡Sé el primero en escribir!</p>
                  </div>
                ) : (
                  mensajes.map((mensaje) => (
                    <div
                      key={mensaje.id}
                      className={`flex ${
                        mensaje.user_id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          mensaje.user_id === user?.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {mensaje.user_id !== user?.id && (
                          <p className="text-xs font-semibold mb-1">
                            {mensaje.profiles?.nombre || "Usuario"}{" "}
                            {mensaje.profiles?.apellido || ""}
                          </p>
                        )}
                        <p className="text-sm">{mensaje.mensaje}</p>
                        <p
                          className={`text-xs mt-1 ${
                            mensaje.user_id === user?.id
                              ? "text-blue-100"
                              : "text-gray-500"
                          }`}
                        >
                          {formatearFecha(mensaje.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input para nuevo mensaje */}
              <div className="border-t p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && enviarMensaje()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={enviarMensaje}
                    disabled={!nuevoMensaje.trim()}
                    className="bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiSend size={16} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p>Selecciona una conversación para comenzar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mensajes;
