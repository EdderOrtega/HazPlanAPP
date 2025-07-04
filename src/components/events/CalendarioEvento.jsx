import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CalendarioEvento({
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
}) {
  // Fechas límite: desde ahora hasta 7 días en el futuro
  const ahora = new Date();
  const maxFecha = new Date();
  maxFecha.setDate(ahora.getDate() + 7); // Solo próximos 7 días

  // Función para sugerir duración automática (2 horas por defecto)
  const handleFechaInicioChange = (date) => {
    setFechaInicio(date ? date.toISOString() : "");

    // Si no hay fecha fin o la fecha fin es anterior, sugerir 2 horas después
    if (date && (!fechaFin || new Date(fechaFin) <= date)) {
      const fechaFinSugerida = new Date(date);
      fechaFinSugerida.setHours(fechaFinSugerida.getHours() + 2);
      setFechaFin(fechaFinSugerida.toISOString());
    }
  };

  return (
    <div>
      <div
        style={{
          background: "#e3f2fd",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid #2196f3",
        }}
      >
        <h4 style={{ color: "#1976d2", margin: "0 0 8px 0" }}>
          ⚡ Eventos Inmediatos
        </h4>
        <p style={{ color: "#424242", margin: "0", fontSize: "0.9rem" }}>
          Crea eventos para <strong>hoy o los próximos 7 días</strong>.
          ¡Perfecto para planes espontáneos y actividades cercanas!
        </p>
      </div>

      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <div style={{ minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#2c3e50",
            }}
          >
            📅 ¿Cuándo inicia?
          </label>
          <DatePicker
            selected={fechaInicio ? new Date(fechaInicio) : null}
            onChange={handleFechaInicioChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            minDate={ahora}
            maxDate={maxFecha}
            placeholderText="Hoy o próximos días"
            withPortal
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "2px solid #3498db",
              fontSize: "16px",
            }}
          />
          <small
            style={{
              color: "#666",
              fontSize: "0.8rem",
              display: "block",
              marginTop: "4px",
            }}
          >
            Desde ahora hasta {maxFecha.toLocaleDateString()}
          </small>
        </div>

        <div style={{ minWidth: "200px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "8px",
              fontWeight: "600",
              color: "#2c3e50",
            }}
          >
            ⏰ ¿Cuándo termina?
          </label>
          <DatePicker
            selected={fechaFin ? new Date(fechaFin) : null}
            onChange={(date) => setFechaFin(date ? date.toISOString() : "")}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="dd/MM/yyyy HH:mm"
            minDate={fechaInicio ? new Date(fechaInicio) : ahora}
            maxDate={maxFecha}
            placeholderText="Auto: 2h después"
            withPortal
            style={{
              padding: "10px",
              borderRadius: "6px",
              border: "2px solid #27ae60",
              fontSize: "16px",
            }}
          />
          <small
            style={{
              color: "#666",
              fontSize: "0.8rem",
              display: "block",
              marginTop: "4px",
            }}
          >
            Se sugiere 2h automáticamente
          </small>
        </div>
      </div>

      {/* Botones de duración rápida */}
      {fechaInicio && (
        <div style={{ marginTop: "16px" }}>
          <p
            style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#2c3e50" }}
          >
            ⚡ Duración rápida:
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { label: "1 hora", horas: 1 },
              { label: "2 horas", horas: 2 },
              { label: "3 horas", horas: 3 },
              { label: "Toda la tarde", horas: 4 },
            ].map(({ label, horas }) => (
              <button
                key={horas}
                type="button"
                onClick={() => {
                  const fechaFinRapida = new Date(fechaInicio);
                  fechaFinRapida.setHours(fechaFinRapida.getHours() + horas);
                  setFechaFin(fechaFinRapida.toISOString());
                }}
                style={{
                  padding: "6px 12px",
                  background: "#f8f9fa",
                  border: "1px solid #dee2e6",
                  borderRadius: "16px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "all 0.2s",
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#3498db";
                  e.target.style.color = "white";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "#f8f9fa";
                  e.target.style.color = "black";
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarioEvento;
