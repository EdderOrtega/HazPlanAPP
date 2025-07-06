import { Marker, Popup } from "react-leaflet";
import { createCategoryIcon } from "../utils/mapUtils";

function EventoMarker({ evento, user, onUnirseEvento, onNavigateToLogin }) {
  const lat = Number(evento.lat);
  const lon = Number(evento.lon);

  if (isNaN(lat) || isNaN(lon)) return null;

  const eventoIcon = createCategoryIcon(evento.tipo, 40);

  return (
    <Marker
      key={`evento-${evento.id}-${lat}-${lon}`}
      position={[lat, lon]}
      icon={eventoIcon}
    >
      <Popup>
        <div style={{ minWidth: "250px", maxWidth: "300px" }}>
          <h3
            style={{
              color: "#2c3e50",
              margin: "0 0 12px 0",
              fontSize: "1.2rem",
            }}
          >
            {evento.nombre || "Evento sin nombre"}
          </h3>

          <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
            <strong>Ubicación:</strong> {evento.ubicacion || "Sin ubicación"}
          </p>

          <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
            <strong>Tipo:</strong> {evento.tipo || "Sin tipo"}
          </p>

          <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
            <strong>Fecha:</strong>{" "}
            {evento.fecha
              ? new Date(evento.fecha).toLocaleDateString()
              : "Sin fecha"}
          </p>

          <p style={{ margin: "6px 0", fontSize: "0.9rem" }}>
            <strong>Cupo:</strong> {evento.cupo || "Sin límite"} personas
          </p>

          <p
            style={{
              margin: "8px 0",
              fontSize: "0.85rem",
              color: "#666",
              fontStyle: "italic",
            }}
          >
            {evento.descripcion || "Sin descripción"}
          </p>

          {/* Botón para unirse al evento */}
          <div
            style={{
              marginTop: "12px",
              textAlign: "center",
              borderTop: "1px solid #eee",
              paddingTop: "10px",
            }}
          >
            {user ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUnirseEvento(evento);
                }}
                style={{
                  padding: "12px 24px",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  color: "white",
                  border: "none",
                  borderRadius: "25px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
                }}
              >
                Unirme
              </button>
            ) : (
              <button
                onClick={onNavigateToLogin}
                style={{
                  background: "linear-gradient(135deg, #95a5a6, #7f8c8d)",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  cursor: "pointer",
                  width: "100%",
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
