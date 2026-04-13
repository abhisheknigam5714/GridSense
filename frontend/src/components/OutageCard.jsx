import React from "react";
import { useAuth } from "../context/AuthContext";
import { outageAPI } from "../services/api";

const statusConfig = {
  REPORTED: {
    bg: "linear-gradient(135deg, #fef3c7, #fde68a)",
    border: "#f59e0b",
    badge: "#92400e",
    badgeBg: "#fef3c7",
    icon: "⚠️",
    label: "Reported",
  },
  CONFIRMED: {
    bg: "linear-gradient(135deg, #fee2e2, #fecaca)",
    border: "#ef4444",
    badge: "#7f1d1d",
    badgeBg: "#fee2e2",
    icon: "🔴",
    label: "Confirmed",
  },
  RESOLVED: {
    bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    border: "#10b981",
    badge: "#064e3b",
    badgeBg: "#d1fae5",
    icon: "✅",
    label: "Resolved",
  },
};

const OutageCard = ({ outage, onAction, showActions = true }) => {
  const { isAdmin } = useAuth();
  const config = statusConfig[outage.status] || statusConfig.REPORTED;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirm = async () => {
    try {
      await outageAPI.confirm(outage.id);
      if (onAction) onAction("confirmed");
    } catch (error) {
      if (onAction) onAction("error", "Failed to confirm outage");
    }
  };

  const handleResolve = async () => {
    try {
      await outageAPI.resolve(outage.id);
      if (onAction) onAction("resolved");
    } catch (error) {
      if (onAction) onAction("error", "Failed to resolve outage");
    }
  };

  return (
    <div
      style={{
        background: "#1e293b",
        border: `1px solid ${config.border}`,
        borderLeft: `4px solid ${config.border}`,
        borderRadius: "12px",
        padding: "1rem 1.25rem",
        marginBottom: "0.75rem",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <h5
            style={{
              color: "#f1f5f9",
              fontWeight: 600,
              margin: 0,
              fontSize: "1rem",
            }}
          >
            📍 {outage.locality}
          </h5>
          <p
            style={{ color: "#94a3b8", fontSize: "0.82rem", margin: "3px 0 0" }}
          >
            📮 Pincode:{" "}
            <strong style={{ color: "#cbd5e1" }}>{outage.pincode}</strong>
          </p>
        </div>
        <span
          style={{
            background: config.badgeBg,
            color: config.badge,
            border: `1px solid ${config.border}`,
            borderRadius: "20px",
            padding: "3px 10px",
            fontSize: "0.78rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
          }}
        >
          {config.icon} {config.label}
        </span>
      </div>

      <p
        style={{
          color: "#94a3b8",
          fontSize: "0.88rem",
          margin: "0.5rem 0",
          lineHeight: 1.5,
        }}
      >
        {outage.description || "No description provided."}
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          paddingTop: "0.6rem",
          marginTop: "0.6rem",
          flexWrap: "wrap",
          gap: "4px",
        }}
      >
        <small style={{ color: "#64748b", fontSize: "0.78rem" }}>
          🕐 Reported: {formatDate(outage.reportedAt)}
        </small>
        {outage.confirmedAt && (
          <small style={{ color: "#64748b", fontSize: "0.78rem" }}>
            ✔️ Confirmed: {formatDate(outage.confirmedAt)}
          </small>
        )}
      </div>

      {showActions && isAdmin() && outage.status !== "RESOLVED" && (
        <div style={{ display: "flex", gap: "8px", marginTop: "0.75rem" }}>
          {outage.status === "REPORTED" && (
            <button
              onClick={handleConfirm}
              style={{
                flex: 1,
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                color: "#1a1a1a",
                border: "none",
                borderRadius: "8px",
                padding: "0.4rem 0.75rem",
                fontWeight: 600,
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              ✔ Confirm Outage
            </button>
          )}
          <button
            onClick={handleResolve}
            style={{
              flex: 1,
              background: "linear-gradient(135deg, #10b981, #059669)",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "0.4rem 0.75rem",
              fontWeight: 600,
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            ✅ Mark Resolved
          </button>
        </div>
      )}
    </div>
  );
};

export default OutageCard;
