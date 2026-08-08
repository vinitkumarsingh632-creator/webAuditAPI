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
      const fetchedData = await fetch(
        "https://webauditapi.onrender.com/ui/analyze",
        {
          method: "POST",
          body: JSON.stringify({ url }),
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const jsonData = await fetchedData.json();

      setLoading(false);

      if (jsonData.fetchError) {
        alert("Invalid URL");
        return;
      }

      console.log(jsonData);

      setData(jsonData);
    } catch (err) {
      console.error(err);

      setLoading(false);
      setUrlError(true);

      alert("Error Occurred");
    }
  }

  function SearchWebsite() {
    if (!url.trim()) return;

    setLoading(true);

    FetchData(url);

    setUrl("");
  }

  return (
    <div className="page">

      {/* MENU */}

      <button
        className="menu-button"
        onClick={() => setSidebar(true)}
      >
        <Menu size={22} />
      </button>


      {/* SIDEBAR */}

      {sidebar && (
        <>
          <div
            className="sidebar-overlay"
            onClick={() => setSidebar(false)}
          />

          <aside className="sidebar">

            <div className="sidebar-top">

              <h2>WebAudit</h2>

              <button
                className="close-button"
                onClick={() => setSidebar(false)}
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


      {/* API DRAWER */}

      {apiDrawer && (
        <APIDrawer
          close={() => setApiDrawer(false)}
        />
      )}


      {/* LOADING */}

      {isLoading && <LoadingPage />}


      {/* MAIN PAGE */}

      <main className="main-content">

        <div className="search-container">

          <p className="search-help">
            Enter a website URL to analyze its performance,
            SEO, accessibility, and more.
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
                if (event.key === "Enter") {
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


        {/* RESULTS */}

        <Echart
          dataFetched={data ? data : "-"}
        />

      </main>

    </div>
  );
}