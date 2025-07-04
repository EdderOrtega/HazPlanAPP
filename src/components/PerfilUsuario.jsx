import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  FiEdit3,
  FiTrash2,
  FiChevronDown,
  FiChevronUp,
  FiMapPin,
  FiCalendar,
  FiUsers,
} from "react-icons/fi";
import "../styles/perfilUsuario.css";
import Loader from "./ui/Loader";

function PerfilUsuario() {
  const [perfil, setPerfil] = useState(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [misEventos, setMisEventos] = useState([]);
  const [eventosExpandido, setEventosExpandido] = useState(false);
  const navigate = useNavigate();

  // ...existing code...

  useEffect(() => {
    const fetchPerfil = async () => {
      // Obtén el usuario autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Busca el perfil en la base de datos
      const { data, error } = await supabase
        .from("usuariosRegistrados")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        setPerfil(null);
        setLoading(false);
        return;
      }
      setPerfil(data);

      // Obtén la URL firmada de la foto de perfil
      if (data.foto_perfil) {
        const { data: urlData } = await supabase.storage
          .from("hazplanimagenes")
          .createSignedUrl(data.foto_perfil, 3600);
        setFotoPerfilUrl(urlData?.signedUrl || "");
      }
      setLoading(false);

      // Traer eventos creados por el usuario
      const { data: eventosData } = await supabase
        .from("eventos")
        .select("*")
        .eq("user_id", user.id);
      setMisEventos(eventosData || []);
    };

    fetchPerfil();
  }, [navigate]);

  const handleBorrarEvento = async (eventoId) => {
    if (window.confirm("¿Seguro que quieres borrar este evento?")) {
      await supabase.from("eventos").delete().eq("id", eventoId);
      setMisEventos(misEventos.filter((e) => e.id !== eventoId));
    }
  };

  if (loading)
    return (
      <div className="perfil-loading">
        <Loader />
      </div>
    );

  if (!perfil) {
    return (
      <div className="perfil-container">
        <div className="perfil-vacio">
          <div className="perfil-icono">👤</div>
          <h2>¡Bienvenido a HazPlan!</h2>
          <p>
            Aún no has creado tu perfil. Completa tu información para conectar
            con otros usuarios.
          </p>
          <button
            className="btn-crear-perfil"
            onClick={() => navigate("/crear-perfil")}
          >
            Crear mi perfil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-container">
      {/* Header del perfil */}
      <div className="perfil-header">
        <div className="perfil-foto-container">
          {fotoPerfilUrl ? (
            <img
              src={fotoPerfilUrl}
              alt="Foto de perfil"
              className="perfil-foto"
            />
          ) : (
            <div className="perfil-foto-placeholder">
              <span>👤</span>
            </div>
          )}
          <button
            className="btn-editar-foto"
            onClick={() => navigate("/crear-perfil")}
          >
            <FiEdit3 />
          </button>
        </div>

        <div className="perfil-info">
          <h1 className="perfil-nombre">{perfil.nombre}</h1>
          <p className="perfil-edad">{perfil.edad} años</p>
          <div className="perfil-ubicacion">
            <FiMapPin className="icono" />
            <span>{perfil.ubicacion}</span>
          </div>
        </div>
      </div>

      {/* Información del perfil */}
      <div className="perfil-detalles">
        <div className="detalle-card">
          <h3>Sobre mí</h3>
          <p>{perfil.bio || "Sin descripción"}</p>
        </div>

        <div className="detalle-card">
          <h3>Mis intereses</h3>
          <div className="gustos-tags">
            {perfil.gustos ? (
              perfil.gustos.split(",").map((gusto, index) => (
                <span key={index} className="gusto-tag">
                  {gusto.trim()}
                </span>
              ))
            ) : (
              <span>Sin intereses definidos</span>
            )}
          </div>
        </div>
      </div>

      {/* Sección de eventos desplegable */}
      <div className="eventos-section">
        <div
          className="eventos-header"
          onClick={() => setEventosExpandido(!eventosExpandido)}
        >
          <div className="eventos-title">
            <FiCalendar className="icono" />
            <h3>Mis eventos ({misEventos.length})</h3>
          </div>
          {eventosExpandido ? <FiChevronUp /> : <FiChevronDown />}
        </div>

        {eventosExpandido && (
          <div className="eventos-lista">
            {misEventos.length === 0 ? (
              <div className="eventos-vacio">
                <div className="eventos-icono">📅</div>
                <p>Aún no has creado eventos</p>
                <button
                  className="btn-crear-evento"
                  onClick={() => navigate("/crear-evento")}
                >
                  Crear mi primer evento
                </button>
              </div>
            ) : (
              misEventos.map((evento) => (
                <div key={evento.id} className="evento-card">
                  <div className="evento-info">
                    <h4 className="evento-nombre">{evento.nombre}</h4>
                    <div className="evento-detalles">
                      <div className="evento-fecha">
                        <FiCalendar className="icono-pequeno" />
                        <span>
                          {new Date(evento.fecha).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="evento-ubicacion">
                        <FiMapPin className="icono-pequeno" />
                        <span>{evento.ubicacion}</span>
                      </div>
                      <div className="evento-cupo">
                        <FiUsers className="icono-pequeno" />
                        <span>{evento.cupo} personas</span>
                      </div>
                    </div>
                    <p className="evento-descripcion">{evento.descripcion}</p>
                  </div>

                  <div className="evento-acciones">
                    <button
                      className="btn-editar"
                      onClick={() => navigate(`/editar-evento/${evento.id}`)}
                    >
                      <FiEdit3 />
                      Editar
                    </button>
                    <button
                      className="btn-eliminar"
                      onClick={() => handleBorrarEvento(evento.id)}
                    >
                      <FiTrash2 />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PerfilUsuario;
