"use client";
import statusMessage from "./status";
import LoadingPage from "../Component/Loading";
import Navbar from "../Component/Navbar";
import APIDrawer from "../Component/APIDrawer";
import { useEffect, useState } from "react";
import { Menu, X, Search } from "lucide-react";
export default function Home() {
  const [url, setUrl] = useState("");
  const [sidebar, setSidebar] = useState(false);
  const [apiDrawer,setApiDrawer] = useState(false)
  const [urlError, setUrlError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  async function FetchData(url) {
    try {
        const data = await fetch("http://localhost:4000/ui/analyze", {
        method: "post",
        body: JSON.stringify({ url }),
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      setLoading(false)
      const jsonData = await data.json()
      if(jsonData.fetchError) return alert('Invalid URL')
        console.log(jsonData)
      
    } catch {
      setLoading(false)
        setUrlError(true);
        
      alert('Error Occurred');
    }
    
  }

  return (
    <div>
      {apiDrawer?<APIDrawer/>:undefined}
      {sidebar?<Navbar sidebar={setSidebar} apiDrawer={setApiDrawer}/>:undefined}
      {isLoading ?<LoadingPage/>:undefined}
      <header style={style.header}>
        {sidebar ? (
          <X size={30}  style={{position:'relative',zIndex:100}} color="white" onClick={() => setSidebar(false)} />
        ) : (
          <Menu color="white" size={30} onClick={() => setSidebar(true)} />
        )}
        <input
          type="text"
          style={style.input}
          placeholder="Enter the URL"
          size={20}
          value={url}
          onChange={(event) => setUrl(event.target.value)}
        />
        <Search
          size={30}
          style={style.search}
          color="white"
          width={30}
          strokeWidth={4}
          onClick={() => {
            setLoading(true)
            FetchData(url);
            setUrl("");
           
          }}
        />

      </header>
    </div>
  );
}
const style = {
  header: {
    display: "flex",
    marginTop: "1rem",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  input: {
    borderRadius: "20px",
    fontSize: "1.2rem",
    width: "50%",
    paddingLeft: "1rem",
    textAlign:'center'
  },
};
