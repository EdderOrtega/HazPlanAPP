import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import ModalPerfilCreado from "./ui/ModalPerfilCreado";

const INTERESES_LISTA = [
  "Deportes",
  "Música",
  "Arte",
  "Tecnología",
  "Voluntariado",
  "Viajes",
  "Cine",
  "Lectura",
  "Gaming",
  "Fitness",
  "Mascotas",
  "Naturaleza",
  "Cocina",
  "Fotografía",
  "Moda",
  "Ciencia",
  "Emprendimiento",
  "Networking",
  "Baile",
  "Meditación",
  "Kpop",
  "Anime",
  "Series",
  "Comedia",
  "Podcast",
  "Idiomas",
  "Política",
  "Finanzas",
  "Cómics",
  "Manualidades",
  "Salud mental",
];

// Relación interés-categoría
const INTERESES_CATEGORIAS = {
  Deportes: "Salud y Bienestar",
  Música: "Arte y Cultura",
  Arte: "Arte y Cultura",
  Tecnología: "Tecnología",
  Voluntariado: "Social",
  Viajes: "Aventura",
  Cine: "Arte y Cultura",
  Lectura: "Arte y Cultura",
  Gaming: "Tecnología",
  Fitness: "Salud y Bienestar",
  Mascotas: "Mascotas",
  Naturaleza: "Aventura",
  Cocina: "Gastronomía",
  Fotografía: "Arte y Cultura",
  Moda: "Arte y Cultura",
  Ciencia: "Ciencia",
  Emprendimiento: "Negocios",
  Networking: "Negocios",
  Baile: "Arte y Cultura",
  Meditación: "Salud y Bienestar",
  Kpop: "Arte y Cultura",
  Anime: "Arte y Cultura",
  Series: "Arte y Cultura",
  Comedia: "Arte y Cultura",
  Podcast: "Arte y Cultura",
  Idiomas: "Educación",
  Política: "Actualidad",
  Finanzas: "Negocios",
  Cómics: "Arte y Cultura",
  Manualidades: "Arte y Cultura",
  "Salud mental": "Salud y Bienestar",
};

