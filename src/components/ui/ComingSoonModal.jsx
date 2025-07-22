import React, { useState, useEffect, useRef } from "react";
import ciudadVideo from "/videos/HazPlanCiudades.mp4";
import iconoHazPlan from "/images/iconoHazPlanRedondo.png";
import camiImg from "/images/capiCamion.png";
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
  // Preload video as soon as possible
  useEffect(() => {
    // Crea un objeto de video oculto para forzar la precarga si aún no está en caché
    const preloadVideo = document.createElement("video");
    preloadVideo.src = ciudadVideo;
    preloadVideo.preload = "auto";
    preloadVideo.muted = true;
    preloadVideo.style.display = "none";
    document.body.appendChild(preloadVideo);
    // Intenta cargar el video
    preloadVideo.load();
    // Limpieza
    return () => {
      document.body.removeChild(preloadVideo);
    };
  }, []);
  const textIntervalRef = useRef(null);

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
      title: "¡Eventos sorpresas!",
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
      setCurrentText(0); // Reinicia textos

      const sequence = [
        { time: 200, action: () => setShowLogo(true) },
        { time: 400, action: () => setLogoAnimation(true) },
        { time: 3400, action: () => setShowLogo(false) },
        { time: 3900, action: () => setShowContent(true) },
      ];

      const timers = sequence.map(({ time, action }) =>
        setTimeout(action, time)
      );

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.muted = false;
        videoRef.current.loop = false; // 🔥 FORZAR sin loop
        videoRef.current.play().catch(() => {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => {});
        });
      }

      const delayBeforeNextText = 4500 + 6000;
      const textTimeout = setTimeout(() => {
        setCurrentText(1);
        textIntervalRef.current = setInterval(() => {
          setCurrentText((prev) => (prev + 1) % texts.length);
        }, 6000);
      }, delayBeforeNextText);

      if (autoShowTimeout) clearTimeout(autoShowTimeout);

      return () => {
        timers.forEach(clearTimeout);
        clearTimeout(textTimeout);
        clearInterval(textIntervalRef.current);
        if (autoShowTimeout) clearTimeout(autoShowTimeout);
      };
    }
  }, [isOpen]);

  const handleVideoEnd = () => {
    if (videoRef.current) videoRef.current.pause();
    clearInterval(textIntervalRef.current);
    setVideoEnded(true);
    setShowContent(false);
    setShowLogo(false);
    setLogoAnimation(false);
    setCurrentText(0);
  };

  const handleReplay = () => {
    // Limpiar timeouts e intervalos previos
    clearInterval(textIntervalRef.current);
    setVideoEnded(false);
    setShowContent(false);
    setShowLogo(false);
    setLogoAnimation(false);
    setCurrentText(0);

    // Secuencia de animación igual que al abrir el modal
    const timers = [];
    timers.push(setTimeout(() => setShowLogo(true), 200));
    timers.push(setTimeout(() => setLogoAnimation(true), 400));
    timers.push(setTimeout(() => setShowLogo(false), 3400));
    timers.push(setTimeout(() => setShowContent(true), 3900));

    // Reiniciar video
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }

    // Reiniciar ciclo de textos igual que en useEffect
    const delayBeforeNextText = 4500 + 6000;
    setTimeout(() => {
      setCurrentText(1);
      textIntervalRef.current = setInterval(() => {
        setCurrentText((prev) => (prev + 1) % texts.length);
      }, 6000);
    }, delayBeforeNextText);
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
        {/* Video sin loop */}
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

        {/* Logo de bienvenida */}
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

        {/* Cinematic bars */}
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
          <div className="modal-header">
            <h1 className="hazplan-logo">HazPlan</h1>
          </div>

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

          <div className="text-indicators">
            {texts.map((_, index) => (
              <div
                key={index}
                className={`indicator ${currentText === index ? "active" : ""}`}
              ></div>
            ))}
          </div>

          <div className="modal-actions">
            <button className="btn-notify" onClick={handleClose}>
              <span>¡Quiero ser notificado!</span>
              <div className="button-glow"></div>
            </button>
          </div>
        </div>

        {/* Botón "Ver de nuevo" */}
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
              className="btn-replay-animated"
              style={{
                background: "rgba(60, 0, 90, 0.70)",
                color: "#fff",
                border: "2px solid #fff",
                borderRadius: "24px",
                padding: "18px 38px",
                fontSize: "1.3rem",
                fontWeight: 700,
                boxShadow: "0 4px 24px #7c4dff55",
                cursor: "pointer",
                marginBottom: "18px",
                transition: "all 0.2s",
                backdropFilter: "blur(2px)",
                display: "grid",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <img
                src={camiImg}
                alt="Camión HazPlan"
                style={{
                  width: "150px",
                  height: "150px",
                  objectFit: "contain",
                  filter: "drop-shadow(0 2px 8px #7c4dff88)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
                draggable={false}
              />
              Ver de nuevo
            </button>
            <span style={{ color: "#fff", fontWeight: 500 }}>
              El video ha terminado
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComingSoonModal;
