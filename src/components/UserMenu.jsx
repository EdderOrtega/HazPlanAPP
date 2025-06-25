import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

function UserMenu({ user }) {
  const [perfil, setPerfil] = useState(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    if (!user) return; // Solo ejecuta si hay usuario

    const fetchPerfil = async () => {
      try {
        const { data: perfilData, error: perfilError } = await supabase
          .from("usuariosRegistrados")
          .select("*")
          .eq("user_id", user.id)
          .single();
        if (perfilError) console.error("Error perfil:", perfilError);

        if (perfilData && perfilData.foto_perfil) {
          const { data: urlData, error: urlError } = await supabase.storage
            .from("hazplanimagenes")
            .createSignedUrl(perfilData.foto_perfil, 3600);
          if (urlError) console.error("Error url firmada:", urlError);
          setFotoPerfilUrl(urlData?.signedUrl || "");
        }
        setPerfil(perfilData);
      } catch (e) {
        console.error("Error general:", e);
      }
    };
    fetchPerfil();
  }, [user]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (!perfil) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 14,
        zIndex: 1000,
        backgroundColor: "pink",
        borderRadius: 8,
        padding: "0.3rem",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        cursor: "pointer",
      }}
      ref={menuRef}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          gap: "0.5rem",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <img
          src={fotoPerfilUrl || "https://ui-avatars.com/api/?name=U"}
          alt="avatar"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #eee",
          }}
        />
        <span style={{ fontWeight: "bold" }}>{perfil.nombre}</span>
        <span style={{ fontSize: 20 }}>▼</span>
      </div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: 48,
            right: 0,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            minWidth: 160,
            padding: "0.5rem 0",
          }}
        >
          <div
            style={{
              backgroundColor: "black",
              padding: "0.5rem 1rem",
              margin: "0.5rem",
              cursor: "pointer",
            }}
            onClick={() => navigate("/perfil")}
          >
            Ver perfil
          </div>
          <div
            style={{
              backgroundColor: "black",
              padding: "0.5rem 1rem",
              margin: "0.5rem",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            Cerrar sesión
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(UserMenu);
