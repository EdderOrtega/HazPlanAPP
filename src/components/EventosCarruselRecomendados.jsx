import React, { useEffect, useRef } from "react";
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
  const cardsRef = useRef([]);
  const titleRef = useRef();
  useEffect(() => {
    if (!cardsRef.current) return;
    import("gsap").then(({ default: gsap }) => {
      // Animación de cards (igual que antes)
      cardsRef.current.forEach((el, idx) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { scale: 0.92, boxShadow: "0 2px 12px #0002", opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            boxShadow: "0 8px 32px #a259e655",
            duration: 1.1,
            ease: "elastic.out(1, 0.5)",
            delay: 0.2 + idx * 0.12,
            onComplete: () => {
              gsap.to(el, {
                scale: 1.04,
                boxShadow: "0 0 32px #a259e6cc",
                background:
                  "linear-gradient(135deg, #a259e6 60%, #3a2566 100%)",
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "sine.inOut",
                delay: 0.1 * idx,
              });
            },
          }
        );
      });
      // Animación de texto h2 (fade+pop, colores alternados blanco/morado, salto de línea natural)
      if (titleRef.current) {
        const el = titleRef.current;
        const text = el.textContent;
        const words = text.split(/\s+/);
        el.innerHTML = words
          .map((w, i) => {
            const color = i % 2 === 0 ? "#fff" : "#a259e6";
            return `<span class="carrusel-title-word" style="display:inline-flex; margin-right:8px; color:${color}; font-weight:900;">${w}</span>`;
          })
          .join(" ");
        const wordEls = el.querySelectorAll(".carrusel-title-word");
        gsap.fromTo(
          wordEls,
          { opacity: 0, scale: 0.7 },
          {
            opacity: 1,
            scale: 1.12,
            duration: 0.7,
            ease: "back.out(2)",
            stagger: 0.09,
            delay: 0.2,
            onComplete: () => {
              gsap.to(wordEls, {
                scale: 1.04,
                color: (i) => (i % 2 === 0 ? "#fff" : "#eee3f8ff"),
                textShadow: (i) =>
                  i % 2 === 0 ? "0 2px 8px #e0d2ecf6" : "0 2px 8px #fff8",
                repeat: -1,
                yoyo: true,
                duration: 1.2,
                ease: "sine.inOut",
                stagger: {
                  each: 0.09,
                  repeat: -1,
                  yoyo: true,
                },
                delay: 0.2,
              });
            },
          }
        );
      }
    });
  }, [eventos]);
  return (
    <section
      style={{
        background: "rgb(131 67 228)",
        padding: "32px 0 24px 0",
        borderRadius: "18px",
        margin: "40px 0",
        boxShadow: "0 4px 24px rgb(88 38 163)",
      }}
    >
      <h2
        ref={titleRef}
        style={{
          color: "#fff",
          marginLeft: 32,
          marginBottom: 18,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 1,
          lineHeight: 1.25,
          wordBreak: "break-word",
          whiteSpace: "normal",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
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
        {eventos.map((evento, idx) => (
          <div
            key={evento.id}
            ref={(el) => (cardsRef.current[idx] = el)}
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
                onClick={() => (window.location.href = `/evento/${evento.id}`)}
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
