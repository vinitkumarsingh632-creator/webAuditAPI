'use client'
import  Link  from "next/link";
import {usePathname} from 'next/navigation'
import { useState } from "react";
export default function Navbar(prop) {
    
    
    const pathname = usePathname()
  return (
    <aside style={style.sidebar}>
      <h1 style={style.logo}>WebAudit</h1>

      <nav>
        <ul style={style.list}>
          <li style={{...style.item,backgroundColor:(pathname == '/')?'white':'rgba(255,255,255,0.05)',}}><Link href="/" style={{textDecoration:'none',color:(pathname == '/')?"black":'white'}}>🏠 Home</Link></li>
          <li style={style.item} onClick={()=>{
            prop.sidebar(false)
            prop.apiDrawer(true)
          }}>🔑 API Keys</li>
          <li style={{...style.item,backgroundColor:(pathname == '/history')?'white':'rgba(255,255,255,0.05)'}}><Link href="/history" style={{textDecoration:'none',color:(pathname == '/history')?"black":'white'}}>📜 History</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

const style = {
  sidebar: {
    position: "fixed",
    top: 20,
    left: 20,
    width: "40%",
    height: "calc(100vh - 40px)",

    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "22px",

    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",

    padding: "30px 20px",

    display: "flex",
    flexDirection: "column",
  },

  logo: {
    color: "white",
    textAlign: "center",
    marginBottom: "40px",
    fontSize: "1.8rem",
    fontWeight: "700",
    letterSpacing: "1px",
  },

  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,

    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  item: {
    color: "white",
    padding: "15px 18px",
    borderRadius: "14px",

    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",

    cursor: "pointer",

    fontSize: "1rem",
    fontWeight: "500",

    transition: "all .25s ease",
  },
};