"use client";

import { useEffect, useState } from "react";
import "../../Styles/History.css";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchHistory() {
      try {
        const developerId =
          localStorage.getItem("developerId");

        const developerSecret =
          localStorage.getItem("developerSecret");

        console.log("Developer ID:", developerId);
        console.log(
          "Developer Secret exists:",
          Boolean(developerSecret)
        );

        if (!developerId || !developerSecret) {
          window.location.href = "/auth";
          return;
        }

        const response = await fetch(
          "https://webauditapi.onrender.com/ui/history",
          {
            method: "GET",
            headers: {
              "X-Developer-ID": developerId,
              "X-Developer-Secret": developerSecret,
            },
          }
        );

        const text = await response.text();

        console.log("History status:", response.status);
        console.log("History response:", text);

        let data;

        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "Backend returned invalid JSON."
          );
        }

        if (response.status === 401) {
          localStorage.removeItem("developerId");
          localStorage.removeItem("developerName");
          localStorage.removeItem("developerSecret");

          window.location.href = "/auth";
          return;
        }

        if (!response.ok || !data.status) {
          throw new Error(
            data.message ||
              "Failed to fetch history."
          );
        }

        setHistory(data.History || []);
      } catch (err) {
        console.error(
          "History error:",
          err
        );

        setError(
          err.message ||
            "Failed to connect to server."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-container">
        <h1 className="history-title">
          Audit History
        </h1>

        <p>Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-container">
        <h1 className="history-title">
          Audit History
        </h1>

        <p className="history-error">
          {error}
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="history-container">
        <h1 className="history-title">
          Audit History
        </h1>

        <p>No audits yet.</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <div className="history-header">
        <h1 className="history-title">
          Audit History
        </h1>
      </div>

      <div className="history-list">
        {history.map((item) => (
          <div
            className="history-card"
            key={item._id}
          >
            <div className="history-card-top">
              <div className="history-url-container">
                <h2 className="history-url">
                  {item.URL}
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
                value={
                  item.Accessibility?.Score
                }
              />

              <Metric
                name="Best Practices"
                value={
                  item.Best_Practices?.Score
                }
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