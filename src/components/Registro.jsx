import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import ModalRegistroExitoso from "./ui/ModalRegistroExitoso";
import iconoHazPlan from "/public/images/iconoHazPlanRedondo.png";
import "../styles/registro.css";
import Loader from "./ui/Loader";

function Registro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const registerCorreo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        handleRegistroExitoso();
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // NUEVO: función para Google
  const registerGoogle = async () => {
    setGoogleLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin + "/crear-perfil",
        },
      });
      if (error) setError(error.message);
    } catch {
      setError("Error al conectar con Google. Intenta de nuevo.");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleRegistroExitoso = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/crear-perfil");
  };

  return (
    <div className="registro-page">
      <div className="registro-container">
        <div className="registro-card">
          {/* Enlace para regresar al inicio con ícono */}
          <a
            href="/"
            className="registro-back-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              width: "fit-content",
              margin: "20px 0 10px 0",
              color: "#7c4dff",
              fontSize: 20,
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 19L8 12L15 5"
                stroke="#7c4dff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span style={{ fontSize: 16 }}>Volver al inicio</span>
          </a>
          {/* Logo */}
          <div className="registro-logo">
            <img src={iconoHazPlan} alt="HazPlan Logo" />
          </div>

          {/* Título */}
          <h1 className="registro-title">Únete a HazPlan</h1>
          <p className="registro-subtitle">
            Crea tu cuenta y comienza a planificar
          </p>

          {/* Error message */}
          {error && (
            <div className="registro-error">
              <span>{error}</span>
            </div>
          )}

          {/* Botón de Google */}
          <button
            type="button"
            onClick={registerGoogle}
            className={`google-button ${googleLoading ? "loading" : ""}`}
            disabled={googleLoading || loading}
          >
            {googleLoading ? (
              <>
                <div className="spinner"></div>
                <span>Conectando con Google...</span>
              </>
            ) : (
              <span>Registrarse con Google</span>
            )}
          </button>

          {/* Divider */}
          <div className="divider">
            <span>o continúa con email</span>
          </div>

          {/* Formulario */}
          <form onSubmit={registerCorreo} className="registro-form">
            <div className="input-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading || googleLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`registro-button ${loading ? "loading" : ""}`}
              disabled={loading || googleLoading}
            >
              {loading ? (
                <>
                  <Loader />
                </>
              ) : (
                <span>Crear cuenta</span>
              )}
            </button>
          </form>

          {/* Footer del formulario */}
          <div className="registro-footer">
            <p>
              ¿Ya tienes cuenta?{" "}
              <span
                className="registro-link"
                style={{
                  color: "#7c4dff",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/login")}
              >
                Inicia sesión aquí
              </span>
            </p>
          </div>
        </div>
      </div>

      {showModal && <ModalRegistroExitoso onClose={handleModalClose} />}
    </div>
  );
}

export default Registro;
