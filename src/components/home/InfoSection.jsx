import React from "react";
import amigos2 from "../../assets/amigos2.jpg";
import amigos3 from "../../assets/amigos3.jpg";
import GTAAnimatedElement from "../effects/GTAAnimatedElement";

const sections = {
  section1: {
    title: "Eventos que pasan AHORA 🔥",
    description:
      "No más planificación aburrida. Crea eventos espontáneos que suceden en las próximas horas.",
    features: [
      "⚡ Eventos en las próximas 2-3 horas",
      "🎯 Únete con un solo clic",
      "📍 Todo sucede cerca de ti",
    ],
    image: amigos2,
  },
  section2: {
    title: "Conexiones Auténticas 🌟",
    description:
      "Chat en tiempo real con otros participantes. Conoce gente nueva que comparte tus intereses.",
    features: [
      "💬 Chat grupal por evento",
      "🔔 Notificaciones instantáneas",
      "👥 Ve quién más va al evento",
    ],
    image: amigos3,
  },
  section3: {
    title: "Diseñado para Monterrey 🏙️",
    description:
      "Una plataforma hecha específicamente para conectar a la comunidad regiomontana.",
    features: [
      "🌮 Eventos gastronómicos locales",
      "🎵 Música y cultura regiomontana",
      "🏔️ Aventuras en la naturaleza",
    ],
    image: amigos2,
  },
};

const InfoSection = React.forwardRef(({ sectionKey }, ref) => {
  const section = sections[sectionKey];
  const isReverse = sectionKey === "section2";

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
          display: "grid",
          gridTemplateColumns:
            window.innerWidth <= 768
              ? "1fr"
              : isReverse
              ? "1fr 1fr"
              : "1fr 1fr",
          gap: "60px",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        {isReverse ? (
          <>
            <GTAAnimatedElement
              animationType="zoomIn"
              delay={0.1}
              duration={1.5}
              triggerStart="top 120%"
              className="section-image"
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                  "0 15px 40px rgba(168, 123, 250, 0.4), 0 0 80px rgba(184, 91, 204, 0.3)",
                transform: "perspective(1000px)",
              }}
            >
              <img
                src={section.image}
                alt="Amigos conectándose"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "20px",
                  filter: "saturate(1.2) contrast(1.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(45deg, rgba(168, 123, 250, 0.2), rgba(184, 91, 204, 0.2))",
                  borderRadius: "20px",
                  animation: "gtaPulse 3s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "60px",
                  height: "60px",
                  background:
                    "linear-gradient(45deg, var(--cyan), var(--blue))",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  animation: "gtaSpin 8s linear infinite",
                  boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
                }}
              >
                ⚡
              </div>
            </GTAAnimatedElement>
            <GTAAnimatedElement
              animationType="slideInLeft"
              delay={0.2}
              duration={1.0}
              triggerStart="top 120%"
            >
              <h2
                style={{
                  fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                  color: "var(--white)",
                  marginBottom: "30px",
                  fontWeight: "700",
                }}
              >
                {section.title}
              </h2>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "var(--white)",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                  opacity: "1",
                }}
              >
                {section.description}
              </p>
              <ul
                style={{
                  color: "var(--white)",
                  fontSize: "1.1rem",
                  listStyle: "none",
                  padding: 0,
                  opacity: "0.9",
                }}
              >
                {section.features.map((feature, i) => (
                  <GTAAnimatedElement
                    key={i}
                    animationType="slideInLeft"
                    delay={0.4 + i * 0.1}
                    duration={0.6}
                    triggerStart="top 120%"
                  >
                    <li
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      {feature}
                    </li>
                  </GTAAnimatedElement>
                ))}
              </ul>
            </GTAAnimatedElement>
          </>
        ) : (
          <>
            <GTAAnimatedElement
              animationType="slideInRight"
              delay={0.2}
              duration={1.0}
              triggerStart="top 120%"
            >
              <h2
                style={{
                  fontSize: "clamp(2.5rem, 4vw, 3.5rem)",
                  color: "var(--white)",
                  marginBottom: "30px",
                  fontWeight: "700",
                }}
              >
                {section.title}
              </h2>
              <p
                style={{
                  fontSize: "1.2rem",
                  color: "var(--white)",
                  lineHeight: "1.6",
                  marginBottom: "20px",
                  opacity: "1",
                }}
              >
                {section.description}
              </p>
              <ul
                style={{
                  color: "var(--white)",
                  fontSize: "1.1rem",
                  listStyle: "none",
                  padding: 0,
                  opacity: "0.9",
                }}
              >
                {section.features.map((feature, i) => (
                  <GTAAnimatedElement
                    key={i}
                    animationType="slideInRight"
                    delay={0.4 + i * 0.1}
                    duration={0.6}
                    triggerStart="top 120%"
                  >
                    <li
                      style={{
                        marginBottom: "10px",
                      }}
                    >
                      {feature}
                    </li>
                  </GTAAnimatedElement>
                ))}
              </ul>
            </GTAAnimatedElement>
            <GTAAnimatedElement
              animationType="morphIn"
              delay={0.1}
              duration={1.5}
              triggerStart="top 120%"
              className="section-image"
              style={{
                width: "100%",
                height: "400px",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                  "0 15px 40px rgba(103, 58, 183, 0.4), 0 0 60px rgba(184, 91, 204, 0.2)",
                transform: "perspective(1000px)",
              }}
            >
              <img
                src={section.image}
                alt="Amigos conectándose"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "20px",
                  filter: "saturate(1.2) contrast(1.1) brightness(1.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    sectionKey === "section1"
                      ? "linear-gradient(45deg, rgba(103, 58, 183, 0.2), rgba(184, 91, 204, 0.2))"
                      : "linear-gradient(45deg, rgba(138, 43, 226, 0.2), rgba(147, 51, 234, 0.2))",
                  borderRadius: "20px",
                  animation: "gtaPulse 3s ease-in-out infinite",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  width: "60px",
                  height: "60px",
                  background:
                    sectionKey === "section1"
                      ? "linear-gradient(45deg, var(--primary-purple), var(--blue))"
                      : "linear-gradient(45deg, var(--primary-purple), var(--violet))",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  animation:
                    sectionKey === "section1"
                      ? "gtaSpin 6s linear infinite"
                      : "gtaSpin 8s linear infinite reverse",
                  boxShadow:
                    sectionKey === "section1"
                      ? "0 0 20px rgba(103, 58, 183, 0.5)"
                      : "0 0 20px rgba(138, 43, 226, 0.5)",
                }}
              >
                {sectionKey === "section1" ? "⚡" : "🏔️"}
              </div>
            </GTAAnimatedElement>
          </>
        )}
      </div>
    </section>
  );
});

