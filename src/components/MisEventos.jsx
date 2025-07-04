import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  FiEdit3,
  FiTrash2,
  FiMapPin,
  FiCalendar,
  FiUsers,
  FiPlusCircle,
  FiEye,
} from "react-icons/fi";
import Loader from "./ui/Loader";

function MisEventos() {
  const [user, setUser] = useState(null);
  const [misEventos, setMisEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      // Obtener usuario autenticado
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);

      // Traer eventos creados por el usuario
      const { data: eventosData, error } = await supabase
        .from("eventos")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar eventos:", error);
      } else {
        setMisEventos(eventosData || []);
      }

      setLoading(false);
    };

    fetchUserAndEvents();
  }, [navigate]);

  const handleBorrarEvento = async (eventoId) => {
    if (window.confirm("¿Seguro que quieres borrar este evento?")) {
      const { error } = await supabase
        .from("eventos")
        .delete()
        .eq("id", eventoId);
      if (error) {
        console.error("Error al eliminar evento:", error);
        alert("Error al eliminar el evento");
      } else {
        setMisEventos(misEventos.filter((e) => e.id !== eventoId));
      }
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Fecha inválida";
    }
  };

  const isEventoExpirado = (fechaFin) => {
    try {
      return new Date(fechaFin) <= new Date();
    } catch {
      return false;
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: "16px",
          paddingTop: "60px", // Solo para el navbar
        }}
      >
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          paddingTop: "60px",
        }}
      >
        <div
          style={{
            padding: "24px",
            textAlign: "center",
            maxWidth: "400px",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          }}
        >
          <h2>🔒 Acceso restringido</h2>
          <p>Debes iniciar sesión para ver tus eventos.</p>
          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#b42acb",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              marginTop: "16px",
            }}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "24px",
        paddingTop: "80px", // Para el navbar fijo
        maxWidth: "800px",
        margin: "0 auto",
        paddingBottom: "80px", // Para el menubar
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "whitesmoke",
            marginBottom: "8px",
          }}
        >
          📅 Mis Eventos
        </h1>
        <p
          style={{
            color: "whitesmoke",
            fontSize: "16px",
          }}
        >
          Administra los eventos que has creado
        </p>
      </div>

      {/* Estadísticas rápidas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            backgroundColor: "#e8f5e8",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid #4CAF50",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#2e7d32" }}
          >
            {misEventos.filter((e) => !isEventoExpirado(e.fecha_fin)).length}
          </div>
          <div style={{ fontSize: "14px", color: "#2e7d32" }}>Activos</div>
        </div>
        <div
          style={{
            backgroundColor: "#fff3e0",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid #ff9800",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#e65100" }}
          >
            {misEventos.filter((e) => isEventoExpirado(e.fecha_fin)).length}
          </div>
          <div style={{ fontSize: "14px", color: "#e65100" }}>Finalizados</div>
        </div>
        <div
          style={{
            backgroundColor: "#f3e5f5",
            padding: "16px",
            borderRadius: "12px",
            textAlign: "center",
            border: "1px solid #b42acb",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "bold", color: "#b42acb" }}
          >
            {misEventos.length}
          </div>
          <div style={{ fontSize: "14px", color: "#b42acb" }}>Total</div>
        </div>
      </div>

      {/* Botón crear evento */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <button
          onClick={() => navigate("/crear-evento")}
          style={{
            backgroundColor: "#b42acb",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "500",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 8px rgba(180, 42, 203, 0.3)",
          }}
        >
          <FiPlusCircle />
          Crear nuevo evento
        </button>
      </div>

      {/* Lista de eventos */}
      {misEventos.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 24px",
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            border: "2px dashed #ddd",
          }}
        >
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>📅</div>
          <h3 style={{ color: "#666", marginBottom: "8px" }}>
            Aún no has creado eventos
          </h3>
          <p style={{ color: "#999", marginBottom: "24px" }}>
            ¡Crea tu primer evento y conecta con personas con tus mismos
            intereses!
          </p>
          <button
            onClick={() => navigate("/crear-evento")}
            style={{
              backgroundColor: "#b42acb",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <FiPlusCircle />
            Crear mi primer evento
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          {misEventos.map((evento) => {
            const expirado = isEventoExpirado(evento.fecha_fin);
            return (
              <div
                key={evento.id}
                style={{
                  backgroundColor: "white",
                  border: `1px solid ${expirado ? "#ffeb3b" : "#e0e0e0"}`,
                  borderRadius: "12px",
                  padding: "20px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  position: "relative",
                  opacity: expirado ? 0.7 : 1,
                }}
              >
                {expirado && (
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      right: "12px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "500",
                    }}
                  >
                    Finalizado
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* Título y tipo */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: "#b42acb",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "500",
                        }}
                      >
                        {evento.tipo || "Evento"}
                      </span>
                    </div>
                    <h3
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#333",
                        margin: "0",
                      }}
                    >
                      {evento.nombre}
                    </h3>
                  </div>

                  {/* Detalles del evento */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#666",
                      }}
                    >
                      <FiCalendar style={{ color: "#b42acb" }} />
                      <span>{formatDate(evento.fecha)}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#666",
                      }}
                    >
                      <FiMapPin style={{ color: "#b42acb" }} />
                      <span>{evento.ubicacion}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#666",
                      }}
                    >
                      <FiUsers style={{ color: "#b42acb" }} />
                      <span>{evento.cupo} personas</span>
                    </div>
                  </div>

                  {/* Descripción */}
                  {evento.descripcion && (
                    <p
                      style={{
                        color: "#666",
                        fontSize: "14px",
                        lineHeight: "1.5",
                        margin: "0",
                      }}
                    >
                      {evento.descripcion}
                    </p>
                  )}

                  {/* Acciones */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => navigate(`/evento/${evento.id}`)}
                      style={{
                        backgroundColor: "#f0f0f0",
                        color: "#333",
                        border: "1px solid #ddd",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "500",
                      }}
                    >
                      <FiEye size={16} />
                      Ver detalles
                    </button>
                    <button
                      onClick={() => navigate(`/editar-evento/${evento.id}`)}
                      style={{
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "500",
                      }}
                    >
                      <FiEdit3 size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleBorrarEvento(evento.id)}
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "500",
                      }}
                    >
                      <FiTrash2 size={16} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Agregar estilos CSS para la animación */}
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default MisEventos;
