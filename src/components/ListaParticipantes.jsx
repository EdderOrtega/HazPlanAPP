// Crear nuevo archivo ListaParticipantes.jsx
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import "../styles/listaParticipantes.css";
import { Link } from "react-router-dom";
import Loader from "./ui/Loader";
function ListaParticipantes({ eventoId }) {
  const [participantes, setParticipantes] = useState([]);
  const [perfiles, setPerfiles] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchParticipantes = async () => {
      setCargando(true);
      console.log("📋 Cargando participantes para evento:", eventoId);

      // 1. Trae los participantes
      const { data, error } = await supabase
        .from("participantes_eventos")
        .select("*")
        .eq("evento_id", eventoId);

      if (!error && data) {
        console.log("✅ Participantes cargados:", data.length);
        setParticipantes(data);

        // 2. Trae los perfiles de usuario
        const perfilesTemp = {};
        for (const p of data) {
          if (!perfilesTemp[p.user_id]) {
            const { data: perfil } = await supabase
              .from("usuariosRegistrados")
              .select("nombre, foto_perfil")
              .eq("user_id", p.user_id)
              .single();
            // Después de obtener el perfil:
            if (perfil && perfil.foto_perfil) {
              const { data: urlData } = await supabase.storage
                .from("hazplanimagenes")
                .createSignedUrl(perfil.foto_perfil, 3600);
              perfil.foto_perfil_url = urlData?.signedUrl || "";
            }
            perfilesTemp[p.user_id] = perfil || {
              nombre: "Usuario",
              foto_perfil_url: "",
            };
          }
        }
        setPerfiles(perfilesTemp);
      } else {
        console.error("❌ Error al cargar participantes:", error);
      }

      setCargando(false);
    };

    fetchParticipantes();

    // Suscribirse a cambios en tiempo real en participantes
    console.log("📡 Configurando realtime para participantes...");
    const participantesChannel = supabase
      .channel(`participantes-${eventoId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participantes_eventos",
          filter: `evento_id=eq.${eventoId}`,
        },
        (payload) => {
          console.log("📡 Cambio en participantes detectado:", payload);

          if (payload.eventType === "INSERT") {
            console.log("➕ Nuevo participante agregado");
            fetchParticipantes(); // Recargar lista completa
          } else if (payload.eventType === "DELETE") {
            console.log("➖ Participante eliminado");
            fetchParticipantes(); // Recargar lista completa
          }
        }
      )
      .subscribe((status) => {
        console.log("📡 Estado del canal participantes:", status);
      });

    return () => {
      console.log("🧹 Limpiando canal de participantes");
      supabase.removeChannel(participantesChannel);
    };
  }, [eventoId]);

  if (cargando) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          minHeight: "200px",
        }}
      >
        <Loader />
      </div>
    );
  }

  return (
    <div className="lista-participantes">
      <h3>Participantes ({participantes.length})</h3>
      <ul>
        {participantes.map((participante) => {
          const perfil = perfiles[participante.user_id] || {};
          return (
            <li key={participante.id} className="participante-item">
              <Link to={`/perfil-usuario/${participante.user_id}`}>
                {perfil.foto_perfil_url ? (
                  <img
                    src={perfil.foto_perfil_url}
                    alt="Perfil"
                    className="avatar-participante"
                  />
                ) : (
                  <div className="avatar-placeholder"></div>
                )}
                <span>{perfil.nombre || "Usuario"}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListaParticipantes;
