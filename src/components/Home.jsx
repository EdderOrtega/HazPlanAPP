import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import capibaraMascota from "../assets/capibaraMascota.png";
import { Link } from "react-router-dom";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div>
      <img
        src={capibaraMascota}
        alt="Logo de HazPlan"
        style={{ width: "100%", height: "auto" }}
      />
      <h1>HazPlan</h1>
      <p>
        Bienvenido a la app para crear y compartir eventos comunitarios en
        Monterrey.
      </p>
      {!user && (
        <>
          <Link to="/registro">Registro</Link> | <Link to="/login">Login</Link>
        </>
      )}
      <h3>¿Qué puedes hacer?</h3>
      <ul>
        <li>Crear y buscar eventos por categoría</li>
        <li>Unirte a eventos y chatear con otros miembros</li>
        <li>Personalizar tu perfil</li>
      </ul>
    </div>
  );
}

export default Home;
