import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function PerfilUsuario() {
  const [perfil, setPerfil] = useState(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  if (loading) return <p>Cargando perfil...</p>;
  if (!perfil) return <p>No se encontró el perfil.</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      {fotoPerfilUrl && (
        <img
          src={fotoPerfilUrl}
          alt="Foto de perfil"
          style={{ width: 120, height: 120, borderRadius: "50%" }}
        />
      )}
      <p>
        <b>Nombre:</b> {perfil.nombre}
      </p>
      <p>
        <b>Edad:</b> {perfil.edad}
      </p>
      <p>
        <b>Gustos:</b> {perfil.gustos}
      </p>
      <p>
        <b>Ubicación:</b> {perfil.ubicacion}
      </p>
      <p>
        <b>Bio:</b> {perfil.bio}
      </p>
    </div>
  );
}

export default PerfilUsuario;
