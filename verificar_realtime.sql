-- 🔧 SCRIPT PARA VERIFICAR Y ARREGLAR REALTIME

-- 1. Verificar si la tabla está en la publication de Realtime
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- 2. Si NO aparece eventos_tiempo_real, ejecutar esto:
ALTER PUBLICATION supabase_realtime ADD TABLE eventos_tiempo_real;

-- 3. Verificar nuevamente
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime' AND tablename = 'eventos_tiempo_real';

-- 4. Ver eventos recientes para debug
SELECT id, tipo, activo, datos, created_at 
FROM eventos_tiempo_real 
ORDER BY created_at DESC 
LIMIT 5;

-- 5. Insertar evento de prueba (opcional)
INSERT INTO eventos_tiempo_real (tipo, activo, datos) 
VALUES ('evento_sorpresa_iniciado', true, '{"ruta": "ruta1", "test": true}');

-- 6. Ver el evento insertado
SELECT * FROM eventos_tiempo_real WHERE datos->>'test' = 'true';
