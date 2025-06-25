import "../../styles/loader.css"; // Asegúrate de tener el archivo CSS en esta ruta
import capibara from "../../assets/capibaraMascota.png"; // Asegúrate de tener la imagen en esta ruta

function Loader() {
  return (
    <div className="loader-container">
      <img src={capibara} alt="Cargando..." className="capibara-loader" />
      <div className="loader-text">Cargando...</div>
    </div>
  );
}

export default Loader;
