-- Verificar si existen las tablas necesarias
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name IN ('participantes_eventos', 'eventos', 'notificaciones', 'mensajes_evento')
ORDER BY table_name, ordinal_position;

-- Verificar específicamente la tabla participantes_eventos
SELECT * FROM participantes_eventos LIMIT 1;

-- Verificar eventos
SELECT * FROM eventos LIMIT 1;
