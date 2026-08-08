"use client";
import '../Styles/Navbar.css'
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ sidebar, apiDrawer }) {
  const pathname = usePathname();

  return (
    <div className="navbar">

      <h2 className="navbar-logo">
        WebAudit
      </h2>

      <nav>
        <ul className="navbar-list">

          <li
            className={`navbar-item ${
              pathname === "/" ? "active" : ""
            }`}
          >
            <Link href="/">
              🏠 Home
            </Link>
          </li>

          <li
            className="navbar-item"
            onClick={() => {
              sidebar(false);
              apiDrawer(true);
            }}
          >
            🔑 API Keys
          </li>

          <li
            className={`navbar-item ${
              pathname === "/history" ? "active" : ""
            }`}
          >
            <Link href="/history">
              📜 History
            </Link>
          </li>

        </ul>
      </nav>

    </div>
  );
}