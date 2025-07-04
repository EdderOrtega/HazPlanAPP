-- Crear tabla de notificaciones
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  evento_id BIGINT REFERENCES eventos(id) ON DELETE CASCADE,
  tipo VARCHAR(50) NOT NULL, -- 'nuevo_participante', 'mensaje_evento', etc.
  titulo VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  datos JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de mensajes por evento
CREATE TABLE IF NOT EXISTS mensajes_evento (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  evento_id BIGINT REFERENCES eventos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor performance
CREATE INDEX IF NOT EXISTS idx_notificaciones_user_id ON notificaciones(user_id);
CREATE INDEX IF NOT EXISTS idx_notificaciones_leida ON notificaciones(leida);
CREATE INDEX IF NOT EXISTS idx_mensajes_evento_id ON mensajes_evento(evento_id);
CREATE INDEX IF NOT EXISTS idx_mensajes_created_at ON mensajes_evento(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_evento ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad para notificaciones
CREATE POLICY "Users can view their own notifications" ON notificaciones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON notificaciones
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications" ON notificaciones
  FOR INSERT WITH CHECK (true);

-- Políticas de seguridad para mensajes
CREATE POLICY "Users can view messages from events they participate in" ON mensajes_evento
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM eventos WHERE id = evento_id
      UNION
      SELECT user_id FROM participantes_eventos WHERE evento_id = mensajes_evento.evento_id
    )
  );

CREATE POLICY "Users can insert messages in events they participate in" ON mensajes_evento
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    auth.uid() IN (
      SELECT user_id FROM eventos WHERE id = evento_id
      UNION
      SELECT user_id FROM participantes_eventos WHERE evento_id = mensajes_evento.evento_id
    )
  );

-- Función para crear notificaciones automáticamente cuando alguien se une a un evento
CREATE OR REPLACE FUNCTION notificar_nuevo_participante()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificar al creador del evento
  INSERT INTO notificaciones (user_id, evento_id, tipo, titulo, mensaje, datos)
  SELECT 
    e.user_id,
    NEW.evento_id,
    'nuevo_participante',
    'Nuevo participante en tu evento',
    'Alguien se unió a tu evento "' || e.nombre || '"',
    jsonb_build_object(
      'participante_id', NEW.user_id,
      'evento_id', NEW.evento_id
    )
  FROM eventos e
  WHERE e.id = NEW.evento_id AND e.user_id != NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para crear notificaciones cuando hay un nuevo mensaje
CREATE OR REPLACE FUNCTION notificar_nuevo_mensaje()
RETURNS TRIGGER AS $$
BEGIN
  -- Notificar a todos los participantes del evento (excepto quien envió el mensaje)
  INSERT INTO notificaciones (user_id, evento_id, tipo, titulo, mensaje, datos)
  SELECT 
    p.user_id,
    NEW.evento_id,
    'mensaje_evento',
    'Nuevo mensaje en evento',
    'Hay un nuevo mensaje en "' || e.nombre || '"',
    jsonb_build_object(
      'remitente_id', NEW.user_id,
      'evento_id', NEW.evento_id,
      'mensaje_id', NEW.id
    )
  FROM participantes_eventos p
  JOIN eventos e ON e.id = NEW.evento_id
  WHERE p.evento_id = NEW.evento_id AND p.user_id != NEW.user_id;

  -- También notificar al creador del evento si no es quien envió el mensaje
  INSERT INTO notificaciones (user_id, evento_id, tipo, titulo, mensaje, datos)
  SELECT 
    e.user_id,
    NEW.evento_id,
    'mensaje_evento',
    'Nuevo mensaje en tu evento',
    'Hay un nuevo mensaje en tu evento "' || e.nombre || '"',
    jsonb_build_object(
      'remitente_id', NEW.user_id,
      'evento_id', NEW.evento_id,
      'mensaje_id', NEW.id
    )
  FROM eventos e
  WHERE e.id = NEW.evento_id AND e.user_id != NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers
DROP TRIGGER IF EXISTS trigger_notificar_nuevo_participante ON participantes_eventos;
CREATE TRIGGER trigger_notificar_nuevo_participante
  AFTER INSERT ON participantes_eventos
  FOR EACH ROW
  EXECUTE FUNCTION notificar_nuevo_participante();

DROP TRIGGER IF EXISTS trigger_notificar_nuevo_mensaje ON mensajes_evento;
CREATE TRIGGER trigger_notificar_nuevo_mensaje
  AFTER INSERT ON mensajes_evento
  FOR EACH ROW
  EXECUTE FUNCTION notificar_nuevo_mensaje();
