import React, { useState, useEffect } from "react";
import { outageAPI } from "../services/api";

const statusConfig = {
  REPORTED: { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
  CONFIRMED: { bg: "#fee2e2", color: "#7f1d1d", dot: "#ef4444" },
  RESOLVED: { bg: "#d1fae5", color: "#064e3b", dot: "#10b981" },
};

const AdminTable = ({ onAction }) => {
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    fetchOutages();
  }, []);

  const fetchOutages = async () => {
    try {
      setLoading(true);
      const response = await outageAPI.getAll();
      setOutages(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to load outages");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id) => {
    try {
      await outageAPI.confirm(id);
      fetchOutages();
      if (onAction) onAction("confirmed");
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolve = async (id) => {
    try {
      await outageAPI.resolve(id);
      fetchOutages();
      if (onAction) onAction("resolved");
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (d) =>
    d
      ? new Date(d).toLocaleString("en-IN", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";

  const counts = {
    ALL: outages.length,
    REPORTED: outages.filter((o) => o.status === "REPORTED").length,
    CONFIRMED: outages.filter((o) => o.status === "CONFIRMED").length,
    RESOLVED: outages.filter((o) => o.status === "RESOLVED").length,
  };

  const filtered =
    filter === "ALL" ? outages : outages.filter((o) => o.status === filter);

  const filterBtnConfig = {
    ALL: { color: "#3b82f6", bg: "rgba(59,130,246,0.15)", label: "📋 All" },
    REPORTED: {
      color: "#f59e0b",
      bg: "rgba(245,158,11,0.15)",
      label: "⚠️ Reported",
    },
    CONFIRMED: {
      color: "#ef4444",
      bg: "rgba(239,68,68,0.15)",
      label: "🔴 Confirmed",
    },
    RESOLVED: {
      color: "#10b981",
      bg: "rgba(16,185,129,0.15)",
      label: "✅ Resolved",
    },
  };

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
        Loading outages...
      </div>
    );

  if (error)
    return (
      <div
        style={{
          background: "rgba(239,68,68,0.1)",
          border: "1px solid #ef4444",
          borderRadius: "10px",
          padding: "1rem",
          color: "#fca5a5",
        }}
      >
        ❌ {error}
      </div>
    );

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "12px",
          marginBottom: "1.5rem",
        }}
      >
        {Object.entries(counts).map(([key, val]) => {
          const cfg = filterBtnConfig[key];
          return (
            <div
              key={key}
              style={{
                background: "#1e293b",
                border: `1px solid ${cfg.color}30`,
                borderRadius: "10px",
                padding: "1rem",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                outline: filter === key ? `2px solid ${cfg.color}` : "none",
              }}
              onClick={() => setFilter(key)}
            >
              <div
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: cfg.color,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  color: "#64748b",
                  fontSize: "0.78rem",
                  marginTop: "2px",
                }}
              >
                {key}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "1rem",
          flexWrap: "wrap",
        }}
      >
        {Object.entries(filterBtnConfig).map(([key, cfg]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              background: filter === key ? cfg.bg : "transparent",
              color: filter === key ? cfg.color : "#64748b",
              border: `1px solid ${filter === key ? cfg.color : "#334155"}`,
              borderRadius: "20px",
              padding: "4px 14px",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {cfg.label} ({counts[key]})
          </button>
        ))}
      </div>

      <div
        style={{
          overflowX: "auto",
          borderRadius: "12px",
          border: "1px solid #1e293b",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.88rem",
          }}
        >
          <thead>
            <tr
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #0f172a)",
              }}
            >
              {[
                "#",
                "Pincode",
                "Locality",
                "Status",
                "Reported",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "0.85rem 1rem",
                    color: "#94a3b8",
                    fontWeight: 600,
                    textAlign: "left",
                    borderBottom: "1px solid #1e293b",
                    fontSize: "0.8rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: "2.5rem",
                    textAlign: "center",
                    color: "#475569",
                  }}
                >
                  No outages found
                </td>
              </tr>
            ) : (
              filtered.map((outage, idx) => {
                const sc = statusConfig[outage.status] || {
                  bg: "#e2e8f0",
                  color: "#1e293b",
                  dot: "#94a3b8",
                };
                return (
                  <tr
                    key={outage.id}
                    style={{
                      background: idx % 2 === 0 ? "#0f172a" : "#1e293b",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#1e3a5f")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        idx % 2 === 0 ? "#0f172a" : "#1e293b")
                    }
                  >
                    <td style={{ padding: "0.85rem 1rem", color: "#475569" }}>
                      #{outage.id}
                    </td>
                    <td
                      style={{
                        padding: "0.85rem 1rem",
                        color: "#94a3b8",
                        fontFamily: "monospace",
                      }}
                    >
                      {outage.pincode}
                    </td>
                    <td
                      style={{
                        padding: "0.85rem 1rem",
                        color: "#f1f5f9",
                        fontWeight: 500,
                      }}
                    >
                      {outage.locality}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <span
                        style={{
                          background: sc.bg,
                          color: sc.color,
                          borderRadius: "20px",
                          padding: "3px 10px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <span
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: sc.dot,
                            display: "inline-block",
                          }}
                        ></span>
                        {outage.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "0.85rem 1rem",
                        color: "#64748b",
                        fontSize: "0.8rem",
                      }}
                    >
                      {formatDate(outage.reportedAt)}
                    </td>
                    <td style={{ padding: "0.85rem 1rem" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        {outage.status === "REPORTED" && (
                          <button
                            onClick={() => handleConfirm(outage.id)}
                            style={{
                              background: "rgba(245,158,11,0.15)",
                              color: "#f59e0b",
                              border: "1px solid #f59e0b",
                              borderRadius: "6px",
                              padding: "3px 10px",
                              fontSize: "0.78rem",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            ✔ Confirm
                          </button>
                        )}
                        {outage.status !== "RESOLVED" && (
                          <button
                            onClick={() => handleResolve(outage.id)}
                            style={{
                              background: "rgba(16,185,129,0.15)",
                              color: "#10b981",
                              border: "1px solid #10b981",
                              borderRadius: "6px",
                              padding: "3px 10px",
                              fontSize: "0.78rem",
                              cursor: "pointer",
                              fontWeight: 600,
                            }}
                          >
                            ✅ Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
