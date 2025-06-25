import "../../styles/ModalRegistroExitoso.css";
import capibara from "../../assets/capibaraMascota.png";

function ModalRegistroExitoso({ onClose }) {
  return (
    <div className="modal-registro-overlay">
      <div className="modal-registro">
        <img src={capibara} alt="Capibara" className="modal-capibara-img" />
        <h2>¡Registro exitoso!</h2>
        <p>Tu cuenta ha sido creada correctamente.</p>
        <button onClick={onClose}>Continuar</button>
      </div>
    </div>
  );
}

export default ModalRegistroExitoso;
