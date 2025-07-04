import React, { useState, useCallback } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import "../styles/buttonAnimations.css";

const CapibaraRive = ({
  size = "medium",
  showControls = true,
  autoPlay = true,
  className = "",
  onAnimationChange,
}) => {
  const [currentAnimation, setCurrentAnimation] = useState("idle");

  // Configuración de Rive
  const { RiveComponent, rive } = useRive({
    src: "/src/assets/animations/capibara-morado.riv", // Archivo que crearemos
    stateMachines: "CapibaraStateMachine",
    autoplay: autoPlay,
    onLoad: () => {
      console.log("🦫 Capibara cargado correctamente!");
    },
    onLoadError: () => {
      console.log("⚠️ Error cargando capibara, usando fallback");
    },
  });

  // Inputs de la state machine (para controlar animaciones)
  const walkTrigger = useStateMachineInput(
    rive,
    "CapibaraStateMachine",
    "walk"
  );
  const talkTrigger = useStateMachineInput(
    rive,
    "CapibaraStateMachine",
    "talk"
  );
  const happyTrigger = useStateMachineInput(
    rive,
    "CapibaraStateMachine",
    "happy"
  );
  const waveTrigger = useStateMachineInput(
    rive,
    "CapibaraStateMachine",
    "wave"
  );

  // Funciones para controlar animaciones
  const handleWalk = useCallback(() => {
    if (walkTrigger) {
      walkTrigger.fire();
      setCurrentAnimation("walking");
      onAnimationChange && onAnimationChange("walking");
    }
  }, [walkTrigger, onAnimationChange]);

  const handleTalk = useCallback(() => {
    if (talkTrigger) {
      talkTrigger.fire();
      setCurrentAnimation("talking");
      onAnimationChange && onAnimationChange("talking");
    }
  }, [talkTrigger, onAnimationChange]);

  const handleHappy = useCallback(() => {
    if (happyTrigger) {
      happyTrigger.fire();
      setCurrentAnimation("happy");
      onAnimationChange && onAnimationChange("happy");
    }
  }, [happyTrigger, onAnimationChange]);

  const handleWave = useCallback(() => {
    if (waveTrigger) {
      waveTrigger.fire();
      setCurrentAnimation("waving");
      onAnimationChange && onAnimationChange("waving");
    }
  }, [waveTrigger, onAnimationChange]);

  const handleIdle = useCallback(() => {
    // Reset a idle (estado por defecto)
    setCurrentAnimation("idle");
    onAnimationChange && onAnimationChange("idle");
  }, [onAnimationChange]);

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "capibara-small";
      case "large":
        return "capibara-large";
      case "xl":
        return "capibara-xl";
      default:
        return "capibara-medium";
    }
  };

  return (
    <div className={`capibara-container ${getSizeClass()} ${className}`}>
      <div className="capibara-animation">
        {/* Componente Rive */}
        <RiveComponent className="capibara-rive" />

        {/* Fallback si no carga la animación */}
        <div className="capibara-fallback">
          <img
            src="/src/assets/capibaraMascota.png"
            alt="Capibara Mascota"
            className="capibara-fallback-image"
          />
          <div className="capibara-status">
            {currentAnimation === "talking" && (
              <div className="speech-bubble">¡Hola! 👋</div>
            )}
            {currentAnimation === "walking" && (
              <div className="action-indicator">🚶‍♂️ Caminando...</div>
            )}
            {currentAnimation === "happy" && (
              <div className="action-indicator">😄 ¡Feliz!</div>
            )}
          </div>
        </div>
      </div>

      {/* Controles de animación */}
      {showControls && (
        <div className="capibara-controls">
          <button
            onClick={handleTalk}
            className={`control-btn talk-btn ${
              currentAnimation === "talking" ? "active" : ""
            }`}
            title="Hacer hablar al capibara"
          >
            💬 Hablar
          </button>

          <button
            onClick={handleWalk}
            className={`control-btn walk-btn ${
              currentAnimation === "walking" ? "active" : ""
            }`}
            title="Hacer caminar al capibara"
          >
            🚶‍♂️ Caminar
          </button>

          <button
            onClick={handleHappy}
            className={`control-btn happy-btn ${
              currentAnimation === "happy" ? "active" : ""
            }`}
            title="Capibara feliz"
          >
            😄 Feliz
          </button>

          <button
            onClick={handleWave}
            className={`control-btn wave-btn ${
              currentAnimation === "waving" ? "active" : ""
            }`}
            title="Saludar"
          >
            👋 Saludar
          </button>

          <button
            onClick={handleIdle}
            className={`control-btn idle-btn ${
              currentAnimation === "idle" ? "active" : ""
            }`}
            title="Estado relajado"
          >
            😌 Relajado
          </button>
        </div>
      )}

      {/* Indicador del estado actual */}
      <div className="animation-status">
        Estado: <span className="current-animation">{currentAnimation}</span>
      </div>
    </div>
  );
};

export default CapibaraRive;
