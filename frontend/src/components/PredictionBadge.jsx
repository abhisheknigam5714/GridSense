import React, { useState, useEffect } from "react";
import { outageAPI } from "../services/api";

const riskConfig = {
  LOW: {
    bg: "linear-gradient(135deg, #d1fae5, #a7f3d0)",
    color: "#064e3b",
    border: "#10b981",
    icon: "🛡️",
    label: "Low Risk",
    bar: "#10b981",
    barWidth: "25%",
  },
  MEDIUM: {
    bg: "linear-gradient(135deg, #fef3c7, #fde68a)",
    color: "#78350f",
    border: "#f59e0b",
    icon: "⚠️",
    label: "Medium Risk",
    bar: "#f59e0b",
    barWidth: "60%",
  },
  HIGH: {
    bg: "linear-gradient(135deg, #fee2e2, #fecaca)",
    color: "#7f1d1d",
    border: "#ef4444",
    icon: "🔴",
    label: "High Risk",
    bar: "#ef4444",
    barWidth: "100%",
  },
};

const PredictionBadge = ({ pincode }) => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pincode) {
      setLoading(false);
      return;
    }
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await outageAPI.predict(pincode);
        setPrediction(res.data);
        setError(null);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [pincode]);

  if (!pincode || error || (!loading && !prediction)) return null;

  if (loading)
    return (
      <div
        style={{
          background: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "12px",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span>🔍</span>
        <span style={{ color: "#94a3b8", fontSize: "0.88rem" }}>
          Analysing outage risk for {pincode}...
        </span>
      </div>
    );

  const cfg = riskConfig[prediction.riskLevel] || riskConfig.LOW;

  return (
    <div
      style={{
        background: "#1e293b",
        border: `1px solid ${cfg.border}`,
        borderRadius: "12px",
        padding: "1.1rem 1.25rem",
        marginBottom: "1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.6rem",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: "1.4rem" }}>{cfg.icon}</span>
          <div>
            <div
              style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.95rem" }}
            >
              Outage Risk Prediction
            </div>
            <div style={{ color: "#64748b", fontSize: "0.78rem" }}>
              Pincode {pincode} · Last 30 days
            </div>
          </div>
        </div>
        <span
          style={{
            background: cfg.bg,
            color: cfg.color,
            border: `1px solid ${cfg.border}`,
            borderRadius: "20px",
            padding: "4px 14px",
            fontWeight: 700,
            fontSize: "0.85rem",
          }}
        >
          {cfg.label}
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            flex: 1,
            background: "#0f172a",
            borderRadius: "10px",
            height: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: cfg.barWidth,
              height: "100%",
              background: cfg.bar,
              borderRadius: "10px",
              transition: "width 0.8s ease",
            }}
          />
        </div>
        <span
          style={{
            color: "#94a3b8",
            fontSize: "0.78rem",
            whiteSpace: "nowrap",
          }}
        >
          {prediction.outageCount} outages reported
        </span>
      </div>
    </div>
  );
};

export default PredictionBadge;
