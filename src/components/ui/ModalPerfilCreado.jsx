import "../../styles/modalPerfilCreado.css";
import capibara from "../../assets/capibaraMascota.png";

function ModalPerfilCreado({ onVerPerfil }) {
  return (
    <div className="modal-registro-overlay">
      <div className="modal-registro">
        <img src={capibara} alt="Capibara" className="modal-capibara-img" />
        <h2>¡Perfil creado!</h2>
        <p>Tu perfil ha sido guardado correctamente.</p>
        <button onClick={onVerPerfil}>Ver mi perfil</button>
      </div>
    </div>
  );
}

export default ModalPerfilCreado;
