import { useState, useEffect } from 'react';

/**
 * A component for displaying notification messages to the user
 * @param {Object} props
 * @param {string} props.message - The message to display
 * @param {string} props.type - The type of notification ('success', 'error', 'info')
 * @param {number} props.duration - Duration in ms before auto-dismissing (0 for no auto-dismiss)
 * @param {Function} props.onDismiss - Callback function when notification is dismissed
 */
export function Notification({ message, type, duration = 3000, onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (duration > 0 && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onDismiss) onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, visible, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  if (!visible || !message) return null;

  return (
    <div className={`notification notification-${type}`}>
      <div className="notification-content">
        {message}
      </div>
      <button className="notification-dismiss" onClick={handleDismiss}>
        &times;
      </button>
    </div>
  );
}
