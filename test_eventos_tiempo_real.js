// 🧪 Script de prueba para validar eventos en tiempo real
// Ejecutar en la consola del navegador o como script separado

console.log("🧪 Iniciando pruebas de eventos en tiempo real...");

// ====== INSTRUCCIONES DE PRUEBA ======
console.log(`
📋 INSTRUCCIONES PARA PROBAR LA FUNCIONALIDAD:

1️⃣ PREPARACIÓN:
   - Asegúrate de que la tabla eventos_tiempo_real está creada en Supabase
   - Ejecuta el script SQL supabase_eventos_tiempo_real.sql
   - Despliega la app en Vercel
   - Obtén tu USER ID desde Supabase Auth

2️⃣ CONFIGURACIÓN:
   - Actualiza vehiculoIdAutorizado en Mapa.jsx con tu USER ID real
   - Confirma que Supabase Realtime está habilitado en tu proyecto

3️⃣ PRUEBA PRINCIPAL (Modal solo para usuarios conectados):
   
   A) Conecta Usuario 1 en la app
   B) Conecta Usuario 2 en otra pestaña/dispositivo
   C) Usuario 1 (autorizado) hace clic en "Universidad → Macroplaza"
   D) ✅ RESULTADO: Ambos usuarios VEN el modal inmediatamente
   E) ✅ RESULTADO: El camión empieza a moverse en ambos mapas
   
4️⃣ PRUEBA CRÍTICA (NO modal para usuarios tardíos):
   
   A) Usuario 1 activa un recorrido
   B) Esperar 15-20 segundos
   C) Usuario 3 se conecta DESPUÉS de que empezó el evento
   D) ✅ RESULTADO: Usuario 3 NO ve modal sorpresa
   E) ✅ RESULTADO: Usuario 3 SÍ ve el camión moviéndose (progreso actual)

5️⃣ LOGS DE DEPURACIÓN:
   - Abre DevTools → Console en cada navegador
   - Busca estos mensajes:
     * "🔔 Configurando listener de eventos en tiempo real..."
     * "🎉 ¡Evento sorpresa iniciado globalmente!"
     * "✅ Evento dentro de ventana de tiempo - Mostrando modal"
     * "⏰ Evento demasiado antiguo - Solo activando recorrido sin modal"

6️⃣ COMANDOS DE DEPURACIÓN (Consola del navegador):
`);

// Función para verificar estado actual
window.debugEventos = async function () {
  try {
    console.log("🔍 Verificando eventos en tiempo real...");

    const { data, error } = await supabase
      .from("eventos_tiempo_real")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5);

    if (error) {
      console.error("❌ Error:", error);
      return;
    }

    console.log("📊 Últimos 5 eventos:", data);

    // Verificar eventos activos
    const eventosActivos = data.filter(
      (e) =>
        e.tipo === "evento_sorpresa_iniciado" &&
        new Date() - new Date(e.created_at) < 180000 // 3 minutos
    );

    console.log("🎯 Eventos activos:", eventosActivos);

    if (eventosActivos.length > 0) {
      const ultimo = eventosActivos[0];
      const tiempo = new Date() - new Date(ultimo.created_at);
      console.log(`⏰ Tiempo desde último evento: ${tiempo}ms`);
      console.log(`🚛 Ruta activa: ${ultimo.datos?.ruta || "no especificada"}`);
    }
  } catch (error) {
    console.error("❌ Error al verificar eventos:", error);
  }
};

// Función para simular evento (solo para testing)
window.simularEvento = async function (ruta = "ruta1") {
  try {
    console.log(`🎯 Simulando evento para ruta: ${ruta}`);

    const { error } = await supabase.from("eventos_tiempo_real").insert({
      tipo: "evento_sorpresa_iniciado",
      activo: true,
      datos: {
        ruta: ruta,
        test: true,
        timestamp: new Date().toISOString(),
      },
    });

    if (error) {
      console.error("❌ Error al simular evento:", error);
    } else {
      console.log("✅ Evento simulado exitosamente");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Función para limpiar eventos de prueba
window.limpiarEventos = async function () {
  try {
    console.log("🧹 Limpiando eventos de prueba...");

    const { error } = await supabase
      .from("eventos_tiempo_real")
      .delete()
      .eq("datos->>test", "true");

    if (error) {
      console.error("❌ Error al limpiar:", error);
    } else {
      console.log("✅ Eventos de prueba eliminados");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

console.log(`
🛠️ FUNCIONES DISPONIBLES EN CONSOLA:
- debugEventos()     // Ver estado actual
- simularEvento()    // Simular evento para pruebas
- limpiarEventos()   // Limpiar eventos de prueba

🎯 ESCENARIOS DE PRUEBA:

ESCENARIO 1: Usuarios conectados simultáneamente
- Ambos ven modal ✅
- Ambos ven animación ✅

ESCENARIO 2: Usuario se conecta después (tardío)
- NO ve modal ❌
- SÍ ve camión en progreso ✅

ESCENARIO 3: Detener recorrido
- Camión se detiene en todos los dispositivos ✅
- Modal se cierra si está abierto ✅

⚠️ NOTAS IMPORTANTES:
- La ventana de tiempo es de 10 segundos (configurable)
- Los eventos expiran automáticamente en 10 minutos
- Solo usuarios autorizados pueden iniciar eventos
- El progreso se calcula automáticamente para usuarios tardíos
`);

// Verificar dependencias
if (typeof supabase === "undefined") {
  console.warn("⚠️ supabase no está disponible. Asegúrate de estar en la app.");
} else {
  console.log("✅ Supabase client disponible");
}

console.log("🧪 Script de prueba cargado correctamente");
