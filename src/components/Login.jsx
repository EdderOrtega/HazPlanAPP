import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import logoHazPlan from "../assets/iconoHazPlanRedondo.png";
import Loader from "./ui/Loader";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loginCorreo = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        navigate("/perfil");
      }
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background"></div>
      <div className="login-container">
        <div className="login-card">
          {/* Logo */}
          <div className="login-logo">
            <img src={logoHazPlan} alt="HazPlan Logo" />
          </div>

          {/* Título */}
          <h1 className="login-title">Bienvenido a HazPlan</h1>
          <p className="login-subtitle">Inicia sesión para continuar</p>

          {/* Error message */}
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={loginCorreo} className="login-form">
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
                  disabled={loading}
                />
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type="password"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`login-button ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar sesión</span>
              )}
            </button>
          </form>

          {/* Footer del formulario */}
          <div className="login-footer">
            <p>
              ¿No tienes cuenta?{" "}
              <span
                className="login-link"
                style={{
                  color: "#7c4dff",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
                onClick={() => navigate("/registro")}
              >
                Regístrate aquí
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
