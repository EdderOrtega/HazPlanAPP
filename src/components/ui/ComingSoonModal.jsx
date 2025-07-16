import React, { useState, useEffect, useRef } from "react";
import ciudadVideo from "/public/videos/HazPlanCiudades.mp4";
import iconoHazPlan from "/public/images/iconoHazPlanRedondo.png";
import "../../styles/comingSoonModal.css";

let autoShowTimeout = null;
let userClosed = false;
const ComingSoonModal = ({ isOpen, onClose }) => {
  const [showContent, setShowContent] = useState(false);
  const [showLogo, setShowLogo] = useState(false);
  const [logoAnimation, setLogoAnimation] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
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
      title: " ¡Eventos sorpresas!",
      subtitle: "Gana boletos para el Mundial 🏆",
      description: "Participa en eventos exclusivos y gana entradas oficiales",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      userClosed = false;
      setShowContent(false);
      setShowLogo(false);
      setLogoAnimation(false);
      setVideoEnded(false);

      const sequence = [
        { time: 100, action: () => setShowLogo(true) },
        { time: 200, action: () => setLogoAnimation(true) },
        { time: 3200, action: () => setShowLogo(false) },
        { time: 3700, action: () => setShowContent(true) },
      ];

      let timers = [];
      if (!videoEnded) {
        timers = sequence.map(({ time, action }) => setTimeout(action, time));
      }

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        });
      }

      let textInterval;
      if (!videoEnded) {
        textInterval = setInterval(() => {
          setCurrentText((prev) => (prev + 1) % texts.length);
        }, 40000);
      }

      // Solo reabrir automáticamente si el usuario NO lo cerró
      if (autoShowTimeout) clearTimeout(autoShowTimeout);
      autoShowTimeout = setTimeout(() => {
        if (!userClosed && isOpen && typeof onClose === "function") {
          onClose();
          setTimeout(() => {
            if (!userClosed && typeof onClose === "function") onClose(true); // true para indicar auto
          }, 3000);
        }
      }, 40000);

      return () => {
        timers.forEach(clearTimeout);
        clearInterval(textInterval);
        if (autoShowTimeout) clearTimeout(autoShowTimeout);
      };
    }
  }, [isOpen, texts.length, videoEnded, onClose]);

  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowContent(false);
    setShowLogo(false);
    setLogoAnimation(false);
  };

  const handleReplay = () => {
    setVideoEnded(false);
    setCurrentText(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleClose = () => {
    userClosed = true;
    setShowContent(false);
    setShowLogo(false);
    setLogoAnimation(false);
    setTimeout(() => {
      onClose();
      setCurrentText(0);
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      userClosed = true;
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
        {/* Video de fondo - Optimizado */}
        <video
          ref={videoRef}
          className="modal-video"
          playsInline
          preload="auto"
          poster=""
          onEnded={handleVideoEnd}
          style={{
            imageRendering: "-webkit-optimize-contrast",
          }}
        >
          <source src={ciudadVideo} type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>

        {/* Overlay oscuro */}
        <div className="modal-overlay"></div>

        {/* Logo de bienvenida cinematográfico (solo icono, sin texto) */}
        {showLogo && (
          <div className={`modal-intro-logo ${logoAnimation ? "animate" : ""}`}>
            <div className="modal-logo-container">
              <img
                src={iconoHazPlan}
                alt="HazPlan"
                className="modal-logo-image"
              />
              <div className="modal-logo-glow"></div>
            </div>
          </div>
        )}

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
        <div
          className={`modal-content ${
            showContent && !videoEnded ? "show" : ""
          }`}
        >
          {/* Logo HazPlan en la parte superior */}
          {/* Botón "Ver de nuevo" cuando termina el video */}
          {videoEnded && (
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <button
                onClick={handleReplay}
                style={{
                  background: "#7c4dff",
                  color: "#fff",
                  border: "none",
                  borderRadius: "24px",
                  padding: "18px 38px",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  boxShadow: "0 4px 24px #7c4dff55",
                  cursor: "pointer",
                  marginBottom: "18px",
                  transition: "all 0.2s",
                }}
              >
                Ver de nuevo
              </button>
              <span style={{ color: "#fff", fontWeight: 500 }}>
                El video ha terminado
              </span>
            </div>
          )}
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
      </div>
    </div>
  );
};

export default ComingSoonModal;
