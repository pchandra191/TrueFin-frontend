import { useState, useEffect, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { AdminShell, type Screen } from "./components/utilities/utilities";
import { LoginScreen } from "./components/auth/LoginScreen";
import { BorrowerManagementScreen } from "./components/borrower/BorrowerManagementScreen";
import { DashboardScreen } from "./components/analytics/DashboardScreen";
import { AddBorrowerScreen } from "./components/borrower/AddNewBorrower";
import { LoadingSpinner } from "./components/utilities/utilities";
import { getMe, logout } from "./apis/AuthApis";
import { useSEO } from "./components/seo";

const SCREEN_SEO: Record<Screen, { title: string; description: string }> = {
  login: { title: "Login", description: "Secure admin login for TrueFin installment tracking system." },
  dashboard: { title: "Dashboard", description: "View installment analytics, borrower statistics, and collection trends." },
  borrowers: { title: "Borrowers", description: "Manage borrower records, installment history, and payment tracking." },
  add: { title: "Add New Loan", description: "Create new borrower records and loan installment plans." },
};

function App() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("login");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin User");
  const [authChecked, setAuthChecked] = useState(false);
  const { setSEO } = useSEO();

  useEffect(() => {
    const token = localStorage.getItem("trufin_token");
    if (token) {
      getMe()
        .then((me) => {
          setAdminName(me.name || me.email || "Admin User");
          setScreen("dashboard");
        })
        .catch(() => {
          localStorage.removeItem("trufin_token");
        })
        .finally(() => setAuthChecked(true));
    } else {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    const seo = SCREEN_SEO[screen];
    if (seo) {
      setSEO({
        title: seo.title,
        description: seo.description,
        keywords: `TrueFin, ${seo.title.toLowerCase()}, microfinance, loan management`,
      });
    }
  }, [screen, setSEO]);

  const handleLogin = useCallback(() => {
    getMe().then((me) => setAdminName(me.name || me.email || "Admin User")).catch(() => {});
    setScreen("dashboard");
  }, []);

  const handleNavigate = useCallback((next: Screen) => setScreen(next), []);

  const handleHome = useCallback(() => navigate("/"), [navigate]);

  const handleLogout = useCallback(() => {
    logout();
    setAdminName("Admin User");
    setScreen("login");
  }, []);

  const handleAddLoan = useCallback(() => setScreen("add"), []);

  const handleDrawerToggle = useCallback(() => setDrawerOpen((open) => !open), []);

  const handleCancelAdd = useCallback(() => setScreen("borrowers"), []);

  const handleSuccessAdd = useCallback(() => setScreen("borrowers"), []);

  if (!authChecked) return <LoadingSpinner message="Verifying session..." />;

  if (screen === "login") {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <AdminShell
      activeScreen={screen}
      onNavigate={handleNavigate}
      adminName={adminName}
      onLogout={handleLogout}
      onHome={handleHome}
    >
      {screen === "dashboard" && <DashboardScreen onAddLoan={handleAddLoan} />}
      {screen === "borrowers" && (
        <BorrowerManagementScreen
          drawerOpen={drawerOpen}
          onDrawerToggle={handleDrawerToggle}
          onAddBorrower={handleAddLoan}
        />
      )}
      {screen === "add" && (
        <AddBorrowerScreen
          onCancel={handleCancelAdd}
          onSuccess={handleSuccessAdd}
        />
      )}
    </AdminShell>
  );
}

export default memo(App);
