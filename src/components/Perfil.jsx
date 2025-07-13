import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import Loader from "./ui/Loader";

function Perfil() {
  const [user, setUser] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (user) {
      supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .single()
        .then(({ data }) => {
          setPerfil(data);
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <Loader />;

  if (!perfil) {
    // Si no hay perfil, muestra opción para crearlo o editarlo
    return (
      <div>
        <h2>¡Bienvenido!</h2>
        <p>Parece que aún no has creado tu perfil.</p>
        <button
          onClick={() => {
            /* navega a tu formulario de perfil */
          }}
        >
          Crear o editar perfil
        </button>
      </div>
    );
  }

  // Si hay perfil, muéstralo normalmente
  return (
    <div>
      <h2>Mi perfil</h2>
      <p>Nombre: {perfil.nombre}</p>
      {/* ...otros datos... */}
      <button
        onClick={() => {
          /* navega a tu formulario de edición */
        }}
      >
        Editar perfil
      </button>
    </div>
  );
}

export default Perfil;
