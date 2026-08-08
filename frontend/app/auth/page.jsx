"use client";

import { useState } from "react";

export default function Auth() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function createAccount(event) {
    event.preventDefault();

    if (!name.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://webauditapi.onrender.com/api/v1/developers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.status) {
        setError(
          data.message || "Failed to create account."
        );
        return;
      }

      localStorage.setItem(
        "developerId",
        data.developer.id
      );

      localStorage.setItem(
        "developerName",
        data.developer.name
      );

      localStorage.setItem(
        "developerSecret",
        data.secret
      );

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>
          WebAudit
        </h1>

        <p style={styles.description}>
          Create your WebAudit developer account.
        </p>

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

        <form
          onSubmit={createAccount}
          style={styles.form}
        >
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
          >
            {loading
              ? "Creating..."
              : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#05051f",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    padding: "32px",
    borderRadius: "14px",
    background: "#10102b",
    border: "1px solid #29294b",
    boxSizing: "border-box",
  },

  title: {
    color: "#ffffff",
    textAlign: "center",
    margin: "0 0 10px",
  },

  description: {
    color: "#9999b8",
    textAlign: "center",
    marginBottom: "24px",
  },

  error: {
    color: "#ef4444",
    fontSize: "14px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #29294b",
    background: "#0b0b24",
    color: "#ffffff",
    outline: "none",
  },

  button: {
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "#ffffff",
    cursor: "pointer",
  },
};