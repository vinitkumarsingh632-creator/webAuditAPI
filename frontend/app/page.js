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

      // User is not authenticated
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

      /*
       * Authentication failed
       */
      if (
        fetchedData.status === 401
      ) {
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

      /*
       * Lighthouse could not fetch the website
       */
      if (jsonData.fetchError) {
        alert("Invalid URL");
        return;
      }

      /*
       * Other API errors
       */
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

      /*
       * Do NOT save history here.
       *
       * The backend already saves the audit
       * into MongoDB.
       */

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
    }
  }

  async function SearchWebsite() {
    if (!url.trim() || isLoading) {
      return;
    }

    setLoading(true);
    setUrlError(false);

    await FetchData(url.trim());

    setUrl("");
  }

  return (
    <div className="page">

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
        <LoadingPage />
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