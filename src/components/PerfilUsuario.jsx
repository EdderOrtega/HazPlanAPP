import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import { FiEdit3, FiMapPin, FiPlus } from "react-icons/fi";
import "../styles/perfilUsuario.css";
import Loader from "./ui/Loader";

function PerfilUsuario() {
  const [perfil, setPerfil] = useState(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");
  const [imagenesGaleria, _setImagenesGaleria] = useState([]);
  const [loading, setLoading] = useState(true);
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
    };

    fetchPerfil();
  }, [navigate]);

  const handleAgregarImagen = () => {
    // TODO: Implementar función para agregar imagen
    console.log("Agregar imagen");
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

      {/* Galería de imágenes */}
      <div className="perfil-galeria">
        <h3>Mis fotos</h3>
        <div className="galeria-grid">
          {imagenesGaleria.map((imagen, index) => (
            <div key={index} className="galeria-item">
              <img src={imagen.url} alt={`Foto ${index + 1}`} />
            </div>
          ))}
          {/* Slots vacíos con botón de agregar */}
          {Array.from({ length: 4 - imagenesGaleria.length }).map(
            (_, index) => (
              <div
                key={`empty-${index}`}
                className="galeria-item galeria-vacia"
                onClick={() => handleAgregarImagen()}
              >
                <FiPlus className="icono-plus" />
                <span>Agregar foto</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilUsuario;
