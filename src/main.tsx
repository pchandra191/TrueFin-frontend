import React, { lazy, Suspense, memo, useMemo, useCallback } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { clearExpiredCache } from "./services/cacheService";
import { LoadingSpinner } from "./components/utilities/utilities";
import "./styles.css";
import { SEOProvider, useSEO } from "./components/seo";

// Lazy load heavy pages
const App = lazy(() => import("./App"));
const UserLogin = lazy(() => import("./components/user/userLogin"));
const UserTrack = lazy(() => import("./components/user/userTrack"));
const LandingPage = lazy(() => import("./components/landing/LandingPage"));
const PublicPage = lazy(() => import("./components/landing/PublicPage"));

function AppRoutes() {
  const location = useLocation();
  const { setSEO } = useSEO();

  const getRouteSEO = useCallback(() => {
    const path = location.pathname;

    if (path === "/" || path === "/admin") {
      if (path === "/") {
        return {
          title: "TrueFin - Smart Loan Management for  Lenders",
          description: "Centralize borrower tracking, collection insights, and loan management. Built for  NBFCs, MFIs, and financial providers.",
          noindex: false,
        };
      }
      return {
        title: "Admin Dashboard",
        description: "View your installment tracking dashboard with real-time analytics, borrower statistics, and collection data.",
        noindex: true,
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
  }, [location.pathname]);

  const seoProps = useMemo(() => {
    const seo = getRouteSEO();
    return {
      title: seo.title,
      description: seo.description,
    };
  }, [getRouteSEO, location.pathname, location.search]);

  React.useEffect(() => {
    setSEO(seoProps);
  }, [seoProps, setSEO]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<App />} />
      <Route path="/track-login" element={<UserLogin />} />
      <Route path="/track/:uniqueId" element={<UserTrack />} />
      {["platform", "why-truefin", "security", "about", "contact", "support", "privacy", "terms", "compliance"].map((page) => (
        <Route key={page} path={`/${page}`} element={<PublicPage page={page} />} />
      ))}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

const MemoizedAppRoutes = memo(AppRoutes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SEOProvider>
        <Suspense fallback={<LoadingSpinner message="Loading page..." />}>
          <MemoizedAppRoutes />
        </Suspense>
      </SEOProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
