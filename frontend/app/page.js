"use client";

import "./index.css";

import LoadingPage from "../Component/Loading";
import Navbar from "../Component/Navbar";
import APIDrawer from "../Component/APIDrawer";

import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

import Echart from "../Component/Echart";

export default function Home() {
  const [data, setData] = useState("");
  const [url, setUrl] = useState("");

  const [analyzingUrl, setAnalyzingUrl] = useState("");

  const [sidebar, setSidebar] = useState(false);
  const [apiDrawer, setApiDrawer] = useState(false);

  const [urlError, setUrlError] = useState(false);
  const [isLoading, setLoading] = useState(false);

  async function FetchData(url) {
    try {
      const developerId =
        localStorage.getItem("developerId");

      const developerSecret =
        localStorage.getItem("developerSecret");

      
      if (!developerId || !developerSecret) {
        window.location.href = "/auth";
        return;
      }

      const fetchedData = await fetch(
        "https://webauditapi.onrender.com/ui/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "X-Developer-ID": developerId,
            "X-Developer-Secret": developerSecret,
          },

          body: JSON.stringify({
            url,
          }),
        }
      );

      const text = await fetchedData.text();

      let jsonData;

      try {
        jsonData = JSON.parse(text);
      } catch {
        console.error(
          "Server response:",
          text
        );

        alert(
          "Server returned an invalid response."
        );

        return;
      }

      if (fetchedData.status === 401) {
        localStorage.removeItem(
          "developerId"
        );

        localStorage.removeItem(
          "developerName"
        );

        localStorage.removeItem(
          "developerSecret"
        );

        alert(
          "Authentication failed. Please create your account again."
        );

        window.location.href = "/auth";

        return;
      }

      
      if (jsonData.fetchError) {
        alert(
          jsonData.message ||
            "Invalid URL or website is unreachable."
        );

        return;
      }

      
      if (!fetchedData.ok) {
        alert(
          jsonData.message ||
            jsonData.error ||
            "Failed to analyze website"
        );

        console.error(
          "API error:",
          jsonData
        );

        return;
      }

      
      setData(jsonData);

    } catch (err) {
      console.error(
        "Fetch error:",
        err
      );

      setUrlError(true);

      alert(
        err.message ||
          "Error occurred while analyzing website."
      );

    } finally {
      setLoading(false);

      
      setAnalyzingUrl("");
    }
  }

  async function SearchWebsite() {
    if (!url.trim() || isLoading) {
      return;
    }

    const targetUrl = url.trim();

    setLoading(true);
    setUrlError(false);

    
    setAnalyzingUrl(targetUrl);

    
    setUrl("");

    await FetchData(targetUrl);
  }

  return (
    <div>

      <button
        className="menu-button"
        onClick={() =>
          setSidebar(true)
        }
      >
        <Menu size={22} />
      </button>

      {sidebar && (
        <>
          <div
            className="sidebar-overlay"
            onClick={() =>
              setSidebar(false)
            }
          />

          <aside className="sidebar">

            <div className="sidebar-top">

              <h2>WebAudit</h2>

              <button
                className="close-button"
                onClick={() =>
                  setSidebar(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <Navbar
              sidebar={setSidebar}
              apiDrawer={setApiDrawer}
            />

          </aside>
        </>
      )}

      {apiDrawer && (
        <APIDrawer
          close={() =>
            setApiDrawer(false)
          }
        />
      )}

      {isLoading && (
        <>
          <LoadingPage />

          <div
            style={{
              position: "fixed",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 10000,
              width: "min(600px, 90%)",
              padding: "12px 18px",
              borderRadius: "12px",
              background: "rgba(0, 0, 0, 0.75)",
              color: "white",
              textAlign: "center",
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                fontSize: "0.8rem",
                opacity: 0.7,
                marginBottom: "4px",
              }}
            >
              Analyzing
            </div>

            <div
              style={{
                fontFamily: "monospace",
                fontSize: "0.9rem",
                wordBreak: "break-all",
              }}
            >
              {analyzingUrl}
            </div>
          </div>
        </>
      )}

      <main className="main-content">

        <div className="search-container">

          <p className="search-help">
            Enter a website URL to analyze
            its performance, SEO,
            accessibility, and more.
          </p>

          <div className="search-box">

            <input
              type="url"
              className="search-input"
              disabled={isLoading}
              placeholder="https://example.com"
              value={url}
              onChange={(event) =>
                setUrl(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  SearchWebsite();
                }
              }}
            />

            <Search
              size={22}
              className="search-icon"
              onClick={SearchWebsite}
            />

          </div>

          <span className="search-example">
            Try: https://example.com
          </span>

        </div>

        <Echart
          dataFetched={
            data ? data : "-"
          }
        />

      </main>

    </div>
  );
}