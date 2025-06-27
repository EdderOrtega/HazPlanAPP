import { useNavigate } from "react-router-dom";
import "../../styles/ModalPerfilCreado.css";
import capibara from "../../assets/capibaraMascota.png";

const ModalEventoCreadoExistosamente = ({ onClose }) => {
  const navigate = useNavigate();

  const handleVerMapa = () => {
    onClose();
    navigate("/mapa");
  };

  return (
    <div className="modal-registro-overlay">
      <div className="modal-registro">
        <img src={capibara} alt="Capibara" className="modal-capibara-img" />
        <h2>¡Evento creado exitosamente!</h2>
        <p>
          Tu evento ha sido guardado correctamente y ya está visible en el mapa.
        </p>
        <button onClick={handleVerMapa}>Ver en el mapa</button>
      </div>
    </div>
  );
};

export default ModalEventoCreadoExistosamente;
