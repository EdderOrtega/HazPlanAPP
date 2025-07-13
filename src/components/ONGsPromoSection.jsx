import React, { useRef, useState } from "react";
import videoEjemplo from "/public/videos/HazPlanCiudades.mp4";
import { FaBottleDroplet } from "react-icons/fa6";

const ONGS = [
  {
    nombre: "ONG Capibara Verde",
    video: videoEjemplo,
    aliada: true,
  },
  {
    nombre: "Fundación HazPlan",
    video: videoEjemplo,
    aliada: true,
  },
  {
    nombre: "EcoAliados",
    video: videoEjemplo,
    aliada: true,
  },
  {
    nombre: "Rescate Animal",
    video: videoEjemplo,
    aliada: true,
  },
];

export default function ONGsPromoSection() {
  const videoRefs = useRef([]);
  const [showReplay, setShowReplay] = useState(Array(ONGS.length).fill(false));

  const handleVideoEnded = (idx) => {
    const updatedShowReplay = [...showReplay];
    updatedShowReplay[idx] = true;
    setShowReplay(updatedShowReplay);
  };

  const handleReplay = (idx) => {
    if (videoRefs.current[idx]) {
      videoRefs.current[idx].currentTime = 0;
      videoRefs.current[idx].play();
      const updatedShowReplay = [...showReplay];
      updatedShowReplay[idx] = false;
      setShowReplay(updatedShowReplay);
    }
  };

  return (
    <section
      style={{
        width: "100%",
        background: "azure", // semi transparente para resaltar
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 24,
        marginBottom: 48,
      }}
    >
      <h2
        style={{
          color: "blueviolet ",
          fontWeight: 800,
          fontSize: 36,
          marginBottom: 48,
          textAlign: "center",
        }}
      >
        ONGs Aliadas
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          background: " #653fa6", // semi transparente para resaltar
          width: "100%",
          maxWidth: 420,
          margin: "0 auto",
          overflowY: "auto",
          height: "80vh",
          alignItems: "center",
        }}
      >
        {ONGS.map((ong, idx) => (
          <div
            key={idx}
            style={{
              background:
                "background: linear-gradient(106deg,rgba(101, 63, 166, 1) 0%, rgba(60, 6, 77, 1) 98%);", // semi transparente para resaltar
              borderRadius: 24,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.25)",
              padding: 24,
              paddingRight: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
              maxWidth: 380,
              position: "relative",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.03)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <div
              style={{
                fontWeight: 700,
                fontSize: 22,
                color: "#ffffff",
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {ong.nombre}
            </div>
            <video
              ref={(el) => (videoRefs.current[idx] = el)}
              src={ong.video}
              autoPlay
              muted
              playsInline
              onEnded={() => handleVideoEnded(idx)}
              style={{
                width: "100%",
                height: 400,
                borderRadius: 16,
                objectFit: "cover",
                background: "#222",
              }}
            />
            {showReplay[idx] && (
              <button
                onClick={() => handleReplay(idx)}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  padding: "10px 20px",
                  fontSize: 16,
                  color: "#fff",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "2px solid #B084F7", // morado pastel
                  borderRadius: 12,
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  transition: "background 0.3s ease, color 0.3s ease",
                }}
              >
                Ver de nuevo
              </button>
            )}
            <div
              style={{
                marginTop: 18,
                color: "#f0e4fefa", // dorado suave
                background: "#411773fa",
                borderRadius: 8,
                padding: "6px 18px",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              ONG Aliada
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
