import React from "react";

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
    icons: "⚡🗺️⚡",
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
    icons: "💬🤝💬",
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
    icons: "🏙️🌮🏔️",
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
        display: "grid",
        gridTemplateColumns: isReverse ? "1fr 1fr" : "1fr 1fr",
        gap: "60px",
        alignItems: "center",
      }}
    >
      {isReverse ? (
        <>
          <div
            className="section-image"
            style={{
              width: "100%",
              height: "400px",
              background: "linear-gradient(45deg, var(--cyan), var(--blue))",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "4rem",
              transform: "scale(1)",
              boxShadow:
                "0 15px 40px rgba(168, 123, 250, 0.4), 0 0 80px rgba(184, 91, 204, 0.3)",
              animation: "sphere3D 5s ease-in-out infinite",
              transformStyle: "preserve-3d",
            }}
          >
            <span style={{ animation: "heartBeat3D 2s ease-in-out infinite" }}>
              {section.icons}
            </span>
          </div>
          <div>
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
                <li
                  key={i}
                  style={{
                    marginBottom: "10px",
                    animation: "slideInRight 0.8s ease-out",
                    animationDelay: `${i * 0.2}s`,
                    animationFillMode: "both",
                  }}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div>
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
                <li
                  key={i}
                  style={{
                    marginBottom: "10px",
                    animation: "slideInLeft 0.8s ease-out",
                    animationDelay: `${i * 0.2}s`,
                    animationFillMode: "both",
                  }}
                >
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="section-image"
            style={{
              width: "100%",
              height: "400px",
              background:
                sectionKey === "section1"
                  ? "linear-gradient(45deg, var(--primary-purple), var(--blue))"
                  : "linear-gradient(45deg, var(--primary-purple), var(--violet))",
              borderRadius: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "4rem",
              transform: "scale(1)",
              boxShadow:
                "0 15px 40px rgba(103, 58, 183, 0.4), 0 0 60px rgba(184, 91, 204, 0.2)",
              animation:
                sectionKey === "section1"
                  ? "cube3D 6s ease-in-out infinite"
                  : "pyramid3D 7s ease-in-out infinite",
              transformStyle: "preserve-3d",
            }}
          >
            <span
              style={{
                animation:
                  sectionKey === "section1"
                    ? "iconSpin3D 4s linear infinite"
                    : "bounce3D 3s ease-in-out infinite",
              }}
            >
              {section.icons}
            </span>
          </div>
        </>
      )}
    </section>
  );
});

export default InfoSection;
