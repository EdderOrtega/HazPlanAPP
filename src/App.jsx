import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import MenuBar from "./components/MenuBar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Registro from "./components/Registro";
import Login from "./components/Login";
import Formulario from "./components/Formulario";
import FormularioCiudadania from "./components/FormularioCiudadania";
import FormularioOngs from "./components/FormularioOngs";
import FormularioPremium from "./components/FormularioPremium";
import EventCategorySelector from "./components/EventCategorySelector";
import Mapa from "./components/Mapa";
import PerfilUsuario from "./components/PerfilUsuario";
import Logo from "./components/navigation/Logo";
import ChatEvento from "./components/ChatEvento";
import CrearPerfil from "./components/CrearPerfil";
import Navbar from "./components/Navbar";
import VectorAnimado from "./components/VectorAnimado";
import IntroScreen from "./components/IntroScreen";
import EventoDetalle from "./components/EventoDetalle";
import EditarEvento from "./components/events/EditarEvento";
import MisEventos from "./components/MisEventos";
import Notificaciones from "./components/Notificaciones";
import Mensajes from "./components/Mensajes";
import NotificationContainer from "./components/ui/NotificationContainer";
import ComingSoonModal from "./components/ui/ComingSoonModal";
import PromoBanner from "./components/ui/PromoBanner";
import "./App.css";
import "./styles/contrastImprovements.css";
import Loader from "./components/ui/Loader";
import LogoFijo from "./components/ui/LogoFijo";
import { useNotifications } from "./hooks/useNotifications";

function App() {
  const [user, setUser] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [showSplash, setShowSplash] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  // Sistema de notificaciones
  const { notifications, removeNotification, success, info } =
    useNotifications();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoadingSession(false);

      // Mostrar notificación de bienvenida si hay usuario
      if (data.user) {
        setTimeout(() => {
          success("¡Bienvenido de vuelta! 🎉", {
            title: "¡Hola!",
            duration: 4000,
          });
        }, 1500);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoadingSession(false);

        // Notificar cambios de sesión
        if (session?.user && _event === "SIGNED_IN") {
          info("Sesión iniciada correctamente", {
            title: "Conectado",
            duration: 3000,
          });
        }
      }
    );
    return () => listener.subscription.unsubscribe();
  }, [success, info]);

  // Splash/animación de bienvenida
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
      // Mostrar intro solo si el usuario no está logueado
      if (!user) {
        setShowIntro(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  // Ocultar intro cuando el usuario se loguee
  useEffect(() => {
    if (user) {
      setShowIntro(false);
    }
  }, [user]);

  // Función para mostrar el modal Coming Soon
  const handleShowComingSoon = () => {
    setShowComingSoonModal(true);
  };

  useEffect(() => {
    // Mostrar modal Coming Soon automáticamente después de usar la app por un tiempo
    if (user) {
      const timer = setTimeout(() => {
        setShowComingSoonModal(true);
      }, 30000); // 30 segundos después del login

      return () => clearTimeout(timer);
    }
  }, [user]);

  // Shortcut de teclado para mostrar el modal (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        setShowComingSoonModal(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (showSplash || loadingSession) return <VectorAnimado />;

  const handleIntroFinish = () => {
    setShowIntro(false);
  };

  // Mostrar intro cinematográfica solo para usuarios no logueados
  if (showIntro && !user) return <IntroScreen onFinish={handleIntroFinish} />;

  return (
    <Router>
      <Navbar user={user} onShowComingSoon={handleShowComingSoon} />
      <Routes>
        <Route
          path="/"
          element={<Home user={user} onShowComingSoon={handleShowComingSoon} />}
        />
        <Route
          path="/intro"
          element={<IntroScreen onFinish={handleIntroFinish} />}
        />
        <Route path="/registro" element={<Registro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/formulario" element={<EventCategorySelector />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/chat/:eventoId" element={<ChatEvento />} />
        <Route path="/evento/:eventoId" element={<EventoDetalle />} />
        <Route path="/crear-perfil" element={<CrearPerfil />} />
        <Route path="/crear-evento" element={<Formulario />} />
        <Route
          path="/crear-evento-ciudadania"
          element={<FormularioCiudadania />}
        />
        <Route path="/crear-evento-ongs" element={<FormularioOngs />} />
        <Route path="/crear-evento-premium" element={<FormularioPremium />} />
        <Route path="/perfil-usuario/:userId" element={<PerfilUsuario />} />
        <Route path="/editar-evento/:eventoId" element={<EditarEvento />} />
        <Route path="/mis-eventos" element={<MisEventos />} />
        <Route path="/notificaciones" element={<Notificaciones />} />
        <Route path="/mensajes" element={<Mensajes />} />
      </Routes>
      {user && <MenuBar user={user} />}

      {/* Sistema de notificaciones global */}
      <NotificationContainer
        notifications={notifications}
        removeNotification={removeNotification}
      />
      {/* Modal Coming Soon tipo TikTok */}
      <ComingSoonModal
        isOpen={showComingSoonModal}
        onClose={() => setShowComingSoonModal(false)}
      />

      {/* Banner promocional flotante */}
      <PromoBanner onShowComingSoon={handleShowComingSoon} user={user} />
    </Router>
  );
}

export default App;
