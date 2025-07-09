import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { FiUser, FiSettings, FiLogOut, FiEdit } from "react-icons/fi";

function UserMenuNew({ user, onLogout, onNavigate }) {
  const [perfil, setPerfil] = useState(null);
  const [fotoPerfilUrl, setFotoPerfilUrl] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchPerfil = async () => {
      try {
        const { data: perfilData } = await supabase
          .from("usuariosRegistrados")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (perfilData) {
          setPerfil(perfilData);

          if (perfilData.foto_perfil) {
            const { data: urlData } = await supabase.storage
              .from("hazplanimagenes")
              .createSignedUrl(perfilData.foto_perfil, 3600);

            if (urlData) {
              setFotoPerfilUrl(urlData.signedUrl);
            }
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };

    fetchPerfil();
  }, [user]);

  return (
    <div className="user-menu-dropdown">
      {/* Header del perfil */}
      <div className="user-menu-header">
        <div className="user-avatar">
          {fotoPerfilUrl ? (
            <img src={fotoPerfilUrl} alt="Perfil" />
          ) : (
            <FiUser size={24} />
          )}
        </div>
        <div className="user-info">
          <div className="user-name">
            {perfil?.nombre || user?.email || "Usuario"}
          </div>
          <div className="user-email">{user?.email}</div>
        </div>
      </div>

      {/* Menu items */}
      <div className="user-menu-items">
        <button
          className="user-menu-item"
          onClick={() => onNavigate("/perfil")}
        >
          <FiUser size={16} />
          <span>Mi Perfil</span>
        </button>

        <button
          className="user-menu-item"
          onClick={() => onNavigate("/mis-eventos")}
        >
          <FiEdit size={16} />
          <span>Mis Eventos</span>
        </button>

        <button
          className="user-menu-item"
          onClick={() => onNavigate("/formulario")}
        >
          <FiSettings size={16} />
          <span>Crear Evento</span>
        </button>

        <hr className="user-menu-separator" />

        <button className="user-menu-item logout" onClick={onLogout}>
          <FiLogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <style jsx>{`
        .user-menu-dropdown {
          padding: 16px;
          min-width: 220px;
        }

        .user-menu-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid #eee;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(45deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-info {
          flex: 1;
        }

        .user-name {
          font-weight: 600;
          color: #333;
          font-size: 0.9rem;
        }

        .user-email {
          font-size: 0.8rem;
          color: #666;
        }

        .user-menu-items {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          color: #333;
          text-align: left;
          width: 100%;
          transition: all 0.2s ease;
        }

        .user-menu-item:hover {
          background: #f5f5f5;
        }

        .user-menu-item.logout {
          color: #f44336;
        }

        .user-menu-item.logout:hover {
          background: #ffebee;
        }

        .user-menu-separator {
          border: none;
          border-top: 1px solid #eee;
          margin: 8px 0;
        }
      `}</style>
    </div>
  );
}

export default UserMenuNew;
