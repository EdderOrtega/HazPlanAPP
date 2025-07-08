import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ciudadVideo from "../../assets/HazPlanCiudades.mp4";

const HeroSection = React.forwardRef((props, ref) => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
      videoRef.current.currentTime = 0;
    }
  }, []);

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
        overflow: "hidden",
      }}
    >
      {/* Video de fondo cinematográfico */}
      <video
        ref={videoRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          zIndex: -3,
          opacity: 0.8,
          filter: "brightness(0.7) contrast(1.1) saturate(1.2)",
        }}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={ciudadVideo} type="video/mp4" />
      </video>

      {/* Overlay con gradiente cinematográfico */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: `linear-gradient(
            45deg,
            rgba(0, 0, 0, 0.7) 0%,
            rgba(89, 60, 143, 0.3) 50%,
            rgba(118, 75, 162, 0.4) 100%
          )`,
          zIndex: -2,
          pointerEvents: "none",
        }}
      />

      {/* Contenido principal */}
      <div style={{ position: "relative", zIndex: 1 }}>
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
          HazPlan
        </h1>

        <p
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            color: "var(--white)",
            marginBottom: "50px",
            maxWidth: "600px",
            lineHeight: "1.4",
            fontWeight: "500",
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
      </div>
    </section>
  );
});

export default HeroSection;
