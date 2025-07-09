import React from "react";
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

  // Helpers para separar fecha y hora
  const getDatePart = (iso) => (iso ? new Date(iso) : null);
  const getTimePart = (iso) => {
    if (!iso) return null;
    const d = new Date(iso);
    return new Date(1970, 0, 1, d.getHours(), d.getMinutes());
  };

  // Estados locales para inputs separados
  const [fechaInicioDate, setFechaInicioDate] = React.useState(
    getDatePart(fechaInicio)
  );
  const [horaInicio, setHoraInicio] = React.useState(getTimePart(fechaInicio));
  const [fechaFinDate, setFechaFinDate] = React.useState(getDatePart(fechaFin));
  const [horaFin, setHoraFin] = React.useState(getTimePart(fechaFin));

  // Actualiza el ISO combinado cuando cambia fecha u hora
  React.useEffect(() => {
    if (fechaInicioDate && horaInicio) {
      const d = new Date(fechaInicioDate);
      d.setHours(horaInicio.getHours(), horaInicio.getMinutes(), 0, 0);
      setFechaInicio(d.toISOString());
    }
  }, [fechaInicioDate, horaInicio]);

  React.useEffect(() => {
    if (fechaFinDate && horaFin) {
      const d = new Date(fechaFinDate);
      d.setHours(horaFin.getHours(), horaFin.getMinutes(), 0, 0);
      setFechaFin(d.toISOString());
    }
  }, [fechaFinDate, horaFin]);

  // Sugerir fin automático al cambiar inicio
  React.useEffect(() => {
    if (fechaInicioDate && horaInicio && (!fechaFinDate || !horaFin)) {
      const d = new Date(fechaInicioDate);
      d.setHours(horaInicio.getHours() + 2, horaInicio.getMinutes(), 0, 0);
      setFechaFinDate(new Date(d));
      setHoraFin(new Date(1970, 0, 1, d.getHours(), d.getMinutes()));
    }
  }, [fechaInicioDate, horaInicio]);

  return (
    <div>
      <div
        style={{
          background: "#e3f2fd",
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "15px",
          border: "1px solid #2196f3",
        }}
      >
        <h4 style={{ color: "#1976d2", margin: "0 0 5px 0", fontSize: "14px" }}>
          ⚡ Eventos Inmediatos
        </h4>
        <p style={{ color: "#424242", margin: "0", fontSize: "12px" }}>
          Crea eventos para <strong>hoy o los próximos 7 días</strong>.
        </p>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-end",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {/* Fecha de inicio */}
        <div style={{ minWidth: "140px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: "14px",
            }}
          >
            📅 Día inicio
          </label>
          <DatePicker
            selected={fechaInicioDate}
            onChange={setFechaInicioDate}
            minDate={ahora}
            maxDate={maxFecha}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona día"
            withPortal
            showTimeSelect={false}
          />
        </div>
        {/* Hora de inicio */}
        <div style={{ minWidth: "120px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: "14px",
            }}
          >
            🕒 Hora inicio
          </label>
          <DatePicker
            selected={horaInicio}
            onChange={setHoraInicio}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Hora"
            dateFormat="HH:mm"
            placeholderText="Hora"
            withPortal
          />
        </div>
        {/* Fecha de fin */}
        <div style={{ minWidth: "140px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: "14px",
            }}
          >
            📅 Día fin
          </label>
          <DatePicker
            selected={fechaFinDate}
            onChange={setFechaFinDate}
            minDate={fechaInicioDate || ahora}
            maxDate={maxFecha}
            dateFormat="dd/MM/yyyy"
            placeholderText="Selecciona día"
            withPortal
            showTimeSelect={false}
          />
        </div>
        {/* Hora de fin */}
        <div style={{ minWidth: "120px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "6px",
              fontWeight: 600,
              color: "#2c3e50",
              fontSize: "14px",
            }}
          >
            🕒 Hora fin
          </label>
          <DatePicker
            selected={horaFin}
            onChange={setHoraFin}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Hora"
            dateFormat="HH:mm"
            placeholderText="Hora"
            withPortal
          />
        </div>
      </div>
    </div>
  );
}

export default CalendarioEvento;
