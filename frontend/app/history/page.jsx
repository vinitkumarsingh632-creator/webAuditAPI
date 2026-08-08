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
        const response = await fetch(
          "https://webauditapi.onrender.com/api/history",
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!data.status) {
          setError(
            data.message || "Failed to fetch history"
          );
          return;
        }

        setHistory(data.History || []);
      } catch (err) {
        console.error(err);
        setError("Failed to connect to server.");
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="history-center">
        Loading history...
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-center">
        {error}
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="history-center">
        No audits yet.
      </div>
    );
  }

  return (
    <main className="history-page">

      <div className="history-container">

        <h1 className="history-title">
          Audit History
        </h1>

        <div className="history-list">

          {history.map((item, index) => (
            <div
              className="history-card"
              key={index}
            >

              {/* TOP */}

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
                  {item.StatusCode}
                </div>

              </div>


              {/* MAIN METRICS */}

              <div className="history-metrics">

                <Metric
                  name="Performance"
                  value={
                    item.Performance?.Score
                  }
                />

                <Metric
                  name="SEO"
                  value={
                    item.SEO?.Score
                  }
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


              {/* DETAILS */}

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
        {score !== null
          ? score
          : "-"}
      </strong>

    </div>
  );
}