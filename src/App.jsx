import { useState, useEffect } from "react";
import LandingPage from "./aixra-landing";
import AdminDashboard from "./aixra-admin";
import ClientDashboard from "./aixra-client";
import WidgetDemo from "./aixra-widget";

function getRoute() {
  const hash = window.location.hash.replace("#", "") || "/";
  return hash;
}

export default function App() {
  const [route, setRoute] = useState(getRoute());

  useEffect(() => {
    const onHash = () => setRoute(getRoute());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const [adminAuth, setAdminAuth] = useState(
    sessionStorage.getItem("aixra_admin") === "true"
  );
  const [adminPass, setAdminPass] = useState("");
  const [authError, setAuthError] = useState(false);
  const ADMIN_PASSWORD = "admin2026";

  if (route === "/admin" && !adminAuth) {
    return (
      <div style={{ minHeight: "100vh", background: "#07070A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cairo', sans-serif", direction: "rtl" }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;800&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 48, width: 360, textAlign: "center" }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#6EE7B7,#3B82F6)", borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 900, color: "#000", margin: "0 auto 24px" }}>A</div>
          <h2 style={{ color: "#fff", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Admin Panel</h2>
          <input type="password" placeholder="Password" value={adminPass}
            onChange={e => { setAdminPass(e.target.value); setAuthError(false); }}
            onKeyDown={e => { if (e.key === "Enter") { if (adminPass === ADMIN_PASSWORD) { sessionStorage.setItem("aixra_admin","true"); setAdminAuth(true); } else setAuthError(true); }}}
            style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: `1px solid ${authError ? "#EF4444" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, color: "#fff", padding: "12px 16px", fontSize: 14, outline: "none", marginBottom: 12, textAlign: "center" }}
          />
          {authError && <p style={{ color: "#EF4444", fontSize: 12, marginBottom: 12 }}>Wrong password</p>}
          <button onClick={() => { if (adminPass === ADMIN_PASSWORD) { sessionStorage.setItem("aixra_admin","true"); setAdminAuth(true); } else setAuthError(true); }}
            style={{ width: "100%", background: "#6EE7B7", color: "#000", border: "none", borderRadius: 12, padding: "12px", fontSize: 14, fontWeight: 800, cursor: "pointer" }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  switch (route) {
    case "/admin": return <AdminDashboard />;
    case "/dashboard": return <ClientDashboard />;
    case "/widget-demo": return <WidgetDemo />;
    default: return <LandingPage />;
  }
}
