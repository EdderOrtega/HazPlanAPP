import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginCorreo = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      alert("Login exitoso!");
      // Redirige o actualiza el estado aquí si lo necesitas
    } catch (err) {
      setError(err.message);
      console.error("Error login correo:", err);
    }
  };

  const loginGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      setError("");
      alert("Login con Google exitoso!");
      // Redirige o actualiza el estado aquí si lo necesitas
    } catch (err) {
      setError(err.message);
      console.error("Error login Google:", err);
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={loginCorreo}>
        <button onClick={loginGoogle}>Iniciar sesión con Google</button>

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
        <button type="submit">Iniciar sesión con correo</button>
      </form>
    </div>
  );
}

export default Login;
