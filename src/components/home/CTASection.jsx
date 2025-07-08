import React from "react";
import { useNavigate } from "react-router-dom";

const CTASection = React.forwardRef((props, ref) => {
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      style={{
        padding: "120px 0",
        textAlign: "center",
        background: "linear-gradient(135deg, #593c8f 0%, blueviolet 100%)",
        borderRadius: "30px",
        margin: "60px 0",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(20px)",
        position: "relative",
      }}
    >
      <h2
        style={{
          fontSize: "clamp(2.5rem, 5vw, 4rem)",
          color: "var(--white)",
          marginBottom: "30px",
          fontWeight: "700",
          animation: "textGlow 2s ease-in-out infinite alternate",
        }}
      >
        ¿Listo para comenzar? 🚀
      </h2>

      <p
        style={{
          fontSize: "1.3rem",
          color: "var(--white)",
          marginBottom: "50px",
          maxWidth: "600px",
          margin: "0 auto 50px auto",
          opacity: "1",
        }}
      >
        Únete a la comunidad más activa de Monterrey y descubre eventos
        increíbles que suceden cerca de ti.
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => navigate("/registro")}
          style={{
            padding: "20px 50px",
            fontSize: "1.2rem",
            fontWeight: "700",
            border: "none",
            borderRadius: "60px",
            background:
              "linear-gradient(45deg, var(--primary-purple), var(--blue))",
            color: "var(--white)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 10px 30px rgba(103, 58, 183, 0.5)",
            animation: "bounce 2s ease-in-out infinite",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-5px) scale(1.05)";
            e.target.style.boxShadow = "0 15px 40px rgba(103, 58, 183, 0.7)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0) scale(1)";
            e.target.style.boxShadow = "0 10px 30px rgba(103, 58, 183, 0.5)";
          }}
        >
          🎉 ¡Empezar Ahora!
        </button>

        <button
          onClick={() => navigate("/mapa")}
          style={{
            padding: "20px 50px",
            fontSize: "1.2rem",
            fontWeight: "700",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "60px",
            background: "rgba(255, 255, 255, 0.05)",
            color: "var(--white)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.1)";
            e.target.style.border = "2px solid rgba(255, 255, 255, 0.5)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255, 255, 255, 0.05)";
            e.target.style.border = "2px solid rgba(255, 255, 255, 0.3)";
          }}
        >
          🗺️ Ver Mapa
        </button>
      </div>
    </section>
  );
});

export default CTASection;
