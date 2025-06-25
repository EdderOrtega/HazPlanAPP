import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FiHome, FiMap, FiPlusCircle, FiBell, FiUser } from "react-icons/fi";
import "../styles/MenuBar.css";

function MenuBar({ user }) {
  const location = useLocation();

  return (
    <nav className="bottom-nav">
      <Link to="/" className={location.pathname === "/" ? "active" : ""}>
        <FiHome />
        <span>Inicio</span>
      </Link>
      <Link
        to="/mapa"
        className={location.pathname === "/mapa" ? "active" : ""}
      >
        <FiMap />
        <span>Mapa</span>
      </Link>
      <Link
        to="/crear-evento"
        className={
          location.pathname === "/crear-evento"
            ? "active crear-evento"
            : "crear-evento"
        }
      >
        <FiPlusCircle size={32} />
      </Link>
      <Link
        to="/notificaciones"
        className={location.pathname === "/notificaciones" ? "active" : ""}
      >
        <FiBell />
        <span>Notificaciones</span>
      </Link>
      <Link
        to={user ? "/perfil" : "/login"}
        className={location.pathname === "/perfil" ? "active" : ""}
      >
        <FiUser />
        <span>Perfil</span>
      </Link>
    </nav>
  );
}

export default MenuBar;
