-- 🔄 Script SQL para habilitar eventos en tiempo real
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear tabla para eventos en tiempo real
CREATE TABLE IF NOT EXISTS eventos_tiempo_real (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('evento_sorpresa_iniciado', 'evento_sorpresa_detenido')),
  activo BOOLEAN DEFAULT true,
  datos JSONB, -- Info del evento (ruta, mensaje, etc.)
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '10 minutes') -- Auto-expirar en 10 minutos
);

-- 2. Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_eventos_tiempo_real_tipo ON eventos_tiempo_real(tipo);
CREATE INDEX IF NOT EXISTS idx_eventos_tiempo_real_created_at ON eventos_tiempo_real(created_at);
CREATE INDEX IF NOT EXISTS idx_eventos_tiempo_real_expires_at ON eventos_tiempo_real(expires_at);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE eventos_tiempo_real ENABLE ROW LEVEL SECURITY;

-- 4. Política para que todos puedan leer eventos
CREATE POLICY "Todos pueden leer eventos tiempo real" ON eventos_tiempo_real
FOR SELECT USING (true);

-- 5. Política para que solo usuarios autenticados puedan crear eventos
-- OPCIONAL: Cambiar por ID específico si quieres más restricción
CREATE POLICY "Solo usuarios autenticados pueden crear eventos" ON eventos_tiempo_real
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 6. Función para limpiar eventos expirados automáticamente
CREATE OR REPLACE FUNCTION limpiar_eventos_expirados()
RETURNS void AS $$
BEGIN
  DELETE FROM eventos_tiempo_real 
  WHERE expires_at < NOW();
  
  -- Log de limpieza
  RAISE NOTICE 'Eventos expirados eliminados: %', FOUND;
END;
$$ LANGUAGE plpgsql;

-- 7. Habilitar Realtime para esta tabla
ALTER PUBLICATION supabase_realtime ADD TABLE eventos_tiempo_real;

-- 8. Verificar que todo está bien
SELECT 'Tabla configurada correctamente' as status;

-- 9. Mostrar eventos actuales (si los hay)
SELECT id, tipo, activo, datos, created_at, expires_at
FROM eventos_tiempo_real 
ORDER BY created_at DESC 
LIMIT 10;
