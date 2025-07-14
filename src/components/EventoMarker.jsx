import { useState, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import { createCategoryIcon } from "../utils/mapUtils";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function EventoMarker({ evento, user, onNavigateToLogin }) {
  const lat = Number(evento.lat);
  const lon = Number(evento.lon);

  const [yaUnido, setYaUnido] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  if (isNaN(lat) || isNaN(lon)) return null;

  const eventoIcon = createCategoryIcon(evento, 40);

  // Verificar si el usuario ya está unido al evento
  useEffect(() => {
    const checkParticipacion = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("participantes_eventos")
        .select("id")
        .eq("evento_id", evento.id)
        .eq("user_id", user.id)
        .single();

      if (data) {
        console.log("✅ Usuario ya está unido al evento");
        setYaUnido(true);
      } else if (error && error.code !== "PGRST116") {
        console.error("❌ Error al verificar participación:", error);
      }
    };

    checkParticipacion();
  }, [user, evento.id]);

  const unirseEvento = async () => {
    if (!user) {
      console.warn("⚠️ Usuario no autenticado");
      onNavigateToLogin();
      return;
    }

    setCargando(true);

    try {
      // Insertar participante
      const { error } = await supabase.from("participantes_eventos").insert({
        evento_id: evento.id,
        user_id: user.id,
      });

      if (error) {
        console.error("❌ Error al unirse al evento:", error);
        alert("No se pudo unir al evento. Intenta de nuevo.");
      } else {
        console.log("🎉 Usuario unido al evento");
        setYaUnido(true);
        navigate(`/evento/${evento.id}`);
      }
    } catch (err) {
      console.error("❌ Error inesperado:", err);
      alert("Error inesperado. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Marker
      key={`evento-${evento.id}-${lat}-${lon}`}
      position={[lat, lon]}
      icon={eventoIcon}
    >
      <Popup
        closeButton={true}
        closeButtonAriaLabel="Cerrar"
        closeOnClick={false}
        className="evento-popup-custom"
      >
        <div
          style={{
            minWidth: "180px",
            maxWidth: "220px",
            background: "linear-gradient(135deg, #e8deff 0%, #f3eaff 100%)",
            border: "2px solid #b39ddb",
            borderRadius: "22px",
            boxShadow: "0 8px 32px #7c4dff22",
            padding: 0,
            position: "relative",
            overflow: "hidden",
            fontFamily: "inherit",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          <div style={{ padding: "14px 12px 10px 12px" }}>
            <h3
              style={{
                color: "#3a2566",
                fontSize: "1.3rem",
                fontWeight: 900,
                margin: "0 0 12px 0",
                lineHeight: 1.3,
                textShadow: "0 2px 8px #e8deff",
                letterSpacing: 0.5,
              }}
            >
              {evento.nombre || "Evento sin nombre"}
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                margin: "10px 0 14px 0",
              }}
            >
              <span
                style={{
                  background: "#f3eaff",
                  color: "#7c4dff",
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "4px 10px",
                  fontSize: 13,
                  marginBottom: 4,
                  display: "inline-block",
                  border: "1px solid #e0d7fa",
                  boxShadow: "0 1px 4px #e8deff",
                }}
              >
                📍 {evento.ubicacion || "Sin ubicación"}
              </span>
              <span
                style={{
                  background: "#e8deff",
                  color: "#593c8f",
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "4px 10px",
                  fontSize: 13,
                  marginBottom: 4,
                  display: "inline-block",
                  border: "1px solid #d1b3ff",
                  boxShadow: "0 1px 4px #e8deff",
                }}
              >
                🎯 {evento.tipo || "Sin tipo"}
              </span>
              <span
                style={{
                  background: "#ede7f6",
                  color: "#7c4dff",
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "4px 10px",
                  fontSize: 13,
                  marginBottom: 4,
                  display: "inline-block",
                  border: "1px solid #d1b3ff",
                  boxShadow: "0 1px 4px #e8deff",
                }}
              >
                🗓️{" "}
                {evento.fecha
                  ? new Date(evento.fecha).toLocaleDateString()
                  : "Sin fecha"}
              </span>
              <span
                style={{
                  background: "#e1f5fe",
                  color: "#1e7e34",
                  fontWeight: 700,
                  borderRadius: 10,
                  padding: "4px 10px",
                  fontSize: 13,
                  marginBottom: 4,
                  display: "inline-block",
                  border: "1px solid #b3d9ff",
                  boxShadow: "0 1px 4px #e8deff",
                }}
              >
                👥 Cupo: {evento.cupo || "Sin límite"} personas
              </span>
            </div>

            <div
              style={{
                color: "#593c8f",
                margin: "8px 0 0 0",
                lineHeight: 1.6,
                fontSize: "1.05rem",
                fontWeight: 600,
                textShadow: "0 1px 2px #e8deff",
                minHeight: 24,
                maxWidth: "100%",
                wordBreak: "break-word",
                whiteSpace: "pre-line",
                overflowWrap: "break-word",
                display: "block",
                background: "#f3eaff",
                borderRadius: "10px",
                padding: "8px 12px",
                border: "1px solid #e0d7fa",
                boxShadow: "0 1px 4px #e8deff",
              }}
            >
              {evento.descripcion || "Sin descripción"}
            </div>
          </div>

          <div
            style={{
              marginTop: "12px",
              textAlign: "center",
              borderTop: "1px solid #e9ecef",
              padding: "10px 12px 10px 12px",
              background: "#ede7f6",
              borderRadius: "0 0 8px 8px",
            }}
          >
            {user ? (
              yaUnido ? (
                <button
                  onClick={() => navigate(`/evento/${evento.id}`)}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #7c4dff, #593c8f)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    width: "90%",
                    maxWidth: "200px",
                    margin: "0 auto",
                    display: "block",
                  }}
                >
                  Ir a detalles
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    unirseEvento();
                  }}
                  disabled={cargando}
                  style={{
                    padding: "12px 24px",
                    background: "linear-gradient(135deg, #7c4dff, #593c8f)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: cargando ? "wait" : "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 15px #7c4dff33",
                    width: "90%",
                    maxWidth: "200px",
                    margin: "0 auto",
                    display: "block",
                  }}
                >
                  {cargando ? "Uniendo..." : "Unirme"}
                </button>
              )
            ) : (
              <button
                onClick={onNavigateToLogin}
                style={{
                  background: "linear-gradient(135deg, #bdc3c7, #95a5a6)",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  width: "90%",
                  maxWidth: "200px",
                  margin: "0 auto",
                  display: "block",
                }}
              >
                Inicia sesión para unirte
              </button>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default EventoMarker;
