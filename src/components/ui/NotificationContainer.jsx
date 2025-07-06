import React, { useEffect, useState } from "react";
import "../../styles/notifications.css";

const NotificationContainer = ({ notifications, removeNotification }) => {
  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getNotificationClass = () => {
    let classes = `notification ${notification.type}`;

    if (isVisible && !isRemoving) {
      classes += " show animate-bounce";
    } else if (isRemoving) {
      classes += " hide";
    }

    if (notification.glass) {
      classes += " glass";
    }

    return classes;
  };

  const getIcon = () => {
    if (notification.icon) return notification.icon;

    switch (notification.type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      case "info":
        return "ℹ️";
      case "event-notification":
        return "🎉";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={getNotificationClass()}>
      <div className="notification-content">
        <div className="notification-icon">{getIcon()}</div>
        <div className="notification-text">
          {notification.title && (
            <div className="notification-title">{notification.title}</div>
          )}
          <div className="notification-message">{notification.message}</div>
        </div>
        <button
          className="notification-close"
          onClick={handleClose}
          aria-label="Cerrar notificación"
        >
          ×
        </button>
      </div>
      {notification.duration > 0 && (
        <div className="notification-progress"></div>
      )}
    </div>
  );
};

export default NotificationContainer;
