import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../styles/eventoCard.css"; // Asegúrate de tener este CSS
function EventoCard({ evento, user }) {
  const [participando, setParticipando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario ya participa
    if (user) {
      const checkParticipacion = async () => {
        const { data } = await supabase
          .from("participantes_eventos")
          .select("*")
          .eq("evento_id", evento.id)
          .eq("user_id", user.id)
          .single();

        setParticipando(!!data);
      };

      checkParticipacion();
    }
  }, [evento.id, user]);

  const participarEvento = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setCargando(true);

    const { error } = await supabase
      .from("participantes_eventos")
      .insert({ evento_id: evento.id, user_id: user.id });

    if (!error) {
      setParticipando(true);
      navigate(`/evento/${evento.id}`); // Redirige al detalle del evento
    }

    setCargando(false);
  };

  const irAlEvento = () => {
    navigate(`/evento/${evento.id}`);
  };

  return (
    <div className="evento-card">
      <h3>{evento.nombre}</h3>
      <p>
        <strong>Descripción:</strong> {evento.descripcion}
      </p>
      <p>
        <strong>Ubicación:</strong> {evento.ubicacion}
      </p>
      <p>
        <strong>Fecha y hora de inicio:</strong>{" "}
        {evento.fecha
          ? new Date(evento.fecha).toLocaleString()
          : "No especificada"}
      </p>
      <p>
        <strong>Hora de finalización:</strong>{" "}
        {evento.fecha_fin
          ? new Date(evento.fecha_fin).toLocaleString()
          : "No especificada"}
      </p>
      <p>
        <strong>Tipo:</strong> {evento.tipo}
      </p>
      <p>
        <strong>Cupo:</strong> {evento.cupo}
      </p>
      <p>
        <strong>Frase clave:</strong> {evento.descripcion || "No especificada"}
      </p>

      {participando ? (
        <button onClick={irAlEvento} className="btn-primary">
          Ver evento
        </button>
      ) : (
        <button
          onClick={participarEvento}
          disabled={cargando}
          className="btn-secondary"
        >
          {cargando ? "Procesando..." : "Participar"}
        </button>
      )}
    </div>
  );
}

export default EventoCard;
