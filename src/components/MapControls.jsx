import { mapConfig } from "../data/mapData";

function MapControls({
  user,

  vehiculosIdsAutorizados = mapConfig.vehiculosIdsAutorizados,
  recorridoActivo,
  rutaSeleccionada,
  onRecargarEventos,
  onIniciarRecorrido,
  onDetenerRecorrido,
  eventosFiltrados = [],
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "20px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <button
        onClick={onRecargarEventos}
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
        }}
      >
        Recargar eventos
      </button>

      <h3>Eventos inmediatos y cercanos ({eventosFiltrados.length})</h3>

      {user && vehiculosIdsAutorizados.includes(user.id) && (
        <div style={{ marginBottom: "10px" }}>
          <h4>Activar Capicamión:</h4>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => onIniciarRecorrido("ruta1")}
              style={{
                backgroundColor:
                  recorridoActivo && rutaSeleccionada === "ruta1"
                    ? "#4CAF50"
                    : "#008CBA",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Universidad → Macroplaza
            </button>
            <button
              onClick={() => onIniciarRecorrido("ruta2")}
              style={{
                backgroundColor:
                  recorridoActivo && rutaSeleccionada === "ruta2"
                    ? "#4CAF50"
                    : "#008CBA",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Aeropuerto → UANL
            </button>
            <button
              onClick={() => onIniciarRecorrido("ruta3")}
              style={{
                backgroundColor:
                  recorridoActivo && rutaSeleccionada === "ruta3"
                    ? "#4CAF50"
                    : "#008CBA",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Tec → Valle Oriente
            </button>
            {recorridoActivo && (
              <button
                onClick={onDetenerRecorrido}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Detener
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapControls;
