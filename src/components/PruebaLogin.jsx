import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginTest() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginCorreo = async (e) => {
    e.preventDefault();
    console.log("Intentando login", email, password);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      alert("Login exitoso!");
    } catch (err) {
      setError(err.message);
      console.error("Error login correo:", err);
    }
  };

  return (
    <form onSubmit={loginCorreo}>
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
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default LoginTest;
