function EventoCard({ evento }) {
  return (
    <div>
      <h3>{evento.nombreEvento}</h3>
      <p>
        <b>Usuario:</b> {evento.usuario}
      </p>
      <p>
        <b>Ubicación:</b> {evento.ubicacion}
      </p>
      <p>
        <b>Fecha y hora:</b> {evento.fechaHora}
      </p>
      <p>
        <b>Tipo:</b> {evento.tipo}
      </p>
      <p>
        <b>Cupo:</b> {evento.cupo}
      </p>
      <p>
        <b>Invitación:</b> {evento.frase}
      </p>
      <img
        src={evento.imagen}
        alt={evento.nombreEvento}
        style={{ width: "100px" }}
      />
      <button>Unirse al evento</button>
    </div>
  );
}
export default EventoCard;
