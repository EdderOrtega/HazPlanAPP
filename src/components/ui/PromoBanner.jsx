import { useState, useEffect } from "react";
import "../../styles/promoBanner.css";

const PromoBanner = ({ onShowComingSoon, user }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Mostrar banner después de 10 segundos, luego cada 2 minutos
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
      setIsAnimating(true);
    }, 10000);

    const intervalTimer = setInterval(() => {
      if (!isVisible) {
        setIsVisible(true);
        setIsAnimating(true);
      }
    }, 120000); // Cada 2 minutos

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [user, isVisible]);

  useEffect(() => {
    if (isVisible) {
      // Auto-ocultar después de 8 segundos
      const hideTimer = setTimeout(() => {
        handleClose();
      }, 8000);

      return () => clearTimeout(hideTimer);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleClick = () => {
    onShowComingSoon();
    handleClose();
  };

  if (!isVisible || !user) return null;

  return (
    <div
      className={`promo-banner ${isAnimating ? "animate-in" : "animate-out"}`}
    >
      <div className="promo-banner-content">
        <div className="promo-icon">🚀</div>
        <div className="promo-text">
          <h4>¡Próximamente en más ciudades!</h4>
          <p>Descubre lo que viene</p>
        </div>
        <button className="promo-action" onClick={handleClick}>
          Ver trailer
        </button>
        <button className="promo-close" onClick={handleClose}>
          ✕
        </button>
      </div>
      <div className="promo-progress"></div>
    </div>
  );
};

export default PromoBanner;
