import { useState } from "react";
import capibara from "../../assets/capibaraMascota.png";
import vehiculo from "../../assets/capiCamion.png";

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

  const modalStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.7)",
      backdropFilter: "blur(5px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    },
    modal: {
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      borderRadius: "20px",
      width: "90%",
      maxWidth: "450px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
      position: "relative",
      color: "white",
    },
    header: {
      position: "relative",
      textAlign: "center",
      padding: "25px 20px 15px",
      background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
      borderRadius: "20px 20px 0 0",
    },
    closeBtn: {
      position: "absolute",
      top: "15px",
      right: "15px",
      background: "rgba(255, 255, 255, 0.2)",
      border: "none",
      color: "white",
      fontSize: "28px",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    vehicleIcon: {
      width: "150px",
      height: "150px",
      filter: "drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3))",
      animation: "truckBounce 2s ease-in-out infinite",
    },
    title: {
      margin: 0,
      fontSize: "24px",
      fontWeight: "bold",
      textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
      lineHeight: "1.2",
    },
    content: {
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    infoItem: {
      display: "flex",
      alignItems: "flex-start",
      gap: "12px",
      padding: "12px",
      background: "rgba(255, 255, 255, 0.1)",
      borderRadius: "12px",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      fontSize: "14px",
      lineHeight: "1.4",
    },
    highlightItem: {
      background: "rgba(255, 215, 0, 0.2)",
      border: "1px solid rgba(255, 215, 0, 0.3)",
    },
    actionItem: {
      background: "rgba(76, 175, 80, 0.2)",
      border: "1px solid rgba(76, 175, 80, 0.3)",
    },
    specialItem: {
      background: "rgba(233, 30, 99, 0.2)",
      border: "1px solid rgba(233, 30, 99, 0.3)",
    },
  };

  return (
    <div style={modalStyles.overlay}>
      <style>
        {`
          @keyframes floatCapibara {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-10px);
            }
          }
          
          @keyframes bubbleFloat {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-5px) scale(1.02);
            }
          }
          
          @keyframes truckBounce {
            0%, 100% {
              transform: translateY(0px) rotate(0deg) scale(1);
            }
            25% {
              transform: translateY(-8px) rotate(-2deg) scale(1.05);
            }
            50% {
              transform: translateY(-15px) rotate(0deg) scale(1.1);
            }
            75% {
              transform: translateY(-8px) rotate(2deg) scale(1.05);
            }
          }
          
          @keyframes sparkle {
            0%, 100% {
              opacity: 0.7;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `}
      </style>
      <div style={modalStyles.modal}>
        {/* Header */}
        <div style={modalStyles.header}>
          <div style={{ marginBottom: "15px", position: "relative" }}>
            <img
              src={vehiculo}
              alt="Camión HazPlan"
              style={modalStyles.vehicleIcon}
            />
            <span
              style={{
                position: "absolute",
                top: "10px",
                right: "30px",
                fontSize: "20px",
                animation: "sparkle 1.5s ease-in-out infinite",
                animationDelay: "0.8s",
              }}
            >
              ✨
            </span>
            <span
              style={{
                position: "absolute",
                top: "30px",
                left: "20px",
                fontSize: "16px",
                animation: "sparkle 1.8s ease-in-out infinite",
                animationDelay: "0.3s",
              }}
            >
              ⭐
            </span>
            <span
              style={{
                position: "absolute",
                bottom: "10px",
                right: "20px",
                fontSize: "18px",
                animation: "sparkle 2s ease-in-out infinite",
                animationDelay: "1.2s",
              }}
            >
              💫
            </span>
          </div>
          <h2 style={modalStyles.title}>{tituloModal}</h2>
          <button style={modalStyles.closeBtn} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Contenido */}
        <div style={modalStyles.content}>
          {/* Información básica */}
          <div style={{ ...modalStyles.infoItem }}>
            <span style={{ fontSize: "18px", minWidth: "20px" }}>🗓️</span>
            <div>
              <strong>{mensajeTiempo}</strong>
            </div>
          </div>

          <div style={{ ...modalStyles.infoItem }}>
            <span style={{ fontSize: "18px", minWidth: "20px" }}>📍</span>
            <div>
              Se moverá por <strong>distintos puntos sorpresa</strong> de la
              ciudad
            </div>
          </div>

          <div
            style={{ ...modalStyles.infoItem, ...modalStyles.highlightItem }}
          >
            <span style={{ fontSize: "18px", minWidth: "20px" }}>🎁</span>
            <div>
              Los primeros en llegar al vehículo y cumplir con la{" "}
              <strong>dinámica de la marca</strong> reciben:
            </div>
          </div>

          {/* Premios desplegables */}
          <div>
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.15)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                color: "white",
                padding: "12px",
                borderRadius: "10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              🏆 Ver premios exclusivos {showDetails ? "▲" : "▼"}
            </button>

            {showDetails && (
              <div style={{ marginTop: "10px", display: "grid", gap: "8px" }}>
                {[
                  "🍕 Comida gratis",
                  "👥 Meet and greet",
                  "🎫 Boletos exclusivos",
                  "👕 Merch oficial",
                  "🎁 Y mucho más...",
                ].map((premio, index) => (
                  <div
                    key={index}
                    style={{
                      background: "rgba(255, 215, 0, 0.2)",
                      padding: "10px 15px",
                      borderRadius: "8px",
                      borderLeft: "4px solid #ffd700",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    {premio}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ ...modalStyles.infoItem, ...modalStyles.actionItem }}>
            <span style={{ fontSize: "18px", minWidth: "20px" }}>👉</span>
            <div>
              <strong>{mensajeAccion}</strong> y actúa rápido
            </div>
          </div>

          <div style={{ ...modalStyles.infoItem, ...modalStyles.specialItem }}>
            <span style={{ fontSize: "18px", minWidth: "20px" }}>📸</span>
            <div>
              ¡Algunos encuentros serán <strong>grabados en vivo</strong> para
              redes!
            </div>
          </div>

          {/* Capibara */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              marginTop: "20px",
              position: "relative",
            }}
          >
            <img
              src={capibara}
              alt="Capibara"
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: "3px solid rgba(255, 255, 255, 0.3)",
                marginBottom: "10px",
                animation: "floatCapibara 3s ease-in-out infinite",
              }}
            />
            <div
              style={{
                background: "white",
                color: "#333",
                padding: "8px 12px",
                borderRadius: "15px",
                fontSize: "12px",
                fontWeight: "bold",
                display: "inline-block",
                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                position: "relative",
                animation: "bubbleFloat 2s ease-in-out infinite",
                animationDelay: "0.5s",
              }}
            >
              ¡No te lo pierdas! 🚛💨
              {/* Flecha del globo de diálogo */}
              <div
                style={{
                  content: '""',
                  position: "absolute",
                  top: "-8px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "8px solid transparent",
                  borderRight: "8px solid transparent",
                  borderBottom: "8px solid white",
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px",
            display: "flex",
            gap: "15px",
            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "white",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            Más tarde
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 2,
              padding: "12px",
              background: "linear-gradient(135deg, #4caf50 0%, #45a049 100%)",
              border: "none",
              color: "white",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
              boxShadow: "0 5px 15px rgba(76, 175, 80, 0.4)",
            }}
          >
            ¡Ir al mapa! 🗺️
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalEventoSorpresa;
