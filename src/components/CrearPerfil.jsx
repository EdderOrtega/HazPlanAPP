import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import ModalPerfilCreado from "./ui/ModalPerfilCreado";

function CrearPerfil() {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [gustos, setGustos] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotosEventos, setFotosEventos] = useState([]);
  const [bio, setBio] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Debes iniciar sesión para crear tu perfil.");
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  const handleFotosEventos = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setFotosEventos(files);
  };

  const subirImagen = async (file, carpeta = "perfiles") => {
    if (!file) {
      setError("Selecciona una imagen válida.");
      return;
    }
    const nombreArchivo = `${carpeta}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage
      .from("hazplanimagenes")
      .upload(nombreArchivo, file, { upsert: false });
    if (error) throw error;
    return nombreArchivo;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let fotoPerfilPath = "";
      if (fotoPerfil) {
        fotoPerfilPath = await subirImagen(fotoPerfil, "perfiles");
      }
      const fotosEventosPaths = [];
      for (const foto of fotosEventos) {
        const path = await subirImagen(foto, "eventos");
        fotosEventosPaths.push(path);
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Debes iniciar sesión para subir imágenes.");
        return;
      }
      const { error: insertError } = await supabase
        .from("usuariosRegistrados")
        .insert([
          {
            user_id: user.id,
            nombre,
            edad,
            gustos,
            ubicacion,
            bio,
            foto_perfil: fotoPerfilPath,
            fotos_eventos: fotosEventosPaths,
          },
        ]);
      if (insertError) throw insertError;
      setShowModal(true);
    } catch (err) {
      setError("Error al subir imágenes o crear perfil");
      console.error(err);
    }
  };

  const handleVerPerfil = () => {
    setShowModal(false);
    navigate("/perfil");
  };

  // Pasos del wizard
  return (
    <div
      style={{
        marginTop: "80px",
        paddingBottom: "80px",
        padding: "40px",
        maxWidth: "600px",
        margin: "80px auto 80px auto",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{ textAlign: "center", color: "#593c8f", marginBottom: "30px" }}
      >
        Crear Perfil
      </h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div>
            <label>Nombre completo:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
            <button type="button" onClick={() => setStep(2)} disabled={!nombre}>
              Siguiente
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <label>Edad:</label>
            <input
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              required
            />
            <button type="button" onClick={() => setStep(1)}>
              Atrás
            </button>
            <button type="button" onClick={() => setStep(3)} disabled={!edad}>
              Siguiente
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <label>Foto de perfil:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFotoPerfil(e.target.files[0])}
              required
            />
            <button type="button" onClick={() => setStep(2)}>
              Atrás
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              disabled={!fotoPerfil}
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <label>Gustos e intereses (separados por coma):</label>
            <input
              type="text"
              value={gustos}
              onChange={(e) => setGustos(e.target.value)}
            />
            <button type="button" onClick={() => setStep(3)}>
              Atrás
            </button>
            <button type="button" onClick={() => setStep(5)}>
              Siguiente
            </button>
          </div>
        )}

        {step === 5 && (
          <div>
            <label>Ubicación (ciudad o colonia):</label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
            <button type="button" onClick={() => setStep(4)}>
              Atrás
            </button>
            <button type="button" onClick={() => setStep(6)}>
              Siguiente
            </button>
          </div>
        )}

        {step === 6 && (
          <div>
            <label>Biografía o descripción corta:</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
            <button type="button" onClick={() => setStep(5)}>
              Atrás
            </button>
            <button type="button" onClick={() => setStep(7)}>
              Siguiente
            </button>
          </div>
        )}

        {step === 7 && (
          <div>
            <label>Fotos de eventos (máx. 4):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFotosEventos}
            />
            <button type="button" onClick={() => setStep(6)}>
              Atrás
            </button>
            <button type="submit">Finalizar y guardar perfil</button>
          </div>
        )}
      </form>

      {showModal && <ModalPerfilCreado onVerPerfil={handleVerPerfil} />}
    </div>
  );
}

export default CrearPerfil;
