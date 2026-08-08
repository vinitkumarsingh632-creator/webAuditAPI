"use client";

import ReactECharts from "echarts-for-react";
import '../Styles/Echart.css'

export default function Echart({ dataFetched }) {
  if (!dataFetched || dataFetched === "-") {
    return (
      <div className="audit-empty">
        Run an audit to see the results.
      </div>
    );
  }

  const score = (value) => {
    if (value == null) return 0;


    return Math.round(value * 100);
  };

  const scoreColor = (value) => {
    if (value >= 90) return "#22c55e";
    if (value >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const performance = score(dataFetched?.Performance?.Score);
  const seo = score(dataFetched?.SEO?.Score);
  const accessibility = score(dataFetched?.Accessibility?.Score);
  const bestPractices = score(dataFetched?.Best_Practices?.Score);

  const resources = dataFetched?.Resources ?? [];

  const resourceData = resources.map((item) => ({
    name: item.label || item.resourceType || "Unknown",
    size: Math.round((item.transferSize || 0) / 1024),
  }));

  const gaugeOption = (value, name) => ({
    series: [
      {
        type: "gauge",

        min: 0,
        max: 100,

        radius: "85%",

        center: ["50%", "52%"],

        progress: {
          show: true,
          width: 14,
        },

        axisLine: {
          lineStyle: {
            width: 14,
            color: [
              [value / 100, scoreColor(value)],
              [1, "#25253d"],
            ],
          },
        },

        pointer: {
          show: true,
          length: "55%",
          width: 4,
        },

        axisTick: {
          show: false,
        },

        splitLine: {
          show: false,
        },

        axisLabel: {
          show: false,
        },

        anchor: {
          show: true,
          size: 8,
        },

        title: {
          show: true,
          offsetCenter: [0, "45%"],
          color: "#a1a1aa",
          fontSize: 13,
        },

        detail: {
          valueAnimation: true,
          offsetCenter: [0, "5%"],
          fontSize: 30,
          fontWeight: "bold",
          color: scoreColor(value),
          formatter: "{value}",
        },

        data: [
          {
            value,
            name,
          },
        ],
      },
    ],
  });

  const resourceOption = {
    tooltip: {
      trigger: "axis",
      formatter: (params) => {
        const item = params[0];

        return `
          ${item.name}<br/>
          Transfer Size: <b>${item.value} KB</b>
        `;
      },
    },

    grid: {
      left: 60,
      right: 20,
      top: 30,
      bottom: 70,
    },

    xAxis: {
      type: "category",
      data: resourceData.map((item) => item.name),

      axisLabel: {
        color: "#a1a1aa",
        rotate: 35,
        interval: 0,
      },

      axisLine: {
        lineStyle: {
          color: "#303047",
        },
      },
    },

    yAxis: {
      type: "value",

      name: "KB",

      nameTextStyle: {
        color: "#a1a1aa",
      },

      axisLabel: {
        color: "#a1a1aa",
      },

      splitLine: {
        lineStyle: {
          color: "#25253d",
        },
      },
    },

    series: [
      {
        type: "bar",

        data: resourceData.map((item) => item.size),

        barMaxWidth: 45,

        itemStyle: {
          borderRadius: [6, 6, 0, 0],
        },
      },
    ],
  };

  const metricCards = [
    {
      name: "LCP",
      value: dataFetched?.LCP?.DisplayValue ?? "-",
      description: "Largest Contentful Paint",
    },

    {
      name: "FCP",
      value: dataFetched?.FCP?.DisplayValue ?? "-",
      description: "First Contentful Paint",
    },

    {
      name: "CLS",
      value: dataFetched?.CLS?.DisplayValue ?? "-",
      description: "Cumulative Layout Shift",
    },

    {
      name: "Speed Index",
      value: dataFetched?.SpeedIndex?.DisplayValue ?? "-",
      description: "Visual loading speed",
    },

    {
      name: "Latency",
      value:
        dataFetched?.Latency != null
          ? `${dataFetched.Latency} ms`
          : "-",
      description: "Server response latency",
    },
  ];

  const statusCode = dataFetched?.StatusCode;

  const statusColor =
    statusCode >= 200 && statusCode < 300
      ? "#22c55e"
      : statusCode >= 300 && statusCode < 400
      ? "#f59e0b"
      : "#ef4444";

  return (
    <main className="audit-dashboard">

      {/* =========================
          SCORE SECTION
      ========================== */}

      <section className="section">

        <h2 className="section-title">
          Lighthouse Scores
        </h2>

        <div className="score-grid">

          <div className="chart-card">
            <ReactECharts
              option={gaugeOption(
                performance,
                "Performance"
              )}
              style={{
                width: "100%",
                height: "260px",
              }}
            />
          </div>

          <div className="chart-card">
            <ReactECharts
              option={gaugeOption(
                accessibility,
                "Accessibility"
              )}
              style={{
                width: "100%",
                height: "260px",
              }}
            />
          </div>

          <div className="chart-card">
            <ReactECharts
              option={gaugeOption(
                bestPractices,
                "Best Practices"
              )}
              style={{
                width: "100%",
                height: "260px",
              }}
            />
          </div>

          <div className="chart-card">
            <ReactECharts
              option={gaugeOption(
                seo,
                "SEO"
              )}
              style={{
                width: "100%",
                height: "260px",
              }}
            />
          </div>

        </div>
      </section>


      {/* =========================
          CORE METRICS
      ========================== */}

      <section className="section">

        <h2 className="section-title">
          Core Web Vitals & Metrics
        </h2>

        <div className="metric-grid">

          {metricCards.map((metric) => (
            <div
              className="metric-card"
              key={metric.name}
            >
              <div className="metric-name">
                {metric.name}
              </div>

              <div className="metric-value">
                {metric.value}
              </div>

              <div className="metric-description">
                {metric.description}
              </div>
            </div>
          ))}

        </div>
      </section>


      {/* =========================
          STATUS
      ========================== */}

      <section className="section">

        <h2 className="section-title">
          HTTP Response
        </h2>

        <div className="status-card">

          <div
            className="status-circle"
            style={{
              background: statusColor,
            }}
          >
            {statusCode}
          </div>

          <div>
            <div className="status-text">
              {dataFetched?.StatusText || "Unknown"}
            </div>

            <div className="status-description">
              HTTP response status
            </div>
          </div>

        </div>

      </section>


      {/* =========================
          RESOURCE SIZE
      ========================== */}

      <section className="section">

        <h2 className="section-title">
          Resource Size
        </h2>

        <div className="chart-card resource-card">

          {resourceData.length > 0 ? (
            <ReactECharts
              option={resourceOption}
              style={{
                width: "100%",
                height: "400px",
              }}
            />
          ) : (
            <div className="no-data">
              No resource data available.
            </div>
          )}

        </div>

      </section>


      {/* =========================
          HEADERS
      ========================== */}

      <section className="section">

        <h2 className="section-title">
          Response Headers
        </h2>

        <div className="headers-card">

          <HeaderRow
            name="Content-Type"
            value={
              dataFetched?.Headers?.contentType
            }
          />

          <HeaderRow
            name="Cache-Control"
            value={
              dataFetched?.Headers?.cacheControl
            }
          />

          <HeaderRow
            name="Content-Encoding"
            value={
              dataFetched?.Headers?.contentEncoding
            }
          />

          <HeaderRow
            name="Content-Length"
            value={
              dataFetched?.Headers?.contentLength
            }
          />

          <HeaderRow
            name="Server"
            value={
              dataFetched?.Headers?.server
            }
          />

        </div>

      </section>


      {/* =========================
          IMPROVEMENTS
      ========================== */}

      <section className="section">

        <h2 className="section-title">
          Improvements
        </h2>

        <div className="improvements-card">

          {dataFetched?.Improvements?.length > 0 ? (
            dataFetched.Improvements.map(
              (item, index) => (
                <div
                  className="improvement"
                  key={index}
                >
                  <span className="improvement-dot">
                    !
                  </span>

                  <span>
                    {typeof item === "string"
                      ? item
                      : item?.title ||
                        item?.id ||
                        "Improvement required"}
                  </span>
                </div>
              )
            )
          ) : (
            <div className="no-data">
              No major improvements found.
            </div>
          )}

        </div>

      </section>

    </main>
  );
}


/* =========================
   HEADER ROW COMPONENT
========================= */

function HeaderRow({ name, value }) {
  return (
    <div className="header-row">

      <span className="header-name">
        {name}
      </span>

      <span className="header-value">
        {value || "Not provided"}
      </span>

    </div>
  );
}