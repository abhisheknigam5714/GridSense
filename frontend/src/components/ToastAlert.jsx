import React, { useEffect, useState } from "react";

export const ToastAlert = ({
  show,
  message,
  variant = "success",
  onClose,
  duration = 4000,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const t = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(t);
    }
  }, [show, duration, onClose]);

  if (!show && !visible) return null;

  const config = {
    success: { bg: "linear-gradient(135deg, #10b981, #059669)", icon: "✅" },
    danger: { bg: "linear-gradient(135deg, #ef4444, #dc2626)", icon: "❌" },
    warning: { bg: "linear-gradient(135deg, #f59e0b, #d97706)", icon: "⚠️" },
    info: { bg: "linear-gradient(135deg, #3b82f6, #2563eb)", icon: "ℹ️" },
  }[variant] || { bg: "linear-gradient(135deg, #10b981, #059669)", icon: "✅" };

  return (
    <div
      style={{
        position: "fixed",
        top: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        maxWidth: "320px",
      }}
    >
      <div
        style={{
          background: config.bg,
          color: "#fff",
          borderRadius: "12px",
          padding: "0.9rem 1.2rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          animation: "slideIn 0.3s ease",
        }}
      >
        <span style={{ fontSize: "1.1rem" }}>{config.icon}</span>
        <span style={{ flex: 1, fontSize: "0.88rem", fontWeight: 500 }}>
          {message}
        </span>
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: "50%",
            width: 22,
            height: 22,
            cursor: "pointer",
            color: "#fff",
            fontSize: "0.7rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ToastAlert;
