/**
 * Script para diagnosticar problemas de conexión Realtime con Supabase
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ogajfqpqkduvgpiqwhcx.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nYWpmcXBxa2R1dmdwaXF3aGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkxODgzMzYsImV4cCI6MjA2NDc2NDMzNn0.RiNoXPXuh6Os5Pc0YNXOhjLkS4sLFiyu0dKnwOv2E-Q";

const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

console.log("🔍 Iniciando diagnóstico de Realtime...");

// Función para diagnosticar la conexión
async function diagnosticarRealtime() {
  try {
    // 1. Verificar estado básico del cliente
    console.log("📊 Estado del cliente Supabase:", {
      url: supabase.supabaseUrl,
      key: supabase.supabaseKey.substring(0, 20) + "...",
      realtime: !!supabase.realtime,
    });

    // 2. Verificar conectividad básica con una consulta
    console.log("🌐 Probando conectividad básica...");
    const { error } = await supabase
      .from("eventos_tiempo_real")
      .select("*")
      .limit(1);

    if (error) {
      console.error("❌ Error en consulta básica:", error);
    } else {
      console.log("✅ Consulta básica exitosa");
    }

    // 3. Verificar estado de Realtime
    console.log("🔄 Estado inicial de Realtime:");
    const channel = supabase.channel("test-diagnostico");

    console.log("📡 Detalles del canal:", {
      state: channel.state,
      topic: channel.topic,
      params: channel.params,
    });

    // 4. Intentar suscribirse a eventos
    console.log("📻 Intentando suscribirse a eventos de tiempo real...");

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "eventos_tiempo_real",
        },
        (payload) => {
          console.log("📨 Evento recibido:", payload);
        }
      )
      .on("presence", { event: "sync" }, () => {
        console.log("👥 Presence sync");
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("👋 Usuario conectado:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("👋 Usuario desconectado:", key, leftPresences);
      })
      .subscribe((status, err) => {
        console.log("🔌 Estado de suscripción:", status);
        if (err) {
          console.error("❌ Error en suscripción:", err);
        }
      });

    // 5. Monitorear cambios de estado
    let estadoAnterior = channel.state;
    const intervalEstado = setInterval(() => {
      if (channel.state !== estadoAnterior) {
        console.log(
          `🔄 Cambio de estado: ${estadoAnterior} → ${channel.state}`
        );
        estadoAnterior = channel.state;
      }
    }, 1000);

    // 6. Intentar insertar un evento de prueba después de unos segundos
    setTimeout(async () => {
      console.log("🧪 Insertando evento de prueba...");
      try {
        const { error: insertError } = await supabase
          .from("eventos_tiempo_real")
          .insert({
            tipo: "test",
            coordenadas: { lat: -33.4489, lng: -70.6693 },
            usuario_id: "test-diagnostico",
            activo: true,
          });

        if (insertError) {
          console.error("❌ Error al insertar evento de prueba:", insertError);
        } else {
          console.log("✅ Evento de prueba insertado");
        }
      } catch (err) {
        console.error("❌ Error en inserción:", err);
      }
    }, 3000);

    // 7. Verificar logs del servidor después de un tiempo
    setTimeout(() => {
      console.log("📊 Estado final del canal:", {
        state: channel.state,
        topic: channel.topic,
        joinedAt: channel.joinedAt,
        timeout: channel.timeout,
      });

      // Limpiar
      clearInterval(intervalEstado);
      channel.unsubscribe();
      console.log("🧹 Diagnóstico completado");
    }, 10000);
  } catch (error) {
    console.error("💥 Error general en diagnóstico:", error);
  }
}

// Ejecutar diagnóstico
diagnosticarRealtime();
