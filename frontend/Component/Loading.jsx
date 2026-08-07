"use client";

import { useEffect, useState } from "react";

export default function LoadingPage() {
  const [count, setCount] = useState(60);

  useEffect(() => {
    const id = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div style={style.overlay}>
      <div style={style.card}>
        <div style={style.spinner}></div>

        <h2 style={style.title}>Analyzing Website</h2>

        <p style={style.subtitle}>
          Please wait while we fetch performance, SEO and accessibility data...
        </p>

        <p style={style.timer}>{count}s</p>
      </div>
    </div>
  );
}

const style = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(10,10,20,0.35)",
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  card: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "40px",
    minWidth: "360px",
    textAlign: "center",
    color: "white",
    boxShadow: "0 15px 40px rgba(0,0,0,.35)",
  },

  spinner: {
    width: "55px",
    height: "55px",
    border: "5px solid rgba(255,255,255,.2)",
    borderTop: "5px solid white",
    borderRadius: "50%",
    margin: "0 auto 25px",
    animation: "spin 1s linear infinite",
  },

  title: {
    margin: 0,
    fontSize: "1.5rem",
    fontWeight: 700,
  },

  subtitle: {
    marginTop: "12px",
    color: "rgba(255,255,255,.75)",
    lineHeight: 1.5,
    fontSize: ".95rem",
  },

  timer: {
    marginTop: "18px",
    fontWeight: "bold",
    fontSize: "1.2rem",
    letterSpacing: "2px",
  },
};