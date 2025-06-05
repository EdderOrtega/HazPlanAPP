import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { ref, push, onValue } from "firebase/database";
import { useParams } from "react-router-dom";

function ChatEvento() {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const { eventoId } = useParams(); // Si usas react-router

  useEffect(() => {
    if (!eventoId) return;
    const mensajesRef = ref(db, `chats/${eventoId}`);
    onValue(mensajesRef, (snapshot) => {
      const data = snapshot.val();
      const lista = [];
      for (let id in data) {
        lista.push({ id, ...data[id] });
      }
      setMensajes(lista);
    });
  }, [eventoId]);

  const enviarMensaje = async () => {
    if (mensaje.trim() === "" || !eventoId) return;
    const user = auth.currentUser;
    await push(ref(db, `chats/${eventoId}`), {
      texto: mensaje,
      usuario: user ? user.email : "Anónimo",
      fecha: new Date().toISOString(),
    });
    setMensaje("");
  };

  return (
    <div>
      <h2>Chat del Evento</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "scroll",
        }}
      >
        {mensajes.map((msg) => (
          <div key={msg.id}>
            <b>{msg.usuario}:</b> {msg.texto}
            <span style={{ fontSize: "0.8em", color: "#888" }}>
              {" "}
              {new Date(msg.fecha).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Escribe tu mensaje..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
      />
      <button onClick={enviarMensaje}>Enviar</button>
    </div>
  );
}

export default ChatEvento;
