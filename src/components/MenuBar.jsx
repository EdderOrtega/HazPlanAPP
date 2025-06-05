import { Link } from "react-router-dom";

function MenuBar() {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/">Inicio</Link> | <Link to="/mapa">Mapa</Link> |{" "}
      <Link to="/formulario">Formulario</Link> |{" "}
      <Link to="/registro">Registro</Link>
      
    </nav>
  );
}

export default MenuBar;
