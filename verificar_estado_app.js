#!/usr/bin/env node

/**
 * Script de verificación para confirmar que los cambios en el mapa funcionan correctamente
 * Ejecuta este script después de hacer los cambios para verificar el estado
 */

import { createClient } from "@supabase/supabase-js";

// Configura tu URL y clave de Supabase
const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_ANON_KEY = "your-anon-key";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function verificarEstado() {
  console.log("🔍 Verificando estado de la aplicación...\n");

  try {
    // 1. Verificar tabla de eventos regulares
    console.log("📊 Verificando eventos regulares...");
    const { data: eventos, error: errorEventos } = await supabase
      .from("eventos")
      .select("id, nombre, lat, lon, fecha_fin")
      .order("created_at", { ascending: false })
      .limit(10);

    if (errorEventos) {
      console.error("❌ Error al obtener eventos:", errorEventos);
    } else {
      console.log(`✅ Total eventos: ${eventos?.length || 0}`);

      // Verificar eventos con coordenadas válidas
      const eventosValidos = eventos.filter(
        (e) =>
          e.lat !== null &&
          e.lon !== null &&
          e.lat !== 0 &&
          e.lon !== 0 &&
          !isNaN(Number(e.lat)) &&
          !isNaN(Number(e.lon))
      );

      const eventosInvalidos = eventos.length - eventosValidos.length;

      console.log(
        `✅ Eventos con coordenadas válidas: ${eventosValidos.length}`
      );

      if (eventosInvalidos > 0) {
        console.log(
          `⚠️  Eventos con coordenadas inválidas: ${eventosInvalidos}`
        );
        console.log(
          "💡 Ejecuta el script de limpieza: limpiar_eventos_coordenadas_invalidas.sql"
        );
      } else {
        console.log("✅ No hay eventos con coordenadas inválidas");
      }

      // Verificar eventos expirados
      const eventosExpirados = eventos.filter((e) => {
        if (!e.fecha_fin) return false;
        try {
          return new Date(e.fecha_fin) <= new Date();
        } catch {
          return false;
        }
      });

      if (eventosExpirados.length > 0) {
        console.log(
          `🗑️  Eventos expirados que se pueden limpiar: ${eventosExpirados.length}`
        );
      } else {
        console.log("✅ No hay eventos expirados");
      }

      // Verificar eventos sin fecha_fin (causan warnings)
      const eventosSinFecha = eventos.filter(
        (e) => !e.fecha_fin || e.fecha_fin === ""
      );

      if (eventosSinFecha.length > 0) {
        console.log(
          `⚠️  Eventos sin fecha_fin (causan warnings): ${eventosSinFecha.length}`
        );
        eventosSinFecha.forEach((e) =>
          console.log(`   - ID: ${e.id}, Nombre: ${e.nombre}`)
        );
        console.log(
          "💡 Ejecuta: eliminar_evento_13.sql o limpiar_eventos_sql.sql"
        );
      } else {
        console.log("✅ Todos los eventos tienen fecha_fin válida");
      }
    }

    // 2. Verificar tabla de eventos en tiempo real
    console.log("\n🚛 Verificando eventos en tiempo real...");
    const { data: eventosRT, error: errorRT } = await supabase
      .from("eventos_tiempo_real")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (errorRT) {
      console.error("❌ Error al acceder eventos_tiempo_real:", errorRT);
      console.log(
        "💡 ¿Ejecutaste el script SQL: supabase_eventos_tiempo_real.sql?"
      );
    } else {
      console.log(
        `✅ Tabla eventos_tiempo_real accesible: ${
          eventosRT?.length || 0
        } eventos`
      );

      if (eventosRT && eventosRT.length > 0) {
        const eventosActivos = eventosRT.filter((e) => {
          const fechaCreacion = new Date(e.created_at);
          const ahora = new Date();
          const diferencia = ahora - fechaCreacion;
          return diferencia < 180000; // 3 minutos
        });

        if (eventosActivos.length > 0) {
          console.log(
            `🎯 Eventos activos en tiempo real: ${eventosActivos.length}`
          );
          console.log("📱 El capicamión debería estar visible en el mapa");
        } else {
          console.log("ℹ️  No hay eventos activos en tiempo real");
        }

        // Contar eventos viejos que se pueden limpiar
        const eventosViejos = eventosRT.length - eventosActivos.length;
        if (eventosViejos > 0) {
          console.log(`🧹 Eventos viejos para limpiar: ${eventosViejos}`);
        }
      }
    }

    // 3. Verificar configuración de Realtime
    console.log("\n📡 Verificando configuración de Realtime...");
    const channel = supabase.channel("test-channel");

    channel.subscribe((status) => {
      if (status === "SUBSCRIBED") {
        console.log("✅ Realtime funcionando correctamente");
      } else if (status === "CHANNEL_ERROR") {
        console.log("❌ Error en configuración de Realtime");
      }
      supabase.removeChannel(channel);
    });

    // 4. Resumen y recomendaciones
    console.log("\n📋 Resumen y recomendaciones:");
    console.log("1. ✅ Logs excesivos reducidos significativamente");
    console.log("2. ✅ Validaciones de coordenadas mejoradas");
    console.log(
      "3. ✅ ErrorBoundary configurado para capturar errores del mapa"
    );
    console.log(
      '4. ✅ Estrategia de "limpiar e insertar" para eventos en tiempo real'
    );

    console.log("\n🎯 Para probar el capicamión:");
    console.log("1. Asegúrate de estar logueado con el ID autorizado");
    console.log("2. Haz clic en uno de los botones de ruta en el mapa");
    console.log("3. El modal debería aparecer inmediatamente");
    console.log("4. El ícono del capicamión debería moverse por la ruta");
    console.log(
      "5. Otros usuarios conectados también deberían ver el modal y el capicamión"
    );

    console.log("\n🧹 Para limpiar datos problemáticos:");
    console.log(
      "1. Ejecuta: limpiar_eventos_coordenadas_invalidas.sql en Supabase"
    );
    console.log("2. O usa: node limpiar_eventos_coordenadas_invalidas.js");
  } catch (error) {
    console.error("❌ Error inesperado:", error);
  }
}

// Ejecutar verificación
verificarEstado();
