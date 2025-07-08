import React from "react";
import GTAAnimatedElement from "../effects/GTAAnimatedElement";

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
        background: "linear-gradient(135deg, #593c8f 0%, blueviolet 100%)",
        position: "relative",
      }}
    >
      <div
        style={{
          textAlign: "center",
          transformStyle: "preserve-3d",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <GTAAnimatedElement
          animationType="fadeInUp"
          delay={0.1}
          duration={1.2}
          triggerStart="top 120%"
        >
          <h2
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              color: "var(--white)",
              marginBottom: "60px",
              fontWeight: "700",
              opacity: "1",
              textShadow: "0 0 40px rgba(168, 123, 250, 0.6)",
            }}
          >
            ¿Qué puedes hacer? 🌟
          </h2>
        </GTAAnimatedElement>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            marginTop: "40px",
          }}
        >
          {features.map((feature, i) => (
            <GTAAnimatedElement
              key={i}
              animationType="flipIn"
              delay={0.3 + i * 0.1}
              duration={1.0}
              triggerStart="top 120%"
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
                  marginBottom: "20px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "80px",
                  width: "80px",
                  margin: "0 auto 20px auto",
                  borderRadius: "50%",
                  background: `linear-gradient(45deg, ${feature.color}, rgba(255, 255, 255, 0.1))`,
                  filter: `drop-shadow(0 0 15px ${feature.color})`,
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  fontSize: "2rem",
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
            </GTAAnimatedElement>
          ))}
        </div>
      </div>
    </section>
  );
});

export default FeaturesSection;
