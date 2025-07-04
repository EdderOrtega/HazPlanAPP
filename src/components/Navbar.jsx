import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import UserMenuNew from "./UserMenuNew";
import Notificaciones from "./Notificaciones";
import Mensajes from "./Mensajes";
import iconoHazPlan from "../assets/iconoHazPlanRedondo.png";
import { FiBell, FiMessageCircle, FiUser, FiMenu, FiX } from "react-icons/fi";
import "../styles/navbar.css";

function Navbar({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    setShowUserMenu(false);
  };

  const closeAllMenus = () => {
    setShowNotifications(false);
    setShowMessages(false);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  };

  // No mostrar navbar en login y registro
  const hideNavbarPaths = ["/login", "/registro"];
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="navbar-logo" onClick={handleLogoClick}>
            <img src={iconoHazPlan} alt="HazPlan" className="logo-image" />
            <span className="logo-text">HazPlan</span>
          </div>

          {/* Desktop Menu */}
          {user && (
            <div className="navbar-desktop-menu">
              {/* Notificaciones */}
              <div className="navbar-item">
                <button
                  className={`navbar-button ${
                    showNotifications ? "active" : ""
                  }`}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowMessages(false);
                    setShowUserMenu(false);
                  }}
                >
                  <FiBell size={20} />
                  <span className="navbar-label">Notificaciones</span>
                </button>
                {showNotifications && (
                  <div className="navbar-dropdown">
                    <Notificaciones />
                  </div>
                )}
              </div>

              {/* Mensajes */}
              <div className="navbar-item">
                <button
                  className={`navbar-button ${showMessages ? "active" : ""}`}
                  onClick={() => {
                    setShowMessages(!showMessages);
                    setShowNotifications(false);
                    setShowUserMenu(false);
                  }}
                >
                  <FiMessageCircle size={20} />
                  <span className="navbar-label">Mensajes</span>
                </button>
                {showMessages && (
                  <div className="navbar-dropdown">
                    <Mensajes />
                  </div>
                )}
              </div>

              {/* Perfil */}
              <div className="navbar-item">
                <button
                  className={`navbar-button ${showUserMenu ? "active" : ""}`}
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                    setShowMessages(false);
                  }}
                >
                  <FiUser size={20} />
                  <span className="navbar-label">Perfil</span>
                </button>
                {showUserMenu && (
                  <div className="navbar-dropdown">
                    <UserMenuNew
                      user={user}
                      onLogout={handleLogout}
                      onNavigate={(path) => {
                        navigate(path);
                        closeAllMenus();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          {user && (
            <div className="navbar-mobile-toggle">
              <button
                className="mobile-menu-button"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                {showMobileMenu ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          )}

          {/* Login Button for non-authenticated users */}
          {!user && (
            <div className="navbar-auth">
              <button
                className="login-button"
                onClick={() => navigate("/login")}
              >
                Iniciar Sesión
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {user && showMobileMenu && (
          <div className="navbar-mobile-menu">
            <div className="mobile-menu-item">
              <button
                className="mobile-menu-link"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowMessages(false);
                  setShowUserMenu(false);
                }}
              >
                <FiBell size={20} />
                <span>Notificaciones</span>
              </button>
              {showNotifications && (
                <div className="mobile-dropdown">
                  <Notificaciones />
                </div>
              )}
            </div>

            <div className="mobile-menu-item">
              <button
                className="mobile-menu-link"
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowNotifications(false);
                  setShowUserMenu(false);
                }}
              >
                <FiMessageCircle size={20} />
                <span>Mensajes</span>
              </button>
              {showMessages && (
                <div className="mobile-dropdown">
                  <Mensajes />
                </div>
              )}
            </div>

            <div className="mobile-menu-item">
              <button
                className="mobile-menu-link"
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                  setShowMessages(false);
                }}
              >
                <FiUser size={20} />
                <span>Perfil</span>
              </button>
              {showUserMenu && (
                <div className="mobile-dropdown">
                  <UserMenuNew
                    user={user}
                    onLogout={handleLogout}
                    onNavigate={(path) => {
                      navigate(path);
                      closeAllMenus();
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay para cerrar menús */}
      {(showNotifications ||
        showMessages ||
        showUserMenu ||
        showMobileMenu) && (
        <div className="navbar-overlay" onClick={closeAllMenus}></div>
      )}
    </>
  );
}

export default Navbar;
