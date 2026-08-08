"use client";

import { useState } from "react";
import "../../Styles/History.css";

export default function History() {
  const [history, setHistory] = useState(() => {
    try {
      const storedHistory = localStorage.getItem("auditHistory");

      if (!storedHistory) {
        return [];
      }

      const parsedHistory = JSON.parse(storedHistory);

      return Array.isArray(parsedHistory)
        ? parsedHistory
        : [];
    } catch (err) {
      console.error(err);
      return [];
    }
  });

  const [error, setError] = useState("");

  function clearHistory() {
    try {
      localStorage.removeItem("auditHistory");
      setHistory([]);
    } catch (err) {
      console.error(err);
      setError("Failed to clear history.");
    }
  }

  if (error) {
    return (
      <main className="history-container">
        <p className="history-error">{error}</p>
      </main>
    );
  }

  if (history.length === 0) {
    return (
      <main className="history-container">
        <div className="history-header">
          <h1 className="history-title">
            Audit History
          </h1>
        </div>

        <div className="empty-history">
          <p>No audits yet.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="history-container">
      <div className="history-header">
        <h1 className="history-title">
          Audit History
        </h1>

        <button
          type="button"
          onClick={clearHistory}
          className="clear-history-button"
        >
          Clear History
        </button>
      </div>

      <div className="history-list">
        {history.map((item, index) => (
          <div
            className="history-card"
            key={`${item.URL || "audit"}-${item.Timestamp || index}-${index}`}
          >
            <div className="history-card-top">
              <div className="history-url-container">
                <h2 className="history-url">
                  {item.URL || "Unknown URL"}
                </h2>

                <p className="history-date">
                  {item.Timestamp
                    ? new Date(
                        item.Timestamp
                      ).toLocaleString()
                    : "Unknown date"}
                </p>
              </div>

              <div
                className={`history-status ${
                  item.StatusCode >= 200 &&
                  item.StatusCode < 300
                    ? "status-success"
                    : "status-error"
                }`}
              >
                {item.StatusCode ?? "-"}
              </div>
            </div>

            <div className="history-metrics">
              <Metric
                name="Performance"
                value={item.Performance?.Score}
              />

              <Metric
                name="SEO"
                value={item.SEO?.Score}
              />

              <Metric
                name="Accessibility"
                value={item.Accessibility?.Score}
              />

              <Metric
                name="Best Practices"
                value={item.Best_Practices?.Score}
              />
            </div>

            <div className="history-details">
              <span>
                <strong>LCP</strong>
                {item.LCP?.DisplayValue || "-"}
              </span>

              <span>
                <strong>FCP</strong>
                {item.FCP?.DisplayValue || "-"}
              </span>

              <span>
                <strong>CLS</strong>
                {item.CLS?.DisplayValue || "-"}
              </span>

              <span>
                <strong>Speed Index</strong>
                {item.SpeedIndex?.DisplayValue || "-"}
              </span>

              <span>
                <strong>Latency</strong>
                {item.Latency ?? "-"} ms
              </span>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function Metric({ name, value }) {
  const score =
    typeof value === "number"
      ? Math.round(value * 100)
      : null;

  return (
    <div className="history-metric">
      <span className="history-metric-name">
        {name}
      </span>

      <strong className="history-metric-value">
        {score !== null ? score : "-"}
      </strong>
    </div>
  );
}