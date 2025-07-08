import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ciudadVideo from "../assets/HazPlanMapaVideo.mp4";
// Importar iconos de categorías
import arteIcon from "../assets/arte.png";
import deportesIcon from "../assets/deportes.png";
import comunidadIcon from "../assets/comunidad.png";
import mascotasIcon from "../assets/mascotas.png";
import medioambienteIcon from "../assets/medioambiente.png";
import saludIcon from "../assets/salud.png";
import inclusionIcon from "../assets/inclusion.png";
import fandomsIcon from "../assets/fandoms.png";
import "../styles/vectorAnimado.css";

function AnimatedText({ text, delay = 0 }) {
  return (
    <h1
      style={{
        fontWeight: 700,
        margin: "20px 0",
        display: "flex",
        justifyContent: "center",
        color: "white",
        fontSize: "clamp(3rem, 8vw, 5rem)",
        textShadow:
          "0 2px 10px rgba(0,0,0,0.7), 0 4px 20px rgba(118, 75, 162, 0.5)",
        letterSpacing: "3px",
        textAlign: "center",
        lineHeight: "1.2",
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1,
            delay: delay + i * 0.07,
            ease: "easeOut",
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </h1>
  );
}

function VectorAnimado() {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
      // Prevenir reinicio del video al recargar
      videoRef.current.currentTime = 0;
    }
  }, []);

  return (
    <div className="vector-animado-container">
      {/* Video de fondo con filtro morado cinematográfico - Optimizado */}
      <video
        ref={videoRef}
        className="vector-background-video"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata" // Cambio de "auto" a "metadata" para carga más rápida
        poster="" // Eliminar poster para reducir requests
        style={{
          display: "block", // Mostrar siempre
        }}
      >
        <source src={ciudadVideo} type="video/mp4" />
      </video>

      {/* Overlay con gradiente morado */}
      <div className="vector-overlay"></div>

      {/* Overlay adicional para convertir verdes a morado */}
      <div className="vector-color-overlay"></div>

      {/* Iconos flotantes animados - Cargar siempre */}
      <FloatingIcons />

      {/* Contenido de la animación de bienvenida */}
      <div className="vector-content">
        <AnimatedText text="Bienvenidos" delay={0.3} />

        <div className="vector-logo">
          <svg
            width="113"
            height="140"
            viewBox="0 0 113 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stroke animado */}
            <motion.path
              d="M31.5965 0H19.626V18.3733H31.5965V0ZM80.7312 69.735C86.8556 69.735 89.5003 69.5959 92.2841 68.0647V0H80.7312V69.735ZM11.5529 30.0654H76.973C77.669 30.0654 78.5041 30.2046 79.3393 30.2046V19.9044H0V124.159H11.5529V81.7055H18.2341V71.4053H11.5529V30.0654ZM93.9544 21.7139V33.406C98.5477 36.329 100.636 41.6183 100.636 50.6658C100.636 60.8268 98.2693 66.9512 92.5625 69.5958C90.1962 70.7094 87.4124 70.9878 80.8704 71.127L32.9884 71.4053V81.7055H80.592C85.6029 81.7055 88.3867 81.8447 92.5625 80.8704C101.332 78.7825 112.606 71.5445 112.606 50.5266C112.606 33.8236 105.09 25.1937 93.9544 21.7139ZM19.626 139.192H31.5965V31.4573H19.626V139.192ZM80.7312 82.9583V139.192H92.2841V82.2623C89.6394 82.9582 85.8813 82.9583 80.7312 82.9583Z"
              fill="transparent"
              stroke="white"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Fill animado */}
            <motion.path
              d="M31.5965 0H19.626V18.3733H31.5965V0ZM80.7312 69.735C86.8556 69.735 89.5003 69.5959 92.2841 68.0647V0H80.7312V69.735ZM11.5529 30.0654H76.973C77.669 30.0654 78.5041 30.2046 79.3393 30.2046V19.9044H0V124.159H11.5529V81.7055H18.2341V71.4053H11.5529V30.0654ZM93.9544 21.7139V33.406C98.5477 36.329 100.636 41.6183 100.636 50.6658C100.636 60.8268 98.2693 66.9512 92.5625 69.5958C90.1962 70.7094 87.4124 70.9878 80.8704 71.127L32.9884 71.4053V81.7055H80.592C85.6029 81.7055 88.3867 81.8447 92.5625 80.8704C101.332 78.7825 112.606 71.5445 112.606 50.5266C112.606 33.8236 105.09 25.1937 93.9544 21.7139ZM19.626 139.192H31.5965V31.4573H19.626V139.192ZM80.7312 82.9583V139.192H92.2841V82.2623C89.6394 82.9582 85.8813 82.9583 80.7312 82.9583Z"
              fill="white"
              stroke="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.5, ease: "easeInOut" }}
            />
          </svg>
        </div>

        <AnimatedText text="Haz Plan" delay={2.5} />
      </div>
    </div>
  );
}

