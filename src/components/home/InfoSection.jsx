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
        padding: "40px 0",
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "40px",
        alignItems: "center",
        justifyItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          background: "rgba(40,30,80,0.85)",
          borderRadius: 24,
          boxShadow: "0 8px 32px rgba(103,58,183,0.18)",
          padding: "48px 32px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          textAlign: "center",
        }}
      >
        <div
          className="section-image"
          style={{
            width: 120,
            height: 120,
            background:
              sectionKey === "section1"
                ? "linear-gradient(45deg, var(--primary-purple), var(--blue))"
                : sectionKey === "section2"
                ? "linear-gradient(45deg, var(--cyan), var(--blue))"
                : "linear-gradient(45deg, var(--primary-purple), var(--violet))",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "3rem",
            marginBottom: 32,
            boxShadow: "0 4px 24px rgba(103,58,183,0.18)",
            animation:
              sectionKey === "section1"
                ? "cube3D 6s ease-in-out infinite"
                : sectionKey === "section2"
                ? "sphere3D 5s ease-in-out infinite"
                : "pyramid3D 7s ease-in-out infinite",
            transformStyle: "preserve-3d",
            opacity: 0,
            animationName: "fadeInUp",
            animationDuration: "1s",
            animationDelay: "0.1s",
            animationFillMode: "forwards",
          }}
        >
          <span
            style={{
              animation:
                sectionKey === "section1"
                  ? "iconSpin3D 4s linear infinite"
                  : sectionKey === "section2"
                  ? "heartBeat3D 2s ease-in-out infinite"
                  : "bounce3D 3s ease-in-out infinite",
              display: "inline-block",
              opacity: 0,
              animationName: "fadeIn",
              animationDuration: "1.2s",
              animationDelay: "0.3s",
              animationFillMode: "forwards",
            }}
          >
            {section.icons}
          </span>
        </div>
        <h2
          style={{
            fontSize: "clamp(2.2rem, 4vw, 3rem)",
            color: "var(--white)",
            padding: "10px",
            marginBottom: "24px",
            fontWeight: "700",
            textAlign: "center",
            opacity: 0,
            animationName: "fadeInDown",
            animationDuration: "1s",
            animationDelay: "0.4s",
            animationFillMode: "forwards",
          }}
        >
          {section.title}
        </h2>
        <p
          style={{
            fontSize: "1.15rem",
            color: "var(--white)",
            lineHeight: "1.6",
            marginBottom: "18px",
            opacity: 0,
            textAlign: "center",
            animationName: "fadeIn",
            animationDuration: "1s",
            animationDelay: "0.7s",
            animationFillMode: "forwards",
          }}
        >
          {section.description}
        </p>
        <ul
          style={{
            color: "var(--white)",
            fontSize: "1.08rem",
            listStyle: "none",
            padding: 0,
            opacity: "0.92",
            margin: 0,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {section.features.map((feature, i) => (
            <li
              key={i}
              style={{
                marginBottom: "10px",
                padding: "10px 0 10px 0",
                width: "100%",
                maxWidth: 480,
                animation: isReverse
                  ? "slideInRight 0.8s ease-out"
                  : "slideInLeft 0.8s ease-out",
                animationDelay: `${i * 0.2}s`,
                animationFillMode: "both",
                textAlign: "center",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

export default InfoSection;
