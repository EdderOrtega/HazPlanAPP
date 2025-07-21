import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

// Filtrar eventos expirados (solo mostrar eventos cuya fecha_fin es hoy o futura)
const filtrarEventosActivos = (eventos) => {
  const ahora = new Date();
  return (eventos || []).filter((e) => {
    if (!e.fecha_fin) return true; // Si no tiene fecha_fin, mostrarlo
    try {
      return new Date(e.fecha_fin) >= ahora;
    } catch {
      return true;
    }
  });
};

export const useMapEvents = () => {
  const [eventos, setEventos] = useState([]);
  const [isLoadingEventos, setIsLoadingEventos] = useState(false);

  // Función para cargar eventos
  const fetchEventos = async () => {
    setIsLoadingEventos(true);
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("fecha", { ascending: true });

    if (!error) {
      setEventos(filtrarEventosActivos(data || []));
      // console.log eliminado
    } else {
      console.error("❌ Error al cargar eventos:", error);
    }
    setIsLoadingEventos(false);
  };

  // Cargar eventos y escuchar cambios en tiempo real
  useEffect(() => {
    // Cargar eventos inicialmente
    fetchEventos();

    // Suscribirse a cambios en tiempo real en la tabla eventos
    // console.log eliminado
    const eventosChannelName = `eventos-updates-${Date.now()}`;
    const eventosChannel = supabase
      .channel(eventosChannelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "eventos",
        },
        (payload) => {
          // console.log eliminado

          if (payload.eventType === "INSERT") {
            // console.log eliminado
            setEventos((prev) => filtrarEventosActivos([...prev, payload.new]));
          } else if (payload.eventType === "UPDATE") {
            // console.log eliminado
            setEventos((prev) =>
              filtrarEventosActivos(
                prev.map((evento) =>
                  evento.id === payload.new.id ? payload.new : evento
                )
              )
            );
          } else if (payload.eventType === "DELETE") {
            // console.log eliminado
            setEventos((prev) =>
              filtrarEventosActivos(
                prev.filter((evento) => evento.id !== payload.old.id)
              )
            );
          }
        }
      )
      .subscribe((status) => {
        // console.log eliminado
        if (status === "SUBSCRIBED") {
          // console.log eliminado
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ Error en el canal de eventos");
        }
      });

    return () => {
      // console.log eliminado
      supabase.removeChannel(eventosChannel);
    };
  }, []);

  return { eventos, isLoadingEventos, fetchEventos };
};
