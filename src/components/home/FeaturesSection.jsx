import React from "react";

const features = [
  {
    icon: "🗺️",
    title: "Mapa Interactivo",
    desc: "Ve eventos cerca de ti en tiempo real",
    color: "var(--blue)",
  },
  {
    icon: "⚡",
    title: "Eventos Inmediatos",
    desc: "Crea y únete a planes espontáneos",
    color: "var(--primary-purple)",
  },
  {
    icon: "💬",
    title: "Chat en Vivo",
    desc: "Conecta con otros participantes",
    color: "var(--cyan)",
  },
  {
    icon: "🔔",
    title: "Notificaciones",
    desc: "Entérate al instante de nuevos eventos",
    color: "var(--violet)",
  },
];

const FeaturesSection = React.forwardRef((props, ref) => {
  return (
    <section
      ref={ref}
      style={{
        padding: "100px 0",
        textAlign: "center",
        transformStyle: "preserve-3d",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(2rem, 5vw, 4rem)",
          color: "var(--white)",
          marginBottom: "60px",
          fontWeight: "700",
          opacity: "1",
          animation: "titlePulse3D 3s ease-in-out infinite",
          textShadow: "0 0 40px rgba(168, 123, 250, 0.6)",
        }}
      >
        ¿Qué puedes hacer? 🌟
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "30px",
          marginTop: "40px",
        }}
      >
        {features.map((feature, i) => (
          <div
            key={i}
            className="feature-card"
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              padding: "40px 20px",
              borderRadius: "20px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              transition: "all 0.3s ease",
              cursor: "pointer",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              style={{
                fontSize: "3rem",
                marginBottom: "20px",
                filter: `drop-shadow(0 0 10px ${feature.color})`,
                animation: "rotateFloat 4s ease-in-out infinite",
                animationDelay: `${i * 0.5}s`,
              }}
            >
              {feature.icon}
            </div>
            <h3
              style={{
                color: "var(--white)",
                fontSize: "1.3rem",
                marginBottom: "15px",
                fontWeight: "600",
                animation: "glow 2s ease-in-out infinite alternate",
                animationDelay: `${i * 0.2}s`,
              }}
            >
              {feature.title}
            </h3>
            <p
              style={{
                color: "var(--white)",
                fontSize: "0.95rem",
                opacity: "0.9",
              }}
            >
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
});

export default FeaturesSection;
