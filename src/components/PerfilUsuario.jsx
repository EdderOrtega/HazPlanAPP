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

  // Referencia para el input file
  const inputFileRef = React.useRef(null);

  const handleAgregarImagen = () => {
    if (inputFileRef.current) {
      inputFileRef.current.value = null; // Limpiar selección previa
      inputFileRef.current.click();
    }
  };

  // Manejar selección de archivo
  const handleArchivoSeleccionado = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      // Aquí puedes subir la imagen a Supabase Storage o mostrar preview
      // Por ahora solo muestra el nombre
      alert(`Imagen seleccionada: ${file.name}`);
      // TODO: subir imagen y actualizar galería
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
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "#7c4dff",
              border: "2px solid #fff",
              borderRadius: "50%",
              width: 36,
              height: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(89,60,143,0.18)",
              cursor: "pointer",
              zIndex: 2,
              padding: 0,
              transition: "box-shadow 0.2s",
            }}
            aria-label="Editar foto de perfil"
          >
            {/* SVG lápiz blanco */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.7 2.29a1 1 0 0 1 1.42 0l1.59 1.59a1 1 0 0 1 0 1.42l-9.34 9.34-2.83.71.71-2.83 9.34-9.34zM3 17h14v2H3v-2z"
                fill="#fff"
              />
            </svg>
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
                onClick={handleAgregarImagen}
                style={{ cursor: "pointer" }}
              >
                <FiPlus className="icono-plus" />
                <span>Agregar foto</span>
              </div>
            )
          )}
          {/* Input file oculto para subir imagen */}
          <input
            type="file"
            accept="image/*"
            ref={inputFileRef}
            style={{ display: "none" }}
            onChange={handleArchivoSeleccionado}
          />
        </div>
      </div>
    </div>
  );
}

export default PerfilUsuario;
