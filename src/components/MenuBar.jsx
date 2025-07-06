import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiMap,
  FiPlusCircle,
  FiCalendar,
  FiUser,
} from "react-icons/fi";
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
        to="/formulario"
        className={
          location.pathname === "/formulario"
            ? "active crear-evento"
            : "crear-evento"
        }
      >
        <FiPlusCircle size={32} />
      </Link>
      <Link
        to="/mis-eventos"
        className={location.pathname === "/mis-eventos" ? "active" : ""}
      >
        <FiCalendar />
        <span>Mis Eventos</span>
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