function CrearPerfil() {
  const [step, setStep] = useState(1);
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [gustosSeleccionados, setGustosSeleccionados] = useState([]);
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
    // Si es foto de perfil, carpeta = "perfiles"; si es de eventos, carpeta = "imagenesEventos"
    const nombreArchivo = `${carpeta}/${Date.now()}_${file.name}`;
    const bucket = "hazplanimagenperfil";
    const { error } = await supabase.storage
      .from(bucket)
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
        const path = await subirImagen(foto, "imagenesEventos");
        fotosEventosPaths.push(path);
      }
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Debes iniciar sesión para subir imágenes.");
        return;
      }
      const gustos = gustosSeleccionados.join(", ");
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center ",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "320px",
            }}
          >
            <label style={{ color: "#593c8f" }}>Nombre completo:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              style={{ color: "#222" }}
            />
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!nombre}
              style={{ marginLeft: "10px" }}
            >
              Siguiente
            </button>
          </div>
        )}

        {step === 2 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center ",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "320px",
            }}
          >
            <label style={{ color: "#593c8f" }}>Edad:</label>
            <input
              type="number"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              required
              style={{ color: "#222" }}
            />
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              <button type="button" onClick={() => setStep(1)}>
                Atrás
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!edad}
                style={{ marginLeft: "10px" }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center ",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "320px",
              width: "100%",
              maxWidth: 400,
              boxSizing: "border-box",
            }}
          >
            <label
              style={{
                color: "#593c8f",
                width: "100%",
                textAlign: "left",
                marginBottom: 8,
              }}
            >
              Foto de perfil:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFotoPerfil(e.target.files[0])}
              required
              style={{
                color: "#222",
                width: "100%",
                minWidth: 0,
                maxWidth: "100%",
                boxSizing: "border-box",
                marginBottom: 12,
              }}
            />
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                marginTop: "10px",
                textAlign: "center",
                width: "100%",
                gap: 8,
              }}
            >
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{ flex: 1, minWidth: 120 }}
              >
                Atrás
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!fotoPerfil}
                style={{ flex: 1, minWidth: 120 }}
              >
                Siguiente
              </button>
            </div>
            {/* Media query responsiva para pantallas pequeñas */}
            <style>{`
              @media (max-width: 480px) {
                .crear-perfil-foto-input {
                  width: 100% !important;
                  min-width: 0 !important;
                  max-width: 100% !important;
                  font-size: 15px !important;
                }
              }
            `}</style>
          </div>
        )}

        {step === 4 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center ",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "320px",
            }}
          >
            <label style={{ color: "#593c8f" }}>
              Selecciona tus intereses:
            </label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                margin: "16px 0",
              }}
            >
              {INTERESES_LISTA.map((interes) => (
                <button
                  type="button"
                  key={interes}
                  onClick={() => {
                    setGustosSeleccionados((prev) =>
                      prev.includes(interes)
                        ? prev.filter((g) => g !== interes)
                        : [...prev, interes]
                    );
                  }}
                  style={{
                    padding: "8px 16px 8px 12px",
                    borderRadius: "20px",
                    border: gustosSeleccionados.includes(interes)
                      ? "2px solid #593c8f"
                      : "1px solid #ccc",
                    background: gustosSeleccionados.includes(interes)
                      ? "#e8deff"
                      : "#fff",
                    color: gustosSeleccionados.includes(interes)
                      ? "#593c8f"
                      : "#444",
                    fontWeight: gustosSeleccionados.includes(interes)
                      ? 700
                      : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    boxShadow: gustosSeleccionados.includes(interes)
                      ? "0 2px 8px #e8deff"
                      : "none",
                  }}
                >
                  <span>{interes}</span>
                  <span
                    style={{
                      background: "#f3eaff",
                      color: "#7c4dff",
                      fontSize: "12px",
                      borderRadius: "10px",
                      padding: "2px 8px",
                      marginLeft: "4px",
                      fontWeight: 500,
                      border: "1px solid #e0d7fa",
                    }}
                  >
                    {INTERESES_CATEGORIAS[interes] || "Otro"}
                  </span>
                </button>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              <button type="button" onClick={() => setStep(3)}>
                Atrás
              </button>
              <button
                type="button"
                onClick={() => setStep(5)}
                disabled={gustosSeleccionados.length === 0}
                style={{ marginLeft: "10px" }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center ",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "320px",
            }}
          >
            <label style={{ color: "#593c8f" }}>
              Ubicación (ciudad o colonia):
            </label>
            <input
              type="text"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              style={{ color: "#222" }}
            />
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              <button type="button" onClick={() => setStep(4)}>
                Atrás
              </button>
              <button
                type="button"
                onClick={() => setStep(6)}
                style={{ marginLeft: "10px" }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 6 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center ",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "320px",
            }}
          >
            <label style={{ color: "#593c8f" }}>
              Biografía o descripción corta:
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{
                color: "#593c8f",
                background: "#fff",
                border: "1px solid #593c8f",
                borderRadius: "6px",
                padding: "8px",
                fontSize: "16px",
                width: "100%",
                minHeight: "80px",
                boxSizing: "border-box",
              }}
            />
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              <button type="button" onClick={() => setStep(5)}>
                Atrás
              </button>
              <button
                type="button"
                onClick={() => setStep(7)}
                style={{ marginLeft: "10px" }}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}

        {step === 7 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "center ",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "320px",
            }}
          >
            <label style={{ color: "#593c8f" }}>
              Fotos de eventos (máx. 4):
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFotosEventos}
              style={{ color: "#222" }}
            />
            <div
              style={{
                display: "flex",
                marginTop: "10px",
                textAlign: "center",
              }}
            >
              <button type="button" onClick={() => setStep(6)}>
                Atrás
              </button>
              <button type="submit">Finalizar y guardar perfil</button>
            </div>
          </div>
        )}
      </form>

      {showModal && <ModalPerfilCreado onVerPerfil={handleVerPerfil} />}
    </div>
  );
}

export default CrearPerfil;
