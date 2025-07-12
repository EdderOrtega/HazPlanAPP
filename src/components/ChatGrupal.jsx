import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import "../styles/chatGrupal.css";

function ChatGrupal({ eventoId }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [user, setUser] = useState(null);
  const [perfilesUsuarios, setPerfilesUsuarios] = useState({});
  const mensajesRef = useRef(null);

  const eventoIdNum = Number(eventoId);

  // Obtener usuario actual y mensajes iniciales + polling cada minuto
  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const fetchData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (isMounted) setUser(userData.user);

      if (userData.user && eventoIdNum) {
        // Traer solo mensajes de usuarios registrados
        const { data: mensajesData } = await supabase
          .from("mensajes_chat")
          .select("*")
          .eq("evento_id", eventoIdNum)
          .order("created_at", { ascending: true });

        // Obtener todos los user_id registrados
        const { data: usuariosRegistrados } = await supabase
          .from("usuariosRegistrados")
          .select("user_id, nombre, foto_perfil");
        const userIdsRegistrados = new Set(
          (usuariosRegistrados || []).map((u) => u.user_id)
        );

        // Filtrar mensajes solo de usuarios registrados
        const mensajesFiltrados = (mensajesData || []).filter((m) =>
          userIdsRegistrados.has(m.user_id)
        );
        setMensajes(mensajesFiltrados);

        // Cargar perfiles únicos
        const perfilesTemp = {};
        for (const u of usuariosRegistrados || []) {
          let foto_perfil_url = "";
          if (u.foto_perfil) {
            const { data: urlData } = await supabase.storage
              .from("hazplanimagenes")
              .createSignedUrl(u.foto_perfil, 3600);
            foto_perfil_url = urlData?.signedUrl || "";
          }
          perfilesTemp[u.user_id] = {
            nombre: u.nombre || "Usuario",
            foto_perfil_url,
          };
        }
        setPerfilesUsuarios(perfilesTemp);
      }
    };

    fetchData();
    intervalId = setInterval(fetchData, 15000); // cada 15 segundos

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [eventoIdNum]);

  // Scroll automático al último mensaje
  useEffect(() => {
    if (mensajesRef.current) {
      mensajesRef.current.scrollTop = mensajesRef.current.scrollHeight;
    }
  }, [mensajes]);

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
      console.error("❌ Error enviando mensaje:", error);
    } else {
      setNuevoMensaje("");
      // Fetch inmediato tras enviar mensaje
      // (No espera al polling ni a realtime)
      const fetchData = async () => {
        const { data: mensajesData } = await supabase
          .from("mensajes_chat")
          .select("*")
          .eq("evento_id", eventoIdNum)
          .order("created_at", { ascending: true });
        const { data: usuariosRegistrados } = await supabase
          .from("usuariosRegistrados")
          .select("user_id, nombre, foto_perfil");
        const userIdsRegistrados = new Set(
          (usuariosRegistrados || []).map((u) => u.user_id)
        );
        const mensajesFiltrados = (mensajesData || []).filter((m) =>
          userIdsRegistrados.has(m.user_id)
        );
        setMensajes(mensajesFiltrados);
      };
      fetchData();
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
                    {perfilesUsuarios[mensaje.user_id]?.foto_perfil_url ? (
                      <img
                        src={perfilesUsuarios[mensaje.user_id].foto_perfil_url}
                        alt="Avatar"
                        className="avatar-participante"
                      />
                    ) : (
                      <div className="avatar-participante avatar-placeholder"></div>
                    )}
                    {perfilesUsuarios[mensaje.user_id]?.nombre || "Usuario"}
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
