import React, { useState, useEffect, useRef } from "react";
import amigos2 from "/public/images/amigos2.jpg";
import amigos3 from "/public/images/amigos3.jpg";
import iconoHazPlan from "/public/images/iconoHazPlanRedondo.png";
import ciudadVideo from "/public/videos/HazPlanCiudades.mp4";
import "../styles/introScreen.css";

function IntroScreen({ onFinish }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [textAnimation, setTextAnimation] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef(null);

  const slides = [
    {
      image: amigos2,
      title: "Conecta con Personas Increíbles",
      subtitle: "Descubre eventos únicos y haz nuevas amistades en tu ciudad",
      gradient:
        "linear-gradient(45deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.6))",
      animation: "slideInFromLeft",
    },
    {
      image: amigos3,
      title: "Vive Experiencias Inolvidables",
      subtitle:
        "Únete a la comunidad que está redefiniendo la forma de socializar",
      gradient:
        "linear-gradient(135deg, rgba(255, 107, 107, 0.7), rgba(238, 90, 82, 0.5))",
      animation: "slideInFromRight",
    },
    {
      video: ciudadVideo,
      title: "HazPlan",
      subtitle: "Tu próxima aventura te está esperando",
      gradient:
        "linear-gradient(225deg, rgba(89, 60, 143, 0.9), rgba(118, 75, 162, 0.7))",
      animation: "zoomIn",
      isLogo: true,
    },
  ];

  useEffect(() => {
    // Secuencia cinematográfica mejorada
    const sequence = [
      { time: 1000, action: () => setShowOverlay(false) },
      {
        time: 3000,
        action: () => {
          setCurrentSlide(1);
          setTextAnimation("fadeInUp");
        },
      },
      {
        time: 6000,
        action: () => {
          setCurrentSlide(2);
          setTextAnimation("zoomIn");
          setShowVideo(true);
          // Iniciar video cuando llegue al slide del logo
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current
              .play()
              .catch((e) => console.log("Video autoplay prevented:", e));
          }
        },
      },
      { time: 8000, action: () => setShowLogo(true) },
      { time: 12000, action: () => setShowButtons(true) }, // Aumentamos de 10000 a 12000
    ];

    const timers = sequence.map(({ time, action }) => setTimeout(action, time));

    return () => timers.forEach(clearTimeout);
  }, []);

  const handleStart = () => {
    if (onFinish) onFinish();
  };

  const handleSkip = () => {
    if (onFinish) onFinish();
  };

  return (
    <div className="intro-screen">
      {/* Video de fondo cinematográfico (slide 3) */}
      {currentSlide === 2 && showVideo && (
        <video
          ref={videoRef}
          className="background-video active"
          muted
          loop
          playsInline
          autoPlay
        >
          <source src={ciudadVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay cinematográfico */}
      <div
        className={`intro-overlay ${showOverlay ? "active" : "fade-out"}`}
      ></div>

      {/* Slides de fondo con efectos */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`intro-slide ${currentSlide === index ? "active" : ""} ${
            slide.animation
          }`}
          style={{
            backgroundImage:
              !slide.isLogo && !slide.video ? `url(${slide.image})` : "none",
            background: slide.isLogo
              ? slide.gradient
              : !slide.video
              ? `${slide.gradient}, url(${slide.image})`
              : slide.gradient,
          }}
        >
          {!slide.isLogo && (
            <div className={`slide-content ${textAnimation}`}>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
              <div className="slide-accent"></div>
            </div>
          )}
        </div>
      ))}

      {/* Logo central cinematográfico */}
      {currentSlide === 2 && (
        <div
          className={`intro-logo ${showLogo ? "show" : ""} ${textAnimation}`}
        >
          <div className="logo-container">
            <img src={iconoHazPlan} alt="HazPlan" className="logo-image" />
            <div className="logo-glow"></div>
          </div>
          <h1 className="logo-title">HazPlan</h1>
          <p className="logo-subtitle">Tu próxima aventura te está esperando</p>
          <div className="logo-particles">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`particle-${i}`}></div>
            ))}
          </div>
        </div>
      )}

      {/* Botones de acción con efectos */}
      <div className={`intro-actions ${showButtons ? "show" : ""}`}>
        <button className="btn-start premium-button" onClick={handleStart}>
          <span className="button-text">Comenzar Aventura</span>
          <div className="button-shine"></div>
        </button>
        <button className="btn-skip elegant-button" onClick={handleSkip}>
          <span className="button-text">Saltar Intro</span>
        </button>
      </div>

      {/* Indicadores de progreso mejorados */}
      <div className="intro-indicators">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`indicator ${currentSlide === index ? "active" : ""}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          ></div>
        ))}
      </div>

      {/* Elementos cinematográficos */}
      <div className="cinematic-bars">
        <div className="bar-top"></div>
        <div className="bar-bottom"></div>
      </div>

      {/* Partículas flotantes mejoradas */}
      <div className="floating-elements">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`floating-particle particle-type-${i % 3}`}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 3}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default IntroScreen;
