import React, { useState, useEffect, useRef } from "react";
import ciudadVideo from "../../assets/HazPlanCiudades.mp4";
import "../../styles/comingSoonModal.css";

const ComingSoonModal = ({ isOpen, onClose }) => {
  const [showContent, setShowContent] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const texts = [
    {
      title: "¡Próximamente!",
      subtitle: "HazPlan llegará a más ciudades",
      description: "Conecta con personas increíbles en toda la región",
    },
    {
      title: "Nuevas Aventuras",
      subtitle: "Eventos únicos te esperan",
      description: "Descubre experiencias inolvidables cerca de ti",
    },
    {
      title: "Comunidad Global",
      subtitle: "Únete a miles de usuarios",
      description: "Forma parte de la revolución social",
    },
    {
      title: "🏆 ¡Mundial 2026!",
      subtitle: "Gana boletos para el Mundial",
      description: "Participa en eventos exclusivos y gana entradas oficiales",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setShowContent(false);
      // Secuencia de animación
      const timer1 = setTimeout(() => setShowContent(true), 1000);

      // Iniciar video
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false; // Asegurar que el audio esté activado
        videoRef.current.play().catch((e) => {
          console.log("Video autoplay prevented:", e);
          // Si falla el autoplay con sonido, intentar con muted
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(console.log);
        });
      }

      // Cambiar textos cada 3 segundos
      const textInterval = setInterval(() => {
        setCurrentText((prev) => (prev + 1) % texts.length);
      }, 7000);

      return () => {
        clearTimeout(timer1);
        clearInterval(textInterval);
      };
    }
  }, [isOpen, texts.length]);

  const handleClose = () => {
    setShowContent(false);
    setTimeout(() => {
      onClose();
      setCurrentText(0);
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="coming-soon-modal" onClick={handleBackdropClick}>
      <div className="modal-container">
        {/* Video de fondo */}
        <video
          ref={videoRef}
          className="modal-video"
          loop
          playsInline
          preload="auto"
          poster=""
          style={{
            // Configuraciones adicionales para mejor calidad
            imageRendering: "-webkit-optimize-contrast",
          }}
        >
          <source src={ciudadVideo} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>

        {/* Overlay oscuro */}
        <div className="modal-overlay"></div>

        {/* Barras cinematográficas */}
        <div className="cinematic-bars">
          <div className="bar-top"></div>
          <div className="bar-bottom"></div>
        </div>

        {/* Botón cerrar */}
        <button className="modal-close" onClick={handleClose}>
          <span>✕</span>
        </button>

        {/* Botón de sonido */}
        <button
          className="modal-sound"
          onClick={toggleMute}
          style={{
            position: "absolute",
            top: "50px",
            left: "20px",
            background: "rgba(118, 75, 162, 0.8)",
            border: "none",
            borderRadius: "50%",
            width: "45px",
            height: "45px",
            color: "white",
            fontSize: "18px",
            cursor: "pointer",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            transition: "all 0.3s ease",
            boxShadow: "0 4px 15px rgba(89, 60, 143, 0.4)",
          }}
        >
          <span>{isMuted ? "🔇" : "🔊"}</span>
        </button>

        {/* Contenido */}
        <div className={`modal-content ${showContent ? "show" : ""}`}>
          {/* Logo HazPlan en la parte superior */}
          <div className="modal-header">
            <h1 className="hazplan-logo">HazPlan</h1>
          </div>

          {/* Textos dinámicos centrados con efecto esférico */}
          <div className="modal-text-center">
            <div className="text-sphere-container">
              {texts.map((text, index) => (
                <div
                  key={index}
                  className={`text-sphere ${
                    currentText === index
                      ? "active"
                      : index < currentText
                      ? "behind"
                      : "front"
                  }`}
                >
                  <h2 className="sphere-title">{text.title}</h2>
                  <h3 className="sphere-subtitle">{text.subtitle}</h3>
                  <p className="sphere-description">{text.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Indicadores de progreso */}
          <div className="text-indicators">
            {texts.map((_, index) => (
              <div
                key={index}
                className={`indicator ${currentText === index ? "active" : ""}`}
              ></div>
            ))}
          </div>

          {/* Botón de acción */}
          <div className="modal-actions">
            <button className="btn-notify" onClick={handleClose}>
              <span>¡Quiero ser notificado!</span>
              <div className="button-glow"></div>
            </button>
          </div>

          {/* Partículas flotantes */}
          <div className="modal-particles">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`particle particle-${i % 4}`}
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 4}s`,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* Texto de deslizar para cerrar (móvil) */}
        <div className="swipe-hint">
          <span>Desliza hacia arriba para cerrar</span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonModal;
