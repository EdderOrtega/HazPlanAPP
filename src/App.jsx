import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import MenuBar from "./components/MenuBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Registro from "./components/Registro";
import Login from "./components/Login";
import Formulario from "./components/Formulario";
import Mapa from "./components/Mapa";
import PerfilUsuario from "./components/PerfilUsuario";
import Logo from "./components/navigation/Logo";
import ChatEvento from "./components/ChatEvento";
import CrearPerfil from "./components/CrearPerfil";
import UserMenu from "./components/UserMenu";
import VectorAnimado from "./components/VectorAnimado";
import EventoDetalle from "./components/EventoDetalle";
import EditarEvento from "./components/events/EditarEvento";
import "./App.css";
import Loader from "./components/ui/Loader";
import LogoFijo from "./components/ui/logoFijo";

function App() {
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoadingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoadingSession(false);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  // Splash/animación de bienvenida
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5200); // 5.2s para animación extendida
    return () => clearTimeout(timer);
  }, []);

  if (showSplash || loadingSession) return <VectorAnimado />;

  return (
    <Router>
      <LogoFijo />
      {user && <UserMenu user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/chat/:eventoId" element={<ChatEvento />} />
        <Route path="/evento/:eventoId" element={<EventoDetalle />} />
        <Route path="/crear-perfil" element={<CrearPerfil />} />
        <Route path="/crear-evento" element={<Formulario />} />
        <Route path="/perfil-usuario/:userId" element={<PerfilUsuario />} />
        <Route path="/editar-evento/:eventoId" element={<EditarEvento />} />
      </Routes>
      {user && <MenuBar user={user} />}
    </Router>
  );
}

export default App;
