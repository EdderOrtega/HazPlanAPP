import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function CrearPerfil() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [gustos, setGustos] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotosEventos, setFotosEventos] = useState([]);
  const [bio, setBio] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [error, setError] = useState("");
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
  }, []);

  const handleFotosEventos = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setFotosEventos(files);
  };

  // Sube la imagen y retorna la ruta (no la URL pública)
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
      // Subir foto de perfil
      let fotoPerfilPath = "";
      if (fotoPerfil) {
        fotoPerfilPath = await subirImagen(fotoPerfil, "perfiles");
      }

      // Subir fotos de eventos
      const fotosEventosPaths = [];
      for (const foto of fotosEventos) {
        const path = await subirImagen(foto, "eventos");
        fotosEventosPaths.push(path);
      }

      // Obtener el usuario autenticado
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Usuario autenticado:", user);
      console.log("user.id:", user.id);
      if (!user) {
        setError("Debes iniciar sesión para subir imágenes.");
        return;
      }

      // Guarda el perfil en la tabla "perfiles"
      const { error: insertError } = await supabase
        .from("usuariosRegistrados")
        .insert([
          {
            user_id: user.id, // Nuevo campo para el id del usuario autenticado
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

      alert("¡Perfil creado!");
      // Aquí podrías redirigir o limpiar el formulario
    } catch (err) {
      setError("Error al subir imágenes o crear perfil");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Crear Perfil</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Edad"
          value={edad}
          onChange={(e) => setEdad(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Gustos e intereses (separados por coma)"
          value={gustos}
          onChange={(e) => setGustos(e.target.value)}
        />
        <input
          type="text"
          placeholder="Ubicación (ciudad o colonia)"
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
        />
        <textarea
          placeholder="Biografía o descripción corta"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <label>
          Foto de perfil:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFotoPerfil(e.target.files[0])}
            required
          />
        </label>
        <label>
          Fotos de eventos (máx. 4):
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFotosEventos}
          />
        </label>
        <button type="submit">Guardar perfil</button>
      </form>
    </div>
  );
}

export default CrearPerfil;
