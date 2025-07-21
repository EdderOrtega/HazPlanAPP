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

      // 1. Traer participantes del evento
      const { data: participantesData, error: participantesError } =
        await supabase
          .from("participantes_eventos")
          .select("user_id")
          .eq("evento_id", eventoId);

      if (participantesError) {
        console.error("❌ Error al cargar participantes:", participantesError);
        setCargando(false);
        return;
      }

      // 2. Filtrar usuarios únicos (evitar repetidos y nulos)
      const userIdsUnicos = [
        ...new Set(
          participantesData.filter((p) => !!p.user_id).map((p) => p.user_id)
        ),
      ];
      setParticipantes(userIdsUnicos);

      if (userIdsUnicos.length === 0) {
        setPerfiles({});
        setCargando(false);
        return;
      }

      // 3. Traer datos de perfiles SOLO de esos usuarios
      const { data: perfilesData, error: perfilesError } = await supabase
        .from("usuariosRegistrados")
        .select("user_id, nombre, foto_perfil")
        .in("user_id", userIdsUnicos);

      if (perfilesError) {
        console.error("❌ Error al cargar perfiles:", perfilesError);
        setPerfiles({});
        setCargando(false);
        return;
      }

      // 4. Crear objeto perfiles con URL pública de Supabase Storage
      const SUPABASE_URL = supabase.supabaseUrl;
      const BUCKET = "hazplanimagenperfil";
      const perfilesMap = {};
      perfilesData.forEach((perfil) => {
        let fotoUrl = "";
        if (perfil.foto_perfil && perfil.foto_perfil !== "null") {
          // Usa el path tal cual viene de la base de datos (sin anteponer 'perfiles/')
          let path = perfil.foto_perfil.startsWith("/")
            ? perfil.foto_perfil.slice(1)
            : perfil.foto_perfil;
          fotoUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
        } else {
          if (!perfil.foto_perfil) {
            console.warn("[FOTO] Usuario sin foto_perfil:", perfil.user_id);
          } else {
            console.warn(
              "[FOTO] Valor inesperado en foto_perfil:",
              perfil.foto_perfil
            );
          }
        }
        perfilesMap[perfil.user_id] = {
          nombre: perfil.nombre || "Usuario",
          foto_perfil_url: fotoUrl,
        };
      });
      setPerfiles(perfilesMap);

      setCargando(false);
    };

    fetchParticipantes();

    // Opcional: suscripción realtime si quieres
    const channel = supabase
      .channel(`participantes-${eventoId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participantes_eventos",
          filter: `evento_id=eq.${eventoId}`,
        },
        () => {
          fetchParticipantes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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
        {participantes.map((user_id) => {
          const perfil = perfiles[user_id] || {};
          return (
            <li
              key={user_id}
              className="participante-item"
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <Link
                to={`/perfil-usuario/${user_id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "inherit",
                  gap: 12,
                }}
              >
                {perfil.foto_perfil_url ? (
                  <img
                    src={perfil.foto_perfil_url}
                    alt="Foto de perfil"
                    className="avatar-participante"
                    style={{ verticalAlign: "middle" }}
                  />
                ) : (
                  <div
                    className="avatar-placeholder"
                    style={{ verticalAlign: "middle" }}
                  ></div>
                )}
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  {perfil.nombre}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ListaParticipantes;
