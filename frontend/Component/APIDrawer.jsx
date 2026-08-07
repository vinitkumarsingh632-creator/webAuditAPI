"use client";

import { Copy, KeyRound, X } from "lucide-react";

export default function APIDrawer() {
  return (
    <div style={style.overlay}>
      <div style={style.drawer}>
        <div style={style.header}>
          <div style={style.heading}>
            <KeyRound size={22} />
            <span>API Key</span>
          </div>

          <X size={20} style={{ cursor: "pointer" }} />
        </div>

        <p style={style.description}>
          Keep your API key secret. Anyone with this key can access your API.
        </p>

        <div style={style.keyBox}>
          <span style={style.key}>
            sk_live_********************************
          </span>

          <Copy
            size={18}
            style={{
              cursor: "pointer",
            }}
          />
        </div>

        <button style={style.button}>
          Generate New Key
        </button>
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
    width: "430px",

    background: "rgba(255,255,255,.08)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: "22px",

    padding: "28px",

    color: "white",

    boxShadow: "0 15px 40px rgba(0,0,0,.35)",
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.08)",

    padding: "14px 16px",
    borderRadius: "12px",

    marginBottom: "22px",
  },

  key: {
    fontFamily: "monospace",
    letterSpacing: ".5px",
    fontSize: ".9rem",
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