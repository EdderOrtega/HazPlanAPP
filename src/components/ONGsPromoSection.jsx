import React, { useRef, useEffect, useState } from "react";
import videoONG from "/public/videos/HazPlanONG.mp4";
import videoSorpresa from "/public/videos/HazPlanEventoSorpresa.mp4";
// import LazyVideo from "./ui/LazyVideo";

const ONGS = [
  {
    nombre: "ONG Aliadas de HazPlan",
    video: videoONG,
    aliada: true,
  },
  {
    nombre: "Eventos Sorpresas de HazPlan",
    video: videoSorpresa,
    aliada: true,
  },
];

export default function ONGsPromoSection() {
  const videoRefs = useRef([]);
  const containerRefs = useRef([]);
  const [showReplay, setShowReplay] = useState(Array(ONGS.length).fill(false)); // para forzar re-render

  useEffect(() => {
    const observers = ONGS.map((_, idx) => {
      const container = containerRefs.current[idx];
      const video = videoRefs.current[idx];

      if (!container || !video) return null;

      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (idx === 0) {
              video.muted = false;
              video.play().catch((err) => {
                console.warn("Autoplay con sonido bloqueado:", err);
              });
            } else {
              video.muted = true;
              video.play();
            }
          } else {
            video.pause();
            video.muted = true;
          }
        },
        { threshold: 0.5 }
      );
    });

    observers.forEach((observer, idx) => {
      const container = containerRefs.current[idx];
      if (observer && container) observer.observe(container);
    });

    return () => {
      observers.forEach((observer, idx) => {
        const container = containerRefs.current[idx];
        if (observer && container) observer.disconnect();
      });
    };
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
          }
          button:hover {
            background: rgba(176, 132, 247, 0.4) !important;
            border-color: #D1B3FF !important;
          }
        `}
      </style>

      <section
        style={{
          display: "flex",
          gap: 32,
          flexWrap: "wrap",
          justifyContent: "center",
          padding: 24,
        }}
      >
        {ONGS.map((ong, idx) => (
          <div
            key={idx}
            ref={(el) => (containerRefs.current[idx] = el)}
            style={{
              background:
                "linear-gradient(106deg, rgba(101,63,166,1) 0%, rgba(60,6,77,1) 98%)",
              borderRadius: 24,
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              padding: 24,
              maxWidth: 380,
              position: "relative",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.1)",
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
              playsInline
              style={{
                width: "100%",
                borderRadius: 16,
                background: "#222",
              }}
              onTimeUpdate={(e) => {
                const progress =
                  (e.target.currentTime / e.target.duration) * 100;
                const progressBar = document.getElementById(`progress-${idx}`);
                if (progressBar) progressBar.value = progress;
              }}
            />

            {/* Controles custom */}
            {/* Controles custom */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              {/* Play/Pause */}
              <button
                onClick={() => {
                  const video = videoRefs.current[idx];
                  if (video.paused) {
                    video.play();
                  } else {
                    video.pause();
                  }
                  setShowReplay([...showReplay]); // forzar re-render
                }}
                style={{
                  padding: "8px",
                  width: 50,
                  height: 90,
                  fontSize: 18,
                  color: "#fff",
                  background:
                    videoRefs.current[idx] && !videoRefs.current[idx].paused
                      ? "rgba(176, 132, 247, 0.3)"
                      : "rgba(0, 0, 0, 0.3)",
                  border: "2px solid #B084F7",
                  borderRadius: 12,
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  transition: "background 0.3s ease, color 0.3s ease",
                  animation:
                    videoRefs.current[idx] && !videoRefs.current[idx].paused
                      ? "pulse 1.5s infinite"
                      : "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>▶</span>
                <span>/</span>
                <span>⏸</span>
              </button>

              {/* Progress bar */}
              <input
                id={`progress-${idx}`}
                type="range"
                min="0"
                max="100"
                defaultValue="0"
                style={{
                  flex: 1,
                  accentColor: "#B084F7",
                  borderRadius: 6,
                  height: 6,
                  background: "rgba(255,255,255,0.2)",
                }}
                onChange={(e) => {
                  const video = videoRefs.current[idx];
                  const seekTime = (e.target.value / 100) * video.duration;
                  video.currentTime = seekTime;
                }}
              />

              {/* Mute/Unmute */}
              <button
                onClick={() => {
                  const video = videoRefs.current[idx];
                  video.muted = !video.muted;
                  setShowReplay([...showReplay]); // forzar re-render
                }}
                style={{
                  padding: "8px",
                  width: 50,
                  height: 90,
                  fontSize: 18,
                  color: "#fff",
                  background:
                    videoRefs.current[idx] && !videoRefs.current[idx].muted
                      ? "rgba(176, 132, 247, 0.3)"
                      : "rgba(0, 0, 0, 0.3)",
                  border: "2px solid #B084F7",
                  borderRadius: 12,
                  cursor: "pointer",
                  backdropFilter: "blur(4px)",
                  transition: "background 0.3s ease, color 0.3s ease",
                  animation:
                    videoRefs.current[idx] && !videoRefs.current[idx].muted
                      ? "pulse 1.5s infinite"
                      : "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span>🔊</span>
                <span>/</span>
                <span>🔇</span>
              </button>
            </div>

            <div
              style={{
                marginTop: 18,
                color: "#f0e4fefa",
                background: "#411773fa",
                borderRadius: 8,
                padding: "6px 18px",
                fontWeight: 600,
                fontSize: 14,
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              ¡Espéralos pronto!
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
