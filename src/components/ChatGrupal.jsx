// Crear nuevo archivo ChatGrupal.jsx
import { useState, useEffect, useRef } from "react";
import { supabase } from "../supabaseClient";
import "../styles/ChatGrupal.css";

function ChatGrupal({ eventoId }) {
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [user, setUser] = useState(null);
  const [perfilesUsuarios, setPerfilesUsuarios] = useState({});
  const [cargando, setCargando] = useState(true);
  const mensajesRef = useRef(null);

  // Asegura que eventoId sea número
  const eventoIdNum = Number(eventoId);

  // Obtener usuario actual y mensajes
  useEffect(() => {
    let ignore = false;

    const getUserAndMensajes = async () => {
      setCargando(true);

      // Usuario actual
      const { data: userData } = await supabase.auth.getUser();
      if (!ignore) setUser(userData.user);

      // Mensajes
      const { data: mensajesData } = await supabase
        .from("mensajes_chat")
        .select("*")
        .eq("evento_id", eventoIdNum)
        .order("created_at", { ascending: true });

      if (!ignore && mensajesData) {
        setMensajes(mensajesData);

        // Perfiles únicos
        const userIds = [...new Set(mensajesData.map((m) => m.user_id))];
        const nuevosPerfiles = { ...perfilesUsuarios };

        for (const userId of userIds) {
          if (!nuevosPerfiles[userId]) {
            const { data: perfil } = await supabase
              .from("usuariosRegistrados")
              .select("nombre, foto_perfil")
              .eq("user_id", userId)
              .single();

            if (perfil && perfil.foto_perfil) {
              const { data: urlData } = await supabase.storage
                .from("hazplanimagenes")
                .createSignedUrl(perfil.foto_perfil, 3600);
              perfil.foto_perfil_url = urlData?.signedUrl || "";
            }

            nuevosPerfiles[userId] = perfil || {
              nombre: "Usuario",
              foto_perfil_url: "",
            };
          }
        }
        setPerfilesUsuarios(nuevosPerfiles);
      }

      setCargando(false);
    };

    getUserAndMensajes();

    // Suscripción a nuevos mensajes
    const subscription = supabase
      .channel("public:mensajes_chat")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensajes_chat",
          filter: `evento_id=eq.${eventoIdNum}`,
        },
        (payload) => {
          setMensajes((mensajes) => {
            // Evita duplicados
            if (mensajes.some((m) => m.id === payload.new.id)) return mensajes;
            return [...mensajes, payload.new];
          });

          // Si es un usuario nuevo, obtener su perfil
          if (!perfilesUsuarios[payload.new.user_id]) {
            const fetchPerfil = async () => {
              const { data: perfil } = await supabase
                .from("usuariosRegistrados")
                .select("nombre, foto_perfil")
                .eq("user_id", payload.new.user_id)
                .single();
              if (perfil && perfil.foto_perfil) {
                const { data: urlData } = await supabase.storage
                  .from("hazplanimagenes")
                  .createSignedUrl(perfil.foto_perfil, 3600);
                perfil.foto_perfil_url = urlData?.signedUrl || "";
              }
              setPerfilesUsuarios((prev) => ({
                ...prev,
                [payload.new.user_id]: perfil || {
                  nombre: "Usuario",
                  foto_perfil_url: "",
                },
              }));
            };
            fetchPerfil();
          }
        }
      )
      .subscribe();

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line
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

    const { error } = await supabase.from("mensajes_chat").insert({
      evento_id: eventoIdNum,
      user_id: user.id,
      contenido: nuevoMensaje.trim(),
    });

    if (!error) {
      setNuevoMensaje("");
    }
  };

  if (cargando) {
    return <div>Cargando chat...</div>;
  }

  return (
    <div className="chat-grupal">
      <div className="mensajes-container" ref={mensajesRef}>
        {mensajes.length === 0 ? (
          <p className="no-mensajes">
            No hay mensajes aún. ¡Sé el primero en escribir!
          </p>
        ) : (
          mensajes.map((mensaje) => (
            <div
              key={mensaje.id}
              className={`mensaje ${
                mensaje.user_id === user?.id ? "mensaje-propio" : "mensaje-otro"
              }`}
            >
              {mensaje.user_id !== user?.id && (
                <div className="mensaje-avatar">
                  {perfilesUsuarios[mensaje.user_id]?.foto_perfil_url ? (
                    <img
                      src={perfilesUsuarios[mensaje.user_id].foto_perfil_url}
                      alt="Avatar"
                      className="avatar-participante"
                    />
                  ) : (
                    <div className="avatar-placeholder"></div>
                  )}
                </div>
              )}

              <div className="mensaje-contenido">
                {mensaje.user_id !== user?.id && (
                  <span className="mensaje-autor">
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

      <form onSubmit={enviarMensaje} className="form-mensaje">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder="Escribe un mensaje..."
          disabled={!user}
        />
        <button type="submit" disabled={!nuevoMensaje.trim() || !user}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default ChatGrupal;
