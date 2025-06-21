import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const registerCorreo = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setError("");
      navigate("/crear-perfil");
    }
  };

  // NUEVO: función para Google
  const registerGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/crear-perfil",
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div>
      <h2>Registro</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="button" onClick={registerGoogle}>
        Registrarse con Google
      </button>
      <form onSubmit={registerCorreo}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Registro;
