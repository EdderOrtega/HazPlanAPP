// 🔧 Script de diagnóstico para eventos en tiempo real
// Copia y pega este código en la consola del navegador cuando estés en tu app

console.log("🔧 Iniciando diagnóstico de eventos en tiempo real...");

async function diagnosticarSupabase() {
  try {
    // Verificar si supabase está disponible
    if (typeof supabase === "undefined") {
      console.error(
        "❌ Variable 'supabase' no encontrada. ¿Está importada correctamente?"
      );
      return;
    }

    console.log("✅ Cliente Supabase encontrado");

    // 1. Verificar autenticación
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      console.error("❌ Error de autenticación:", userError);
      return;
    }

    if (!userData.user) {
      console.warn("⚠️ Usuario no autenticado. Debes hacer login.");
      return;
    }

    console.log("✅ Usuario autenticado:", userData.user.id);

    // 2. Verificar si la tabla existe
    console.log("🔍 Verificando tabla eventos_tiempo_real...");

    const { data: tablaData, error: tablaError } = await supabase
      .from("eventos_tiempo_real")
      .select("id")
      .limit(1);

    if (tablaError) {
      console.error("❌ Error al acceder a la tabla:", tablaError);
      console.log(
        "💡 Solución: Ejecuta el script SQL 'supabase_eventos_tiempo_real.sql' en el SQL Editor de Supabase"
      );
      return;
    }

    console.log("✅ Tabla eventos_tiempo_real accesible");

    // 3. Probar inserción
    console.log("🧪 Probando inserción de evento de prueba...");

    const eventoPrueba = {
      tipo: "evento_sorpresa_iniciado",
      activo: true,
      datos: {
        ruta: "ruta1",
        test: true,
        timestamp: new Date().toISOString(),
      },
    };

    const { data: insertData, error: insertError } = await supabase
      .from("eventos_tiempo_real")
      .insert(eventoPrueba)
      .select();

    if (insertError) {
      console.error("❌ Error al insertar evento de prueba:", insertError);

      if (insertError.code === "42501") {
        console.log(
          "💡 Error de permisos RLS. Verifica las políticas en Supabase:"
        );
        console.log("   - Ve a Authentication > Policies");
        console.log(
          "   - Asegúrate de que la tabla eventos_tiempo_real tenga políticas"
        );
        console.log("   - Política INSERT debe permitir usuarios autenticados");
      }

      return;
    }

    console.log("✅ Evento de prueba insertado exitosamente:", insertData);

    // 4. Verificar Realtime
    console.log("📡 Verificando conexión Realtime...");

    const channel = supabase
      .channel("test-diagnostico")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "eventos_tiempo_real",
        },
        (payload) => {
          console.log("✅ Realtime funcionando! Evento recibido:", payload);
        }
      )
      .subscribe((status) => {
        console.log("📡 Estado de suscripción Realtime:", status);
      });

    // Limpiar después de 5 segundos
    setTimeout(() => {
      supabase.removeChannel(channel);
      console.log("🧹 Canal de prueba cerrado");
    }, 5000);

    console.log("✅ Diagnóstico completado exitosamente!");
    console.log("🎉 Tu configuración está lista para eventos en tiempo real");
  } catch (error) {
    console.error("❌ Error durante el diagnóstico:", error);
  }
}

// Función para limpiar eventos de prueba
async function limpiarEventosPrueba() {
  try {
    const { data, error } = await supabase
      .from("eventos_tiempo_real")
      .delete()
      .eq("datos->test", true);

    if (error) {
      console.error("❌ Error al limpiar eventos de prueba:", error);
    } else {
      console.log("🧹 Eventos de prueba eliminados:", data);
    }
  } catch (error) {
    console.error("❌ Error al limpiar:", error);
  }
}

// Ejecutar diagnóstico automáticamente
diagnosticarSupabase();

// Exponer funciones para uso manual
window.diagnosticoSupabase = {
  verificar: diagnosticarSupabase,
  limpiar: limpiarEventosPrueba,
};

console.log(`
🎯 FUNCIONES DISPONIBLES:
- diagnosticoSupabase.verificar() - Ejecutar diagnóstico completo
- diagnosticoSupabase.limpiar() - Eliminar eventos de prueba

📋 CHECKLIST SI HAY ERRORES:
1. ✅ ¿Ejecutaste el script SQL en Supabase?
2. ✅ ¿Está habilitado Realtime en tu proyecto?
3. ✅ ¿Estás logueado en la aplicación?
4. ✅ ¿Las políticas RLS están configuradas?
5. ✅ ¿El USER ID autorizado está actualizado?
`);
