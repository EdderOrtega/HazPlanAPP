import { useEffect, useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import vehiculoIcono from "../assets/capiCamion.png";
import { formatTime } from "../utils/mapUtils";

function VehiculoMarker({ position, rutaInfo, progreso, tiempoRestante }) {
  const map = useMap();
  const [iconSize, setIconSize] = useState(64);

  useEffect(() => {
    const onZoom = () => {
      const zoom = map.getZoom();
      const size = Math.max(32, Math.min(zoom * 10, 200));
      setIconSize(size);
    };
    map.on("zoom", onZoom);
    onZoom();
    return () => map.off("zoom", onZoom);
  }, [map]);

  const vehiculoIcon = new L.Icon({
    iconUrl: vehiculoIcono,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
  });

  return (
    <Marker position={position} icon={vehiculoIcon}>
      <Popup>
        <div style={{ minWidth: "180px" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#2196F3" }}>
            Capicamión HazPlan
          </h4>
          <p style={{ margin: "4px 0", fontSize: "13px" }}>
            <strong>Ruta:</strong> {rutaInfo.nombre}
          </p>
          <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
            {rutaInfo.descripcion}
          </p>

          {progreso >= 100 && tiempoRestante ? (
            <div
              style={{
                backgroundColor: "#e8f5e8",
                borderRadius: "8px",
                padding: "8px",
                margin: "8px 0",
                border: "1px solid #4CAF50",
              }}
            >
              <p
                style={{
                  margin: "0 0 4px 0",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: "#2e7d32",
                  textAlign: "center",
                }}
              >
                ¡Destino alcanzado!
              </p>
              <p
                style={{
                  margin: "0",
                  fontSize: "11px",
                  color: "#555",
                  textAlign: "center",
                }}
              >
                Desaparece en: {formatTime(tiempoRestante)}
              </p>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#f0f0f0",
                borderRadius: "10px",
                padding: "4px 8px",
                margin: "8px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: "#4CAF50",
                  height: "6px",
                  borderRadius: "3px",
                  width: `${progreso}%`,
                  transition: "width 0.3s ease",
                }}
              ></div>
            </div>
          )}

          {progreso < 100 && (
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "11px",
                textAlign: "center",
                color: "#888",
              }}
            >
              Progreso: {Math.round(progreso)}%
            </p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export default VehiculoMarker;
