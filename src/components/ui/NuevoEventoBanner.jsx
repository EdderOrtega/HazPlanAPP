import { useEffect, useState } from "react";
import "../../styles/promoBanner.css";

const NuevoEventoBanner = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    // 🔊 Reproducir sonido al aparecer
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch((err) => console.log("🔇 Sonido bloqueado", err));
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`promo-banner nuevo-evento-banner ${
        isAnimating ? "animate-in" : "animate-out"
      }`}
      style={{
        position: "fixed",
        top: 40,
        left: 0,
        right: 0,
        margin: "0 auto",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
      onClick={handleClose}
    >
      <div className="promo-banner-content">
        <div className="promo-icon" style={{ fontSize: 40 }}>
          🎉
        </div>
        <div className="promo-text">
          <h4>¡Nuevo evento creado!</h4>
        </div>
        {/* 🎊 Confetti */}
        <div className="confetti-container">
          {[...Array(24)].map((_, i) => (
            <span key={i} className={`confetti confetti-${i % 6}`}></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NuevoEventoBanner;
