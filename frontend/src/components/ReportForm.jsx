import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { outageAPI } from "../services/api";

const ReportForm = ({ onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    pincode: user?.pincode || "",
    locality: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await outageAPI.report(formData);
      setSuccess(true);
      setFormData({
        pincode: user?.pincode || "",
        locality: "",
        description: "",
      });
      if (onSubmit) setTimeout(() => onSubmit(formData), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to submit report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#0f172a",
    color: "#f1f5f9",
    border: "1px solid #334155",
    borderRadius: "8px",
    padding: "0.6rem 0.9rem",
    fontSize: "0.92rem",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
  };
  const labelStyle = {
    color: "#94a3b8",
    fontSize: "0.85rem",
    fontWeight: 600,
    marginBottom: "6px",
    display: "block",
  };
  const hintStyle = { color: "#475569", fontSize: "0.78rem", marginTop: "4px" };

  if (success) {
    return (
      <div
        style={{
          background: "#1e293b",
          border: "1px solid #10b981",
          borderRadius: "16px",
          padding: "2.5rem",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
        <h5
          style={{ color: "#10b981", fontWeight: 700, marginBottom: "0.5rem" }}
        >
          Outage Reported Successfully!
        </h5>
        <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
          Thank you for reporting. We will look into it immediately.
        </p>
        <button
          onClick={() => setSuccess(false)}
          style={{
            background: "linear-gradient(135deg, #10b981, #059669)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.6rem 1.5rem",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          + Report Another Outage
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: "16px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a2e, #16213e)",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid #334155",
        }}
      >
        <h5
          style={{
            color: "#f1f5f9",
            fontWeight: 700,
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>⚡</span>
          Report Power Outage
        </h5>
        <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "4px 0 0" }}>
          Help your community by reporting a power outage in your area
        </p>
      </div>

      <div style={{ padding: "1.5rem" }}>
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid #ef4444",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              color: "#fca5a5",
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>
              📮 Pincode <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              placeholder="e.g. 482001"
              pattern="[0-9]{6}"
              maxLength="6"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#334155")}
            />
            <p style={hintStyle}>6-digit postal code</p>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>
              📍 Locality <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <input
              type="text"
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              placeholder="e.g. Napier Town, Civil Lines"
              required
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#334155")}
            />
            <p style={hintStyle}>Your area or neighbourhood name</p>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>📝 Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Describe the outage — since when, any updates, etc."
              style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#334155")}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                background: loading
                  ? "#334155"
                  : "linear-gradient(135deg, #f59e0b, #ef4444)",
                color: loading ? "#64748b" : "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "0.7rem",
                fontWeight: 700,
                fontSize: "0.92rem",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? "⏳ Submitting..." : "🚨 Submit Outage Report"}
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                style={{
                  background: "transparent",
                  color: "#94a3b8",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  padding: "0.7rem 1.2rem",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