// Componente para iconos flotantes
function FloatingIcons() {
  const icons = [
    // Primera fila - empezar a los 2 segundos para que se vean completos
    {
      src: arteIcon,
      name: "Arte",
      delay: 2,
      position: { left: "15%", top: "20%" },
    },
    {
      src: deportesIcon,
      name: "Deportes",
      delay: 2.1,
      position: { left: "35%", top: "15%" },
    },
    {
      src: comunidadIcon,
      name: "Comunidad",
      delay: 2.2,
      position: { left: "65%", top: "20%" },
    },
    {
      src: mascotasIcon,
      name: "Mascotas",
      delay: 2.3,
      position: { left: "85%", top: "15%" },
    },

    // Segunda fila
    {
      src: medioambienteIcon,
      name: "Medio Ambiente",
      delay: 2.4,
      position: { left: "10%", top: "45%" },
    },
    {
      src: saludIcon,
      name: "Salud",
      delay: 2.5,
      position: { left: "90%", top: "45%" },
    },

    // Tercera fila
    {
      src: inclusionIcon,
      name: "Inclusión",
      delay: 2.6,
      position: { left: "20%", top: "70%" },
    },
    {
      src: fandomsIcon,
      name: "Fandoms",
      delay: 2.7,
      position: { left: "40%", top: "75%" },
    },
    {
      src: arteIcon,
      name: "Arte2",
      delay: 2.8,
      position: { left: "60%", top: "70%" },
    },
    {
      src: deportesIcon,
      name: "Deportes2",
      delay: 2.9,
      position: { left: "80%", top: "75%" },
    },

    // Cuarta fila (abajo)
    {
      src: comunidadIcon,
      name: "Comunidad2",
      delay: 3.0,
      position: { left: "15%", top: "85%" },
    },
    {
      src: mascotasIcon,
      name: "Mascotas2",
      delay: 3.1,
      position: { left: "85%", top: "85%" },
    },
  ];

  return (
    <div className="floating-icons-container">
      {icons.map((icon) => (
        <motion.div
          key={icon.name}
          className="floating-icon"
          initial={{
            opacity: 0,
            scale: 0,
            y: 30,
            rotate: -180,
          }}
          animate={{
            opacity: [0, 0.8, 1, 1, 1, 0.8, 0],
            scale: [0, 0.8, 1.1, 1, 1, 0.9, 0],
            y: [30, 0, -5, 0, 0, -10, 20],
            rotate: [-180, -90, 0, 0, 0, 10, 30],
          }}
          transition={{
            duration: 4,
            delay: icon.delay,
            repeat: Infinity,
            repeatDelay: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
            times: [0, 0.15, 0.3, 0.5, 0.8, 0.9, 1],
          }}
          style={{
            position: "absolute",
            left: icon.position.left,
            top: icon.position.top,
          }}
        >
          <img
            src={icon.src}
            alt={icon.name}
            className="floating-icon-image"
            loading="lazy" // Lazy loading para iconos
            decoding="async" // Decodificación asíncrona
          />
          <div className="floating-icon-glow"></div>
        </motion.div>
      ))}
    </div>
  );
}

export default VectorAnimado;