InfoSection.displayName = "InfoSection";

// Añadiendo estilos CSS para las animaciones tipo GTA 6
const styles = `
  @keyframes gtaFloat {
    0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px); }
    25% { transform: perspective(1000px) rotateX(2deg) rotateY(2deg) translateZ(10px); }
    50% { transform: perspective(1000px) rotateX(0deg) rotateY(4deg) translateZ(20px); }
    75% { transform: perspective(1000px) rotateX(-2deg) rotateY(2deg) translateZ(10px); }
    100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px); }
  }

  @keyframes gtaZoom {
    0% { transform: scale(1.1) rotate(0deg); filter: saturate(1.2) contrast(1.1) brightness(1.1); }
    25% { transform: scale(1.05) rotate(0.5deg); filter: saturate(1.3) contrast(1.2) brightness(1.1); }
    50% { transform: scale(1.08) rotate(0deg); filter: saturate(1.4) contrast(1.3) brightness(1.2); }
    75% { transform: scale(1.06) rotate(-0.5deg); filter: saturate(1.3) contrast(1.2) brightness(1.1); }
    100% { transform: scale(1.1) rotate(0deg); filter: saturate(1.2) contrast(1.1) brightness(1.1); }
  }

  @keyframes gtaPulse {
    0% { opacity: 0.2; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(1.02); }
    100% { opacity: 0.2; transform: scale(1); }
  }

  @keyframes gtaSpin {
    0% { transform: rotate(0deg) scale(1); box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
    25% { transform: rotate(90deg) scale(1.1); box-shadow: 0 0 30px rgba(0, 255, 255, 0.7); }
    50% { transform: rotate(180deg) scale(1); box-shadow: 0 0 40px rgba(0, 255, 255, 0.9); }
    75% { transform: rotate(270deg) scale(1.1); box-shadow: 0 0 30px rgba(0, 255, 255, 0.7); }
    100% { transform: rotate(360deg) scale(1); box-shadow: 0 0 20px rgba(0, 255, 255, 0.5); }
  }

  @keyframes slideInLeft {
    0% { transform: translateX(-100px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @keyframes slideInRight {
    0% { transform: translateX(100px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }

  @media (max-width: 768px) {
    .section-image {
      height: 300px !important;
    }
  }
`;

// Inyectar estilos en el head del documento
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

export default InfoSection;
