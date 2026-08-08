"use client";

import { useEffect, useState } from "react";
import "../../Styles/History.css";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("auditHistory");

      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);

        if (Array.isArray(parsedHistory)) {
          setHistory(parsedHistory);
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load audit history.");
    } finally {
      setLoading(false);
    }
  }, []);

  function clearHistory() {
    localStorage.removeItem("auditHistory");
    setHistory([]);
  }

  if (loading) {
    return <div>Loading history...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (history.length === 0) {
    return (
      <div className="history-container">
        <h1 className="history-title">Audit History</h1>
        <p>No audits yet.</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1 className="history-title">Audit History</h1>

        <button
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
            key={`${item.URL}-${item.Timestamp}-${index}`}
          >
            <div className="history-card-top">
              <div className="history-url-container">
                <h2 className="history-url">{item.URL}</h2>

                <p className="history-date">
                  {item.Timestamp
                    ? new Date(item.Timestamp).toLocaleString()
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
                <strong>LCP</strong>{" "}
                {item.LCP?.DisplayValue || "-"}
              </span>

              <span>
                <strong>FCP</strong>{" "}
                {item.FCP?.DisplayValue || "-"}
              </span>

              <span>
                <strong>CLS</strong>{" "}
                {item.CLS?.DisplayValue || "-"}
              </span>

              <span>
                <strong>Speed Index</strong>{" "}
                {item.SpeedIndex?.DisplayValue || "-"}
              </span>

              <span>
                <strong>Latency</strong>{" "}
                {item.Latency ?? "-"} ms
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
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