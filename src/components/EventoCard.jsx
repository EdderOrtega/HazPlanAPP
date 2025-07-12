import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/eventoCard.css"; // Asegúrate de tener este CSS
function EventoCard({ evento, user }) {
  const [participando, setParticipando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario ya participa
    console.log("🔍 EventoCard - Verificando participación:", {
      user: user?.id,
      evento: evento.id,
      nombre: evento.nombre,
    });

    if (user && evento.id) {
      const checkParticipacion = async () => {
        try {
          const { data } = await supabase
            .from("participantes_eventos")
            .select("*")
            .eq("evento_id", evento.id)
            .eq("user_id", user.id)
            .single();

          const yaParticipa = !!data;
          console.log("✅ Resultado participación:", {
            evento: evento.nombre,
            participando: yaParticipa,
          });
          setParticipando(yaParticipa);
        } catch {
          // Si no encuentra registros, no participa
          console.log("📝 Usuario no participa en:", evento.nombre);
          setParticipando(false);
        }
      };

      checkParticipacion();
    } else {
      console.log("❌ Sin usuario o evento ID:", {
        user: !!user,
        eventoId: evento.id,
      });
      setParticipando(false);
    }
  }, [evento.id, evento.nombre, user]);

  const participarEvento = async () => {
    console.log("🎯 Intentando unirse al evento:", evento.nombre);

    if (!user) {
      console.log("❌ No hay usuario, redirigiendo a login");
      navigate("/login");
      return;
    }

    console.log("⏳ Iniciando proceso de inscripción...");
    setCargando(true);

    try {
      const { error } = await supabase
        .from("participantes_eventos")
        .insert({ evento_id: evento.id, user_id: user.id });

      if (!error) {
        console.log("✅ Inscripción exitosa, redirigiendo a evento");
        setParticipando(true);
        // Forzar recarga de la página de detalle del evento para que los invitados se actualicen
        navigate(0); // recarga la página actual
        // Alternativa: navigate(`/evento/${evento.id}`); // si quieres solo navegar
      } else {
        console.error("❌ Error al unirse al evento:", error);
        alert("Error al unirse al evento. Inténtalo de nuevo.");
      }
    } catch (error) {
      console.error("❌ Error inesperado:", error);
      alert("Error inesperado. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const irAlEvento = () => {
    console.log("👁️ Navegando a detalle del evento:", evento.nombre);
    navigate(`/evento/${evento.id}`);
  };

  console.log("🎨 Renderizando EventoCard:", {
    evento: evento.nombre,
    participando,
    cargando,
    userId: user?.id,
  });

  return (
    <div className="evento-card">
      <h3>{evento.nombre}</h3>

      <p>
        <strong>📝 Descripción:</strong>{" "}
        {evento.descripcion || "Sin descripción"}
      </p>

      <p>
        <strong>📍 Ubicación:</strong> {evento.ubicacion || "No especificada"}
      </p>

      <div className="evento-fecha">
        <p>
          <strong>🗓️ Inicio:</strong>{" "}
          {evento.fecha
            ? new Date(evento.fecha).toLocaleString()
            : "No especificada"}
        </p>
        <p>
          <strong>⏰ Finalización:</strong>{" "}
          {evento.fecha_fin
            ? new Date(evento.fecha_fin).toLocaleString()
            : "No especificada"}
        </p>
      </div>

      <div className="evento-tipo">🎯 {evento.tipo || "Sin categoría"}</div>

      <div className="evento-cupo">
        👥 Cupo: {evento.cupo || "Sin límite"} personas
      </div>

      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          padding: "12px 0",
          borderTop: "1px solid #e9ecef",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
        }}
      >
        {participando ? (
          <button
            onClick={irAlEvento}
            className="btn-primary"
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              width: "90%",
              maxWidth: "200px",
              background: "#27ae60",
              color: "white",
              display: "block",
              margin: "0 auto",
            }}
          >
            ✅ Ver evento
          </button>
        ) : (
          <button
            onClick={participarEvento}
            disabled={cargando}
            className="btn-secondary"
            style={{
              padding: "12px 24px",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: cargando ? "not-allowed" : "pointer",
              width: "90%",
              maxWidth: "200px",
              background: cargando ? "#bdc3c7" : "#3498db",
              color: "white",
              display: "block",
              margin: "0 auto",
            }}
          >
            {cargando ? "⏳ Procesando..." : "🎯 Unirse al evento"}
          </button>
        )}
      </div>
    </div>
  );
}

export default EventoCard;
