import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CalendarioEvento({
  fechaInicio,
  setFechaInicio,
  fechaFin,
  setFechaFin,
}) {
  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
      <div>
        <label>📅 Fecha y hora de inicio:</label>
        <DatePicker
          selected={fechaInicio ? new Date(fechaInicio) : null}
          onChange={(date) => setFechaInicio(date ? date.toISOString() : "")}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
          minDate={new Date()}
          placeholderText="Selecciona inicio"
          withPortal
        />
      </div>
      <div>
        <label>📅 Fecha y hora de fin:</label>
        <DatePicker
          selected={fechaFin ? new Date(fechaFin) : null}
          onChange={(date) => setFechaFin(date ? date.toISOString() : "")}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
          minDate={fechaInicio ? new Date(fechaInicio) : new Date()}
          placeholderText="Selecciona fin"
          withPortal
        />
      </div>
    </div>
  );
}

export default CalendarioEvento;
