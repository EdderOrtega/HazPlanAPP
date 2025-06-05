import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import MenuBar from "./components/MenuBar";
import Registro from "./components/Registro";
import Mapa from "./components/Mapa";
import PerfilUsuario from "./components/PerfilUsuario";
import ChatEvento from "./components/ChatEvento";
import "./App.css";
import Formulario from "./components/Formulario";

function App() {
  return (
    <Router>
      <MenuBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Registro />} />
        <Route path="/registro/:id" element={<Registro />} />
        <Route path="/registro/:id/:eventoId" element={<Registro />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/chat/:eventoId" element={<ChatEvento />} />
      </Routes>
    </Router>
  );
}

export default App;
