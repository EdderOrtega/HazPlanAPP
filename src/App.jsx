import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import Home from "./components/Home";
import Registro from "./components/Registro";
import Login from "./components/Login";
import Formulario from "./components/Formulario";
import Mapa from "./components/Mapa";
import PerfilUsuario from "./components/PerfilUsuario";
import Logo from "./components/Logo"
import ChatEvento from "./components/ChatEvento";
import CrearPerfil from "./components/CrearPerfil";
import UserMenu from "./components/UserMenu";
import VectorAnimado from "./components/VectorAnimado";
import { supabase } from "./supabaseClient";
import "./App.css";

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
      <MenuBar user={user} />
      {user && <UserMenu user={user} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/chat/:eventoId" element={<ChatEvento />} />
        <Route path="/crear-perfil" element={<CrearPerfil />} />
      </Routes>
    </Router>
  );
}

export default App;
