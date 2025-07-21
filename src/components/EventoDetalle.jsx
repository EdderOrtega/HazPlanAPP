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
          background:
            "linear-gradient(135deg, #e3d8f8 0%, #f0ebff 50%, #e8deff 100%)",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`evento-detalle nuevo-estilo-evento-detalle fondo-perfil-usuario fondo-categoria-${
        evento.tipo ? evento.tipo.toLowerCase().replace(/\s/g, "-") : "default"
      }`}
    >
      <h2
        className="evento-titulo anim-fadein evento-titulo-borde"
        style={{ marginTop: "100px" }}
      >
        {evento.nombre}
      </h2>

      <div className="evento-navegacion-tabs anim-fadein-delay">
        <button
          className={
            (seccionActiva === "detalles" ? "tab-activo " : "") +
            "evento-tab-borde"
          }
          onClick={() => setSeccionActiva("detalles")}
        >
          <span role="img" aria-label="info">
            ℹ️
          </span>{" "}
          Detalles
        </button>
        <button
          className={
            (seccionActiva === "participantes" ? "tab-activo " : "") +
            "evento-tab-borde"
          }
          onClick={() => setSeccionActiva("participantes")}
        >
          <span role="img" aria-label="personas">
            👥
          </span>{" "}
          Participantes
        </button>
        <button
          className={
            (seccionActiva === "chat" ? "tab-activo " : "") + "evento-tab-borde"
          }
          onClick={() => setSeccionActiva("chat")}
        >
          <span role="img" aria-label="chat">
            💬
          </span>{" "}
          Chat
        </button>
      </div>

      <div className="evento-contenido">
        {seccionActiva === "detalles" && (
          <div className="evento-detalles-card anim-slidein">
            <div
              className="evento-detalles-header"
              style={{ display: "flex", flexDirection: "column", gap: 6 }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span
                  className={`evento-tipo-badge evento-tipo-badge-${
                    evento.tipo
                      ? evento.tipo.toLowerCase().replace(/\s/g, "-")
                      : "default"
                  }`}
                >
                  {evento.tipo || "Sin categoría"}
                </span>
                {/* Mostrar la categoría visual (la que determina el ícono en el mapa) */}
                {evento.categoria && (
                  <span
                    className={`evento-tipo-badge evento-tipo-badge-${evento.categoria
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                    style={{
                      background: (() => {
                        // Colores del filtro
                        const colores = {
                          mascotas: "#f39c12",
                          reforestacion: "#2ecc71",
                          arte: "#e67e22",
                          fandom: "#9b59b6",
                          ayuda_ongs: "#1e88e5",
                          ayuda_ciudadana: "#ab47bc",
                          salud: "#e74c3c",
                          club: "#3498db",
                          juegos: "#1abc9c",
                          actividad: "#27ae60",
                        };
                        const key = evento.categoria.toLowerCase();
                        return colores[key] || "#667eea";
                      })(),
                      color: "#fff",
                      fontWeight: 700,
                      marginLeft: 0,
                    }}
                  >
                    {(() => {
                      // Etiquetas del filtro
                      const etiquetas = {
                        mascotas: "Mascotas",
                        reforestacion: "Reforestación",
                        arte: "Arte",
                        fandom: "Fandom",
                        ayuda_ongs: "ONGs",
                        ayuda_ciudadana: "Ciudadanía",
                        salud: "Salud Mental",
                        club: "Lectura",
                        juegos: "Juegos",
                        actividad: "Deportes",
                      };
                      const key = evento.categoria.toLowerCase();
                      return etiquetas[key] || evento.categoria;
                    })()}
                  </span>
                )}
              </div>
              <span className="evento-fecha">
                {new Date(evento.fecha).toLocaleDateString("es-ES", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="evento-detalles-body">
              <p className="evento-descripcion fondo-blanco-suave">
                <strong>Descripción:</strong>{" "}
                {evento.descripcion || "Sin descripción disponible"}
              </p>
              <p className="evento-ubicacion fondo-blanco-suave">
                <strong>Ubicación:</strong>{" "}
                {evento.ubicacion || "Ubicación no especificada"}
              </p>
              {creador && (
                <div className="evento-creador-card fondo-morado-suave">
                  <span className="evento-creador-label">Organizado por:</span>
                  <span className="evento-creador-nombre">
                    {creador.nombre || "Usuario"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {seccionActiva === "participantes" && (
          <div className="evento-participantes-tab fondo-blanco-suave anim-slidein">
            <ListaParticipantes eventoId={evento.id} />
          </div>
        )}

        {seccionActiva === "chat" && (
          <div className="evento-chat-tab fondo-morado-chat anim-slidein">
            <ChatGrupal eventoId={evento.id} />
          </div>
        )}
      </div>
    </div>
  );
}

export default EventoDetalle;
