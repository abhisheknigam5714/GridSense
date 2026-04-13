import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { outageAPI, adminAPI } from "../services/api";
import AdminTable from "../components/AdminTable";
import ToastAlert from "../components/ToastAlert";

const inputStyle = {
  width: "100%",
  background: "#0f172a",
  color: "#f1f5f9",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "0.55rem 0.85rem",
  fontSize: "0.88rem",
  outline: "none",
  boxSizing: "border-box",
  marginBottom: "0.75rem",
};

const labelStyle = {
  color: "#94a3b8",
  fontSize: "0.8rem",
  fontWeight: 600,
  display: "block",
  marginBottom: "4px",
};

const Admin = () => {
  const { user } = useAuth();

  const [stats, setStats] = useState({
    totalReported: 0,
    todayReported: 0,
    todayConfirmed: 0,
    todayResolved: 0,
  });

  const [alertForm, setAlertForm] = useState({
    pincode: "",
    locality: "",
    startTime: "",
    duration: "",
    message: "",
  });

  const [alertLoading, setAlertLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success",
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const response = await outageAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleAlertChange = (e) => {
    const { name, value } = e.target;
    setAlertForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendAlert = async () => {
    const { pincode, startTime, duration, message } = alertForm;

    if (!pincode || !startTime || !duration || !message) {
      showToast(
        "Please fill pincode, start time, duration and message",
        "warning",
      );
      return;
    }

    try {
      setAlertLoading(true);
      const response = await adminAPI.sendMaintenanceAlert(alertForm);
      showToast(
        `✅ Alert sent to ${response.data.usersNotified} users in pincode ${response.data.pincode}`,
        "success",
      );
      setAlertForm({
        pincode: "",
        locality: "",
        startTime: "",
        duration: "",
        message: "",
      });
    } catch (err) {
      const msg =
        err.response?.data?.message || "Failed to send alert. Try again.";
      showToast(msg, "danger");
    } finally {
      setAlertLoading(false);
    }
  };

  const showToast = (message, variant = "success") => {
    setToast({ show: true, message, variant });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const handleTableAction = (action) => {
    showToast(`Outage ${action} successfully`);
    fetchStats();
  };

  const statCards = [
    {
      label: "Total Reports",
      value: stats.totalReported,
      icon: "⚡",
      color: "#3b82f6",
      bg: "rgba(59,130,246,0.12)",
    },
    {
      label: "Today Reported",
      value: stats.todayReported,
      icon: "🕐",
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.12)",
    },
    {
      label: "Today Confirmed",
      value: stats.todayConfirmed,
      icon: "🔴",
      color: "#ef4444",
      bg: "rgba(239,68,68,0.12)",
    },
    {
      label: "Today Resolved",
      value: stats.todayResolved,
      icon: "✅",
      color: "#10b981",
      bg: "rgba(16,185,129,0.12)",
    },
  ];

  return (
    <div
      style={{ background: "#0b1120", minHeight: "100vh", padding: "2rem 0" }}
    >
      <ToastAlert
        show={toast.show}
        message={toast.message}
        variant={toast.variant}
        onClose={hideToast}
      />

      <div className="container">
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.75rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h4 style={{ color: "#f1f5f9", fontWeight: 700, margin: 0 }}>
              ⚙️ Admin Dashboard
            </h4>
            <p
              style={{
                color: "#64748b",
                margin: "4px 0 0",
                fontSize: "0.88rem",
              }}
            >
              Manage outages and send maintenance alerts
            </p>
          </div>
          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid #1e3a5f",
              borderRadius: "10px",
              padding: "0.5rem 1rem",
              textAlign: "right",
            }}
          >
            <div style={{ color: "#64748b", fontSize: "0.75rem" }}>
              Logged in as
            </div>
            <div
              style={{ color: "#f59e0b", fontSize: "0.88rem", fontWeight: 600 }}
            >
              {user?.email}
            </div>
          </div>
        </div>

        {/* ── Stat Cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "1.75rem",
          }}
        >
          {statCards.map((card) => (
            <div
              key={card.label}
              style={{
                background: "#1e293b",
                border: `1px solid ${card.color}30`,
                borderRadius: "12px",
                padding: "1.1rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <div
                style={{
                  background: card.bg,
                  borderRadius: "10px",
                  width: 46,
                  height: 46,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 800,
                    color: card.color,
                    lineHeight: 1,
                  }}
                >
                  {statsLoading ? "—" : (card.value ?? 0)}
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "0.78rem",
                    marginTop: 3,
                  }}
                >
                  {card.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Maintenance Alert Form ── */}
        <div
          style={{
            background: "#1e293b",
            border: "1px solid #f59e0b50",
            borderLeft: "4px solid #f59e0b",
            borderRadius: "14px",
            marginBottom: "1.75rem",
            overflow: "hidden",
          }}
        >
          {/* Form Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #1a1a2e, #16213e)",
              padding: "1rem 1.25rem",
              borderBottom: "1px solid #334155",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🔔</span>
            <div>
              <div
                style={{
                  color: "#f59e0b",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                }}
              >
                Send Maintenance Alert
              </div>
              <div style={{ color: "#64748b", fontSize: "0.78rem" }}>
                Notify all registered users of a planned power outage in an area
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div style={{ padding: "1.25rem" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0 1rem",
              }}
            >
              <div>
                <label style={labelStyle}>
                  📮 Pincode <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  name="pincode"
                  value={alertForm.pincode}
                  onChange={handleAlertChange}
                  placeholder="e.g. 482001"
                  maxLength={10}
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "#334155")}
                />
              </div>

              <div>
                <label style={labelStyle}>📍 Locality (optional)</label>
                <input
                  style={inputStyle}
                  type="text"
                  name="locality"
                  value={alertForm.locality}
                  onChange={handleAlertChange}
                  placeholder="e.g. Civil Lines"
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "#334155")}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  🕐 Start Time <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  name="startTime"
                  value={alertForm.startTime}
                  onChange={handleAlertChange}
                  placeholder="e.g. 2:00 PM"
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "#334155")}
                />
              </div>

              <div>
                <label style={labelStyle}>
                  ⏱️ Duration <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  style={inputStyle}
                  type="text"
                  name="duration"
                  value={alertForm.duration}
                  onChange={handleAlertChange}
                  placeholder="e.g. 2 hours"
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "#334155")}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>
                📝 Message to Users <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <textarea
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  minHeight: "80px",
                  marginBottom: "1rem",
                }}
                name="message"
                value={alertForm.message}
                onChange={handleAlertChange}
                placeholder="e.g. Transformer maintenance work. Please store water and charge devices in advance."
                onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                onBlur={(e) => (e.target.style.borderColor = "#334155")}
              />
            </div>

            <button
              onClick={handleSendAlert}
              disabled={alertLoading}
              style={{
                background: alertLoading
                  ? "#334155"
                  : "linear-gradient(135deg, #f59e0b, #d97706)",
                color: alertLoading ? "#64748b" : "#1a1a1a",
                border: "none",
                borderRadius: "9px",
                padding: "0.65rem 1.75rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: alertLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {alertLoading ? (
                <>⏳ Sending Alert...</>
              ) : (
                <>🚨 Send Alert to All Users</>
              )}
            </button>
          </div>
        </div>

        {/* ── Admin Table ── */}
        <div
          style={{
            background: "#1e293b",
            border: "1px solid #1e3a5f",
            borderRadius: "14px",
            padding: "1.25rem",
          }}
        >
          <AdminTable onAction={handleTableAction} />
        </div>
      </div>
    </div>
  );
};

export default Admin;
