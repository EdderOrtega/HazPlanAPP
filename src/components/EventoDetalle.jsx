// Crear nuevo archivo EventoDetalle.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ListaParticipantes from "./ListaParticipantes";
import ChatGrupal from "./ChatGrupal";
import "../styles/eventosDetalle.css";
import Loader from "./ui/Loader";
function EventoDetalle() {
  const [evento, setEvento] = useState(null);
  const [creador, setCreador] = useState(null);
  const [seccionActiva, setSeccionActiva] = useState("detalles");
  const [cargando, setCargando] = useState(true);
  const { eventoId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvento = async () => {
      setCargando(true);

      // Obtener evento
      const { data: eventoData, error: eventoError } = await supabase
        .from("eventos")
        .select("*")
        .eq("id", eventoId)
        .single();

      if (eventoError || !eventoData) {
        navigate("/mapa");
        return;
      }

      setEvento(eventoData);

      // Obtener datos del creador
      if (eventoData.user_id) {
        const { data: userData } = await supabase
          .from("usuariosRegistrados")
          .select("*")
          .eq("user_id", eventoData.user_id)
          .single();

        setCreador(userData);
      }

      setCargando(false);
    };

    fetchEvento();
  }, [eventoId, navigate]);

  if (cargando) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          paddingTop: "60px",
          background: "#593c8f",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="evento-detalle">
      <h2>{evento.nombre}</h2>

      <div className="evento-navegacion">
        <button
          className={seccionActiva === "detalles" ? "activo" : ""}
          onClick={() => setSeccionActiva("detalles")}
        >
          Detalles
        </button>
        <button
          className={seccionActiva === "participantes" ? "activo" : ""}
          onClick={() => setSeccionActiva("participantes")}
        >
          Participantes
        </button>
        <button
          className={seccionActiva === "chat" ? "activo" : ""}
          onClick={() => setSeccionActiva("chat")}
        >
          Chat
        </button>
      </div>

      <div className="evento-contenido">
        {seccionActiva === "detalles" && (
          <div className="evento-detalles">
            <p>
              <strong>Descripción:</strong>{" "}
              {evento.descripcion || "Sin descripción disponible"}
            </p>
            <p>
              <strong>Ubicación:</strong>{" "}
              {evento.ubicacion || "Ubicación no especificada"}
            </p>
            <p>
              <strong>Fecha:</strong>{" "}
              {new Date(evento.fecha).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <p>
              <strong>Tipo:</strong> {evento.tipo || "Sin categoría"}
            </p>

            {creador && (
              <div className="evento-creador">
                <h4>Organizado por:</h4>
                <p>{creador.nombre || "Usuario"}</p>
              </div>
            )}
          </div>
        )}

        {seccionActiva === "participantes" && (
          <ListaParticipantes eventoId={evento.id} />
        )}

        {seccionActiva === "chat" && <ChatGrupal eventoId={evento.id} />}
      </div>
    </div>
  );
}

export default EventoDetalle;
