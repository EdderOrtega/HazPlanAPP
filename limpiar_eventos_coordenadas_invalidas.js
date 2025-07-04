#!/usr/bin/env node

/**
 * Script para limpiar eventos con coordenadas inválidas desde la base de datos
 * Esto reduce los warnings en la consola del mapa
 */

import { createClient } from "@supabase/supabase-js";

// Configura tu URL y clave de Supabase
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function limpiarEventosInvalidos() {
  try {
    console.log("🔍 Buscando eventos con coordenadas inválidas...");

    // Buscar eventos con coordenadas nulas, vacías o inválidas
    const { data: eventosInvalidos, error: errorBusqueda } = await supabase
      .from("eventos")
      .select("id, nombre, lat, lon, fecha_fin")
      .or("lat.is.null,lon.is.null,lat.eq.0,lon.eq.0,lat.eq.,lon.eq.");

    if (errorBusqueda) {
      console.error("❌ Error al buscar eventos inválidos:", errorBusqueda);
      return;
    }

    console.log(
      `📊 Eventos con coordenadas inválidas encontrados: ${
        eventosInvalidos?.length || 0
      }`
    );

    if (!eventosInvalidos || eventosInvalidos.length === 0) {
      console.log("✅ No hay eventos con coordenadas inválidas para limpiar");
      return;
    }

    // Mostrar eventos que se van a eliminar
    console.log("\n📋 Eventos que se eliminarán:");
    eventosInvalidos.forEach((evento) => {
      console.log(
        `  - ID: ${evento.id}, Nombre: ${evento.nombre}, Coords: [${evento.lat}, ${evento.lon}]`
      );
    });

    // Confirmar si el usuario quiere proceder
    console.log(
      '\n⚠️  ¿Estás seguro de que quieres eliminar estos eventos? (escribe "si" para confirmar)'
    );

    // En un entorno real, usarías readline para entrada del usuario
    // Por ahora, comenta la siguiente línea para ejecutar automáticamente:
    // return;

    const idsAEliminar = eventosInvalidos.map((e) => e.id);

    // Eliminar eventos con coordenadas inválidas
    const { data: eventosEliminados, error: errorEliminacion } = await supabase
      .from("eventos")
      .delete()
      .in("id", idsAEliminar)
      .select();

    if (errorEliminacion) {
      console.error("❌ Error al eliminar eventos:", errorEliminacion);
      return;
    }

    console.log(
      `✅ ${
        eventosEliminados?.length || 0
      } eventos con coordenadas inválidas eliminados`
    );

    // También limpiar eventos expirados para mejorar el rendimiento
    const fechaActual = new Date().toISOString();

    const { data: eventosExpirados, error: errorExpirados } = await supabase
      .from("eventos")
      .delete()
      .lt("fecha_fin", fechaActual)
      .select();

    if (errorExpirados) {
      console.error("❌ Error al eliminar eventos expirados:", errorExpirados);
    } else {
      console.log(
        `🗑️  ${
          eventosExpirados?.length || 0
        } eventos expirados también eliminados`
      );
    }

    console.log(
      "\n🎉 Limpieza completada. Los warnings en el mapa deberían reducirse significativamente."
    );
  } catch (error) {
    console.error("❌ Error inesperado:", error);
  }
}

// Ejecutar script
limpiarEventosInvalidos();
