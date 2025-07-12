import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FiBell, FiMail } from "react-icons/fi";

function UserMenu({ user }) {
  const [perfil, setPerfil] = useState(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState(0);
  const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);
  const [eventosUsuario, setEventosUsuario] = useState([]);
  const canalesRef = useRef([]); // Para limpiar canales correctamente
  const navigate = useNavigate();
  const menuRef = useRef();

  // Obtener eventos donde participa el usuario
  useEffect(() => {
    if (!user) return;
    let cancelado = false;
    const fetchEventos = async () => {
      const { data, error } = await supabase
        .from("participantes_eventos")
        .select("evento_id")
        .eq("user_id", user.id);
      if (!error && data && !cancelado) {
        setEventosUsuario(data.map((d) => d.evento_id));
      }
    };
    fetchEventos();
    return () => {
      cancelado = true;
    };
  }, [user]);

  // Suscripción realtime global para mensajes y participantes
  useEffect(() => {
    if (!user) return;
    // Limpiar canales previos
    canalesRef.current.forEach((ch) => supabase.removeChannel(ch));
    canalesRef.current = [];
    // Mensajes global
    const mensajesChannel = supabase
      .channel("mensajes_eventos_global")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensajes_eventos",
        },
        (payload) => {
          // Solo notificar si el mensaje es de un evento donde participa el usuario y no es suyo
          if (
            payload.new &&
            eventosUsuario.includes(payload.new.evento_id) &&
            payload.new.user_id !== user.id
          ) {
            setMensajesNoLeidos((prev) => prev + 1);
          }
        }
      )
      .subscribe();
    canalesRef.current.push(mensajesChannel);
    // Participantes global
    const participantesChannel = supabase
      .channel("participantes_eventos_global")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "participantes_eventos",
        },
        (payload) => {
          if (
            payload.new &&
            eventosUsuario.includes(payload.new.evento_id) &&
            payload.new.user_id !== user.id
          ) {
            setNotificacionesNoLeidas((prev) => prev + 1);
          }
        }
      )
      .subscribe();
    canalesRef.current.push(participantesChannel);
    return () => {
      canalesRef.current.forEach((ch) => supabase.removeChannel(ch));
      canalesRef.current = [];
    };
  }, [user, eventosUsuario]);

  useEffect(() => {
    if (!user) return;

    const fetchPerfil = async () => {
      try {
        const { data: perfilData, error: perfilError } = await supabase
          .from("usuariosRegistrados")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (perfilError) console.error("Error perfil:", perfilError);

        if (perfilData && perfilData.foto_perfil) {
          const { data: urlData, error: urlError } = await supabase.storage
            .from("hazplanimagenes")
            .createSignedUrl(perfilData.foto_perfil, 3600);
          if (urlError) console.error("Error url firmada:", urlError);
          setFotoPerfilUrl(urlData?.signedUrl || "");
        }
        setPerfil(perfilData);
      } catch (e) {
        console.error("Error general:", e);
      }
    };
    fetchPerfil();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  // Resetear contadores al entrar a la sección
  const handleNavigateMensajes = () => {
    setMensajesNoLeidos(0);
    navigate("/mensajes");
  };
  const handleNavigateNotificaciones = () => {
    setNotificacionesNoLeidas(0);
    navigate("/notificaciones");
  };

  if (!perfil) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 14,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
      ref={menuRef}
    >
      {/* Botón de Notificaciones */}
      <div
        style={{
          backgroundColor: "#b42acb",
          borderRadius: "50%",
          padding: "8px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "2px solid #ddd",
          position: "relative",
        }}
        onClick={handleNavigateNotificaciones}
      >
        <FiBell size={20} color="white" />
        {/* Badge de notificaciones */}
        {notificacionesNoLeidas > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              backgroundColor: "#ff4444",
              borderRadius: "50%",
              minWidth: "16px",
              height: "16px",
              fontSize: "10px",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              padding: "0 2px",
            }}
          >
            {notificacionesNoLeidas > 99 ? "99+" : notificacionesNoLeidas}
          </div>
        )}
      </div>

      {/* Botón de Mensajes */}
      <div
        style={{
          backgroundColor: "#b42acb",
          borderRadius: "50%",
          padding: "8px",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          border: "2px solid #ddd",
          position: "relative",
        }}
        onClick={handleNavigateMensajes}
      >
        <FiMail size={20} color="white" />
        {/* Badge de mensajes */}
        {mensajesNoLeidos > 0 && (
          <div
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              backgroundColor: "#ff4444",
              borderRadius: "50%",
              minWidth: "16px",
              height: "16px",
              fontSize: "10px",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              padding: "0 2px",
            }}
          >
            {mensajesNoLeidos > 99 ? "99+" : mensajesNoLeidos}
          </div>
        )}
      </div>

      {/* Foto de Perfil con Menú */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            backgroundColor: "#b42acb",
            borderRadius: "50%",
            padding: "4px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            border: "2px solid #ddd",
          }}
          onClick={() => setShowProfileMenu((prev) => !prev)}
        >
          <img
            src={fotoPerfilUrl || "https://ui-avatars.com/api/?name=U"}
            alt="avatar"
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Menú desplegable del perfil */}
        {showProfileMenu && (
          <div
            style={{
              position: "absolute",
              top: "45px",
              right: 0,
              background: "white",
              border: "1px solid #ddd",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              minWidth: "140px",
              padding: "8px 0",
              zIndex: 1001,
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: "#333",
                transition: "background-color 0.2s",
              }}
              onClick={() => {
                navigate("/perfil");
                setShowProfileMenu(false);
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#f5f5f5")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              👤 Ver perfil
            </div>
            <hr
              style={{
                margin: "4px 0",
                border: "none",
                borderTop: "1px solid #eee",
              }}
            />
            <div
              style={{
                padding: "8px 16px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                color: "#dc3545",
                transition: "background-color 0.2s",
              }}
              onClick={() => {
                handleLogout();
                setShowProfileMenu(false);
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#fff5f5")}
              onMouseLeave={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
            >
              🚪 Cerrar sesión
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(UserMenu);
