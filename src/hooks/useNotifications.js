import { useState, useCallback } from "react";

// Hook para gestionar notificaciones
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  const addNotification = useCallback(
    (notification) => {
      const id = Date.now() + Math.random();
      const newNotification = {
        id,
        type: "info",
        duration: 5000,
        ...notification,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto-remove notification
      if (newNotification.duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, newNotification.duration);
      }

      return id;
    },
    [removeNotification]
  );

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helpers para diferentes tipos
  const success = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: "success",
        title: "Éxito",
        message,
        icon: "✅",
        ...options,
      });
    },
    [addNotification]
  );

  const error = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: "error",
        title: "Error",
        message,
        icon: "❌",
        duration: 7000, // Errores duran más
        ...options,
      });
    },
    [addNotification]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: "warning",
        title: "Advertencia",
        message,
        icon: "⚠️",
        ...options,
      });
    },
    [addNotification]
  );

  const info = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: "info",
        title: "Información",
        message,
        icon: "ℹ️",
        ...options,
      });
    },
    [addNotification]
  );

  const eventNotification = useCallback(
    (message, options = {}) => {
      return addNotification({
        type: "event-notification",
        title: "Evento",
        message,
        icon: "🎉",
        duration: 6000,
        ...options,
      });
    },
    [addNotification]
  );

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    success,
    error,
    warning,
    info,
    eventNotification,
  };
};
