import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Logo from "./Logo";
function MenuBar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <nav
      style={{
        padding: "1rem",
        borderBottom: "1px solid #eee",
      }}
    >
      <Logo />
      <Link to="/">Inicio</Link>{" "}
      {!user && (
        <>
          <Link to="/login">Iniciar sesión</Link>{" "}
          <Link to="/registro">Registro</Link>
        </>
      )}
      {user && (
        <>
          <Link to="/perfil">Mi perfil</Link> <Link to="/mapa">Mapa</Link>
        </>
      )}
    </nav>
  );
}

export default MenuBar;
