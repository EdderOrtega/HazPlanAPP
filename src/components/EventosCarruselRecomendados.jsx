import React from "react";
import PropTypes from "prop-types";

// Datos de ejemplo (puedes reemplazar por props o datos reales)
const eventosMock = [
  {
    id: 1,
    nombre: "Taller de Arte Urbano",
    categoria: "Arte y Cultura",
    fecha: "2025-07-15",
    hora: "18:00",
    descripcion: "Explora el arte urbano con artistas locales.",
    ubicacion: "Centro Cultural Monterrey",
    imagen:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    nombre: "Caminata Ecológica",
    categoria: "Aventura",
    fecha: "2025-07-20",
    hora: "09:00",
    descripcion: "Recorre senderos y ayuda a limpiar el parque.",
    ubicacion: "Parque Fundidora",
    imagen:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    nombre: "Noche de Stand Up",
    categoria: "Comedia",
    fecha: "2025-07-22",
    hora: "21:00",
    descripcion: "Ríe con los mejores comediantes locales.",
    ubicacion: "Bar El Capibara",
    imagen:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    nombre: "Clase de Yoga al Amanecer",
    categoria: "Salud y Bienestar",
    fecha: "2025-07-18",
    hora: "07:00",
    descripcion: "Conecta cuerpo y mente en el parque.",
    ubicacion: "Parque Rufino Tamayo",
    imagen:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80",
  },
];

function EventosCarruselRecomendados({ eventos = eventosMock }) {
  return (
    <section
      style={{
        background: "#2a1747",
        padding: "32px 0 24px 0",
        borderRadius: "18px",
        margin: "40px 0",
        boxShadow: "0 4px 24px #1a0e2a55",
      }}
    >
      <h2
        style={{
          color: "#fff",
          marginLeft: 32,
          marginBottom: 18,
          fontWeight: 700,
          fontSize: 28,
        }}
      >
        Próximamente eventos recomendados para ti
      </h2>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "24px",
          padding: "0 32px 8px 32px",
          scrollbarWidth: "thin",
        }}
      >
        {eventos.map((evento) => (
          <div
            key={evento.id}
            style={{
              minWidth: 220,
              maxWidth: 220,
              minHeight: 260,
              background: "#3a2566",
              borderRadius: "16px",
              color: "#fff",
              boxShadow: "0 2px 12px #0002",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              padding: 0,
              position: "relative",
              transition: "transform 0.15s",
            }}
          >
            <img
              src={evento.imagen}
              alt={evento.nombre}
              style={{
                width: "100%",
                height: 110,
                objectFit: "cover",
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
              }}
            />
            <div style={{ padding: "14px 16px 10px 16px", width: "90%" }}>
              <span
                style={{
                  background: "#7c4dff",
                  color: "#fff",
                  fontSize: 12,
                  borderRadius: 8,
                  padding: "2px 10px",
                  fontWeight: 600,
                  marginBottom: 6,
                  display: "inline-block",
                }}
              >
                {evento.categoria}
              </span>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  margin: "8px 0 4px 0",
                  color: "#fff",
                }}
              >
                {evento.nombre}
              </h3>
              <div style={{ fontSize: 14, color: "#e0d7fa", marginBottom: 4 }}>
                {evento.fecha} · {evento.hora}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#e0d7fa",
                  marginBottom: 6,
                  minHeight: 32,
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-line",
                  overflowWrap: "break-word",
                  display: "block",
                }}
              >
                {evento.descripcion}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#b39ddb",
                  marginBottom: 8,
                  width: 250,
                }}
              >
                <span role="img" aria-label="ubicación">
                  📍
                </span>{" "}
                {evento.ubicacion}
              </div>
              <button
                style={{
                  background: "#7c4dff",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 16px",
                  fontWeight: 600,
                  cursor: "pointer",
                  marginTop: 2,
                  fontSize: 14,
                  boxShadow: "0 2px 8px #7c4dff33",
                  transition: "background 0.2s",
                }}
              >
                Ver evento
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

EventosCarruselRecomendados.propTypes = {
  eventos: PropTypes.array,
};

export default EventosCarruselRecomendados;
