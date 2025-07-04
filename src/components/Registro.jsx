import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import ModalRegistroExitoso from "./ui/ModalRegistroExitoso";

function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const registerCorreo = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setError(error.message);
    } else {
      setError("");
      handleRegistroExitoso();
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

  const handleRegistroExitoso = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/crear-perfil");
  };

  return (
    <div
      style={{
        marginTop: "80px",
        paddingBottom: "80px",
        padding: "40px",
        maxWidth: "400px",
        margin: "80px auto 80px auto",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{ textAlign: "center", color: "#593c8f", marginBottom: "30px" }}
      >
        Registro
      </h2>
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      <button
        type="button"
        onClick={registerGoogle}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#db4437",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          fontWeight: "500",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        Registrarse con Google
      </button>
      <form
        onSubmit={registerCorreo}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ddd",
            fontSize: "16px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "12px",
            backgroundColor: "#593c8f",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          Registrarse
        </button>
      </form>
      {showModal && <ModalRegistroExitoso onClose={handleModalClose} />}
    </div>
  );
}

export default Registro;
