-- 🚀 Script SQL SIMPLIFICADO para eventos en tiempo real
-- Copia LÍNEA POR LÍNEA en el SQL Editor de Supabase

-- 1. Crear tabla (SI NO EXISTE)
CREATE TABLE IF NOT EXISTS eventos_tiempo_real (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  tipo text NOT NULL,
  activo boolean DEFAULT true,
  datos jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- 2. Habilitar RLS (copiar y ejecutar por separado)
ALTER TABLE eventos_tiempo_real ENABLE ROW LEVEL SECURITY;

-- 3. Política de lectura (copiar y ejecutar por separado)
CREATE POLICY "Permitir lectura a todos" ON eventos_tiempo_real
FOR SELECT USING (true);

-- 4. Política de inserción (copiar y ejecutar por separado)
CREATE POLICY "Permitir inserción a usuarios autenticados" ON eventos_tiempo_real
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Habilitar Realtime (copiar y ejecutar por separado)
ALTER PUBLICATION supabase_realtime ADD TABLE eventos_tiempo_real;

-- 6. Verificar que todo funciona (copiar y ejecutar por separado)
SELECT 'Configuración completada exitosamente' as status;

-- 7. Ver eventos actuales (opcional)
SELECT * FROM eventos_tiempo_real ORDER BY created_at DESC LIMIT 5;
