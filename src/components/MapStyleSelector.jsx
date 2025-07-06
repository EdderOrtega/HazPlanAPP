import { mapStyles } from "../data/mapData";

function MapStyleSelector({ currentStyle, onStyleChange }) {
  return (
    <div
      style={{
        marginBottom: "15px",
        display: "flex",
        justifyContent: "center",
        gap: "10px",
      }}
    >
      <button
        onClick={() => onStyleChange("openstreetmap")}
        style={{
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor:
            currentStyle === "openstreetmap" ? "#593c8f" : "rgb(240, 215, 255)",
          color:
            currentStyle === "openstreetmap" ? "white" : "rgb(240, 215, 255)",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        🗺️ Mapa Estándar
      </button>

      <button
        onClick={() => onStyleChange("esri_satellite")}
        style={{
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          backgroundColor:
            currentStyle === "esri_satellite"
              ? "#593c8f"
              : "rgb(240, 215, 255)",
          color:
            currentStyle === "esri_satellite" ? "white" : "rgb(240, 215, 255)",
          fontSize: "14px",
          fontWeight: "500",
          cursor: "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        🛰️ Vista Satelital
      </button>
    </div>
  );
}

export default MapStyleSelector;
