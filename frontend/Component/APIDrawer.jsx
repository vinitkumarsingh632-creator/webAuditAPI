"use client";

import { useEffect, useState } from "react";
import {
  Copy,
  KeyRound,
  X,
} from "lucide-react";

export default function APIDrawer({ close }) {
  const [apiKey, setApiKey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function fetchAPIKey() {
      try {
        const developerId =
          localStorage.getItem("developerId");

        const developerSecret =
          localStorage.getItem(
            "developerSecret"
          );

        if (!developerId || !developerSecret) {
          window.location.href = "/auth";
          return;
        }

        const response = await fetch(
          "https://webauditapi.onrender.com/api/v1/keys",
          {
            method: "GET",
            headers: {
              "X-Developer-ID": developerId,
              "X-Developer-Secret":
                developerSecret,
            },
          }
        );

        const data = await response.json();

        console.log(
          "API KEY RESPONSE:",
          data
        );

        if (response.status === 401) {
          localStorage.removeItem(
            "developerId"
          );

          localStorage.removeItem(
            "developerName"
          );

          localStorage.removeItem(
            "developerSecret"
          );

          window.location.href = "/auth";
          return;
        }

        if (response.status === 404) {
          setApiKey(null);
          return;
        }

        if (!response.ok || !data.status) {
          throw new Error(
            data.message ||
              "Failed to fetch API key."
          );
        }

        setApiKey(data.APIKey);
      } catch (err) {
        console.error(
          "Failed to fetch API key:",
          err
        );
      } finally {
        setLoading(false);
      }
    }

    fetchAPIKey();
  }, []);

  async function generateAPIKey() {
    try {
      setGenerating(true);

      const developerId =
        localStorage.getItem("developerId");

      const developerSecret =
        localStorage.getItem(
          "developerSecret"
        );

      if (!developerId || !developerSecret) {
        window.location.href = "/auth";
        return;
      }

      const response = await fetch(
        "https://webauditapi.onrender.com/api/v1/keys",
        {
          method: "POST",
          headers: {
            "X-Developer-ID": developerId,
            "X-Developer-Secret":
              developerSecret,
          },
        }
      );

      const data = await response.json();

      console.log(
        "GENERATE API KEY RESPONSE:",
        data
      );

      if (response.status === 401) {
        window.location.href = "/auth";
        return;
      }

      if (!response.ok || !data.status) {
        alert(
          data.message ||
            "Failed to generate API key."
        );
        return;
      }

      setApiKey(data.apiKey);
    } catch (err) {
      console.error(
        "Generate API key error:",
        err
      );

      alert(
        "Failed to generate API key."
      );
    } finally {
      setGenerating(false);
    }
  }

  async function copyAPIKey() {
    if (!apiKey) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        apiKey
      );

      alert("API key copied.");
    } catch (err) {
      console.error(err);

      alert(
        "Failed to copy API key."
      );
    }
  }

  return (
    <div style={style.overlay}>
      <div style={style.drawer}>
        <div style={style.header}>
          <div style={style.heading}>
            <KeyRound size={21} />
            API Key
          </div>

          <X
            size={20}
            style={{
              cursor: "pointer",
            }}
            onClick={close}
          />
        </div>

        <p style={style.description}>
          Keep your API key secret. Anyone
          with this key can access your API.
        </p>

        <div style={style.keyBox}>
          <span style={style.key}>
            {loading
              ? "Checking..."
              : apiKey
              ? apiKey
              : "No API key generated"}
          </span>

          {apiKey && (
            <Copy
              size={18}
              style={{
                cursor: "pointer",
                flexShrink: 0,
              }}
              onClick={copyAPIKey}
            />
          )}
        </div>

        {!loading && !apiKey && (
          <button
            style={style.button}
            onClick={generateAPIKey}
            disabled={generating}
          >
            {generating
              ? "Generating..."
              : "Generate API Key"}
          </button>
        )}

        {!loading && apiKey && (
          <button
            style={style.button}
            onClick={generateAPIKey}
            disabled={generating}
          >
            {generating
              ? "Generating..."
              : "Generate New Key"}
          </button>
        )}
      </div>
    </div>
  );
}

const style = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.35)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  drawer: {
    width:
      "min(430px, calc(100% - 30px))",
    background:
      "rgba(255,255,255,.08)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",
    border:
      "1px solid rgba(255,255,255,.12)",
    borderRadius: "22px",
    padding: "28px",
    color: "white",
    boxShadow:
      "0 15px 40px rgba(0,0,0,.35)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  heading: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "1.3rem",
    fontWeight: 600,
  },

  description: {
    color: "rgba(255,255,255,.75)",
    lineHeight: 1.6,
    marginBottom: "20px",
    fontSize: ".95rem",
  },

  keyBox: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    background:
      "rgba(255,255,255,.06)",
    border:
      "1px solid rgba(255,255,255,.08)",
    padding: "14px 16px",
    borderRadius: "12px",
    marginBottom: "22px",
    boxSizing: "border-box",
  },

  key: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontFamily: "monospace",
    letterSpacing: ".5px",
    fontSize: ".85rem",
  },

  button: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "12px",
    background: "#4F46E5",
    color: "white",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
  },
};