import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import "../styles/chatGrupal.css";

function ChatGrupal({ eventoId }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [user, setUser] = useState(null);
  const [nombresUsuarios, setNombresUsuarios] = useState({});
  const mensajesRef = useRef(null);

  const eventoIdNum = Number(eventoId);

  // 👉 Cargar usuario actual y mensajes
  useEffect(() => {
    let isMounted = true;

    async function cargarDatos() {
      const { data: userData } = await supabase.auth.getUser();
      if (!isMounted) return;
      setUser(userData.user);

      // Traer mensajes
      const { data: mensajesData } = await supabase
        .from("mensajes_chat")
        .select("*")
        .eq("evento_id", eventoIdNum)
        .order("created_at", { ascending: true });
      if (!isMounted) return;
      setMensajes(mensajesData || []);

      // Traer nombres de usuarios (sin fotos)
      const { data: usuarios } = await supabase
        .from("usuariosRegistrados")
        .select("user_id, nombre");
      if (!isMounted) return;

      const nombresTemp = {};
      for (const u of usuarios || []) {
        nombresTemp[u.user_id] = u.nombre || "Usuario";
      }
      setNombresUsuarios(nombresTemp);
    }

    cargarDatos();

    return () => {
      isMounted = false;
    };
  }, [eventoIdNum]);

  // 👇 Scroll automático al último mensaje
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

  // Función para actualizar mensajes
  const fetchMensajes = async () => {
    const { data } = await supabase
      .from("mensajes_chat")
      .select("*")
      .eq("evento_id", eventoIdNum)
      .order("created_at", { ascending: true });
    setMensajes(data || []);
  };

  // 👉 Enviar mensaje
  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || !user) return;

    const texto = nuevoMensaje.trim();

    const { error } = await supabase.from("mensajes_chat").insert({
      evento_id: eventoIdNum,
      user_id: user.id,
      contenido: texto,
    });

    if (error) {
      // log eliminado
    } else {
      setNuevoMensaje("");
      fetchMensajes(); // Refresca los mensajes después de enviar
    }
  };

  return (
    <div className="chat-grupal evento-chat-tab">
      <div
        className="mensajes-container evento-chat-mensajes"
        ref={mensajesRef}
      >
        {mensajes.length === 0 ? (
          <p className="no-mensajes">
            No hay mensajes aún. ¡Sé el primero en escribir!
          </p>
        ) : (
          mensajes.map((mensaje) => (
            <div
              key={mensaje.id}
              className={
                mensaje.user_id === user?.id
                  ? "mensaje-usuario"
                  : "mensaje-otro"
              }
            >
              <div className="mensaje-contenido">
                {mensaje.user_id !== user?.id && (
                  <span className="mensaje-autor">
                    {nombresUsuarios[mensaje.user_id] || "Usuario"}
                  </span>
                )}
                <p>{mensaje.contenido}</p>
                <span className="mensaje-hora">
                  {new Date(mensaje.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={enviarMensaje} className="evento-chat-input-row">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={!user}
          autoComplete="off"
        />
        <button type="submit" disabled={!nuevoMensaje.trim() || !user}>
          <span className="icon-send"></span>
        </button>
      </form>
    </div>
  );
}

export default ChatGrupal;
