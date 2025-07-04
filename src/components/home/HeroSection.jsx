import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = React.forwardRef((props, ref) => {
  const navigate = useNavigate();

  return (
    <section
      ref={ref}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        transformStyle: "preserve-3d",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(3rem, 8vw, 8rem)",
          fontWeight: "900",
          color: "var(--white)",
          marginBottom: "30px",
          letterSpacing: "-0.02em",
          textShadow:
            "0 0 60px rgba(103, 58, 183, 0.6), 0 0 100px rgba(184, 91, 204, 0.4)",
          animation: "float3D 4s ease-in-out infinite",
          transformStyle: "preserve-3d",
        }}
      >
        HazPlan ⚡
      </h1>

      <p
        style={{
          fontSize: "clamp(1.2rem, 3vw, 2rem)",
          color: "var(--white)",
          marginBottom: "50px",
          maxWidth: "600px",
          lineHeight: "1.4",
          fontWeight: "300",
          opacity: "0.9",
          animation: "textFloat3D 3s ease-in-out infinite 0.5s",
          textShadow: "0 0 30px rgba(255, 255, 255, 0.3)",
        }}
      >
        Conecta con tu ciudad en tiempo real
      </p>

      <div
        style={{
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => navigate("/registro")}
          style={{
            padding: "15px 40px",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "none",
            borderRadius: "50px",
            background:
              "linear-gradient(45deg, var(--primary-purple), var(--blue))",
            color: "var(--white)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow: "0 8px 25px rgba(103, 58, 183, 0.5)",
            animation: "pulse 2s ease-in-out infinite",
          }}
        >
          🚀 Registrarse
        </button>

        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "15px 40px",
            fontSize: "1.1rem",
            fontWeight: "600",
            border: "2px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "50px",
            background: "rgba(255, 255, 255, 0.05)",
            color: "var(--white)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            backdropFilter: "blur(10px)",
          }}
        >
          🔑 Iniciar Sesión
        </button>
      </div>
    </section>
  );
});

export default HeroSection;
