import { useState } from "react";
import capibara from "../../assets/capibaraMascota.png";
import vehiculo from "../../assets/capiCamion.png";
import "../../styles/modalEventoSorpresa.css";

function ModalEventoSorpresa({ isOpen, onClose, recorridoActivo = false }) {
  const [showDetails, setShowDetails] = useState(false);

  if (!isOpen) return null;

  // Texto dinámico basado en si el recorrido ya está activo
  const tituloModal = recorridoActivo
    ? "🚛 ¡Capicamión HazPlan en Movimiento!"
    : "🎉 ¡Atrapa el Camión HazPlan!";

  const mensajeTiempo = recorridoActivo
    ? "¡AHORA MISMO está en movimiento!"
    : "Hoy, entre 11:00 a.m. y 1:00 p.m.";

  const mensajeAccion = recorridoActivo
    ? "¡Síguelo en el mapa AHORA!"
    : "Sigue el ícono móvil en el mapa";

  return (
    <div className="modal-evento-sorpresa-overlay">
      <div className="modal-evento-sorpresa">
        {/* Header con animación */}
        <div className="modal-header">
          <div className="evento-icon">
            <img
              src={vehiculo}
              alt="Camión HazPlan"
              className="vehiculo-icon bounce"
            />
            <span className="sparkle">✨</span>
          </div>
          <h2 className="evento-titulo">{tituloModal}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Contenido principal */}
        <div className="modal-content">
          <div className="evento-info">
            <div className="info-item">
              <span className="icon">🗓️</span>
              <div>
                <strong>{mensajeTiempo}</strong>
              </div>
            </div>

            <div className="info-item">
              <span className="icon">📍</span>
              <div>
                Se moverá por <strong>distintos puntos sorpresa</strong> de la
                ciudad
              </div>
            </div>

            <div className="info-item highlight">
              <span className="icon">🎁</span>
              <div>
                Los primeros en llegar al vehículo y cumplir con la
                <strong> dinámica de la marca</strong> reciben:
              </div>
            </div>

            {/* Premios desplegables */}
            <div className="premios-section">
              <button
                className="premios-toggle"
                onClick={() => setShowDetails(!showDetails)}
              >
                🏆 Ver premios exclusivos {showDetails ? "▲" : "▼"}
              </button>

              {showDetails && (
                <div className="premios-list">
                  <div className="premio-item">🍕 Comida gratis</div>
                  <div className="premio-item">👥 Meet and greet</div>
                  <div className="premio-item">🎫 Boletos exclusivos</div>
                  <div className="premio-item">👕 Merch oficial</div>
                  <div className="premio-item">🎁 Y mucho más...</div>
                </div>
              )}
            </div>

            <div className="info-item action">
              <span className="icon">👉</span>
              <div>
                <strong>{mensajeAccion}</strong> y actúa rápido
              </div>
            </div>

            <div className="info-item special">
              <span className="icon">📸</span>
              <div>
                ¡Algunos encuentros serán <strong>grabados en vivo</strong> para
                redes!
              </div>
            </div>
          </div>

          {/* Mascota */}
          <div className="capibara-container">
            <img
              src={capibara}
              alt="Capibara Mascota"
              className="capibara-mascota"
            />
            <div className="speech-bubble">¡No te lo pierdas! 🚛💨</div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="modal-footer">
          <button className="btn-secundario" onClick={onClose}>
            Más tarde
          </button>
          <button className="btn-principal" onClick={onClose}>
            ¡Ir al mapa! 🗺️
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEventoSorpresa;
