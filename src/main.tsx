import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import App from "./App";
import "./styles.css";
import UserLogin from "./components/user/userLogin";
import UserTrack from "./components/user/userTrack";
import { SEOProvider, useSEO } from "./components/seo";

function AppRoutes() {
  const location = useLocation();
  const { setSEO } = useSEO();
  
  const getRouteSEO = () => {
    const path = location.pathname;
    
    if (path === "/" || path === "/dashboard") {
      return {
        title: "Dashboard",
        description: "View your installment tracking dashboard with real-time analytics, borrower statistics, and collection data.",
        noindex: false,
      };
    }
    if (path.startsWith("/track-login")) {
      return {
        title: "Track Login",
        description: "Access your installment records by logging in to your TrueFin tracking account.",
        noindex: false,
      };
    }
    if (path.startsWith("/track/")) {
      return {
        title: "Borrower Tracking",
        description: "View detailed installment history and payment status for your loan.",
        noindex: false,
      };
    }
    
    return {
      title: "TrueFin",
      description: "TrueFin helps manage installments, borrowers, collections, financial tracking and reports efficiently.",
      noindex: false,
    };
  };

  React.useEffect(() => {
    const seo = getRouteSEO();
    setSEO({
      title: seo.title,
      description: seo.description,
    });
  }, [location.pathname, location.search, setSEO]);

  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/track-login" element={<UserLogin />} />
      <Route path="/track/:uniqueId" element={<UserTrack />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SEOProvider>
        <AppRoutes />
      </SEOProvider>
    </BrowserRouter>
  </React.StrictMode>,
);