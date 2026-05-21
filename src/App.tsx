import { useState, useEffect } from "react";
import { AdminShell, type Screen } from "./components/utilities/utilities";
import { LoginScreen } from "./components/auth/LoginScreen";
import { BorrowerManagementScreen } from "./components/borrower/BorrowerManagementScreen";
import { DashboardScreen } from "./components/analytics/DashboardScreen";
import { AddBorrowerScreen } from "./components/borrower/AddNewBorrower";
import { getMe, logout } from "./apis/AuthApis";
import { useSEO } from "./components/seo";

const SCREEN_SEO: Record<Screen, { title: string; description: string }> = {
  login: { title: "Login", description: "Secure admin login for TrueFin installment tracking system." },
  dashboard: { title: "Dashboard", description: "View installment analytics, borrower statistics, and collection trends." },
  borrowers: { title: "Borrowers", description: "Manage borrower records, installment history, and payment tracking." },
  add: { title: "Add New Loan", description: "Create new borrower records and loan installment plans." },
};

function App() {
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

  if (!authChecked) return null;

  if (screen === "login") {
    return (
      <LoginScreen
        onLogin={() => {
          getMe().then((me) => setAdminName(me.name || me.email || "Admin User")).catch(() => {});
          setScreen("dashboard");
        }}
      />
    );
  }

  return (
    <AdminShell
      activeScreen={screen}
      onNavigate={(next) => setScreen(next)}
      adminName={adminName}
      onLogout={() => {
        logout();
        setAdminName("Admin User");
        setScreen("login");
      }}
    >
      {screen === "dashboard" && (
        <DashboardScreen onAddLoan={() => setScreen("add")} />
      )}
      {screen === "borrowers" && (
        <BorrowerManagementScreen
          drawerOpen={drawerOpen}
          onDrawerToggle={() => setDrawerOpen((open) => !open)}
          onAddBorrower={() => setScreen("add")}
        />
      )}
      {screen === "add" && (
        <AddBorrowerScreen
          onCancel={() => setScreen("borrowers")}
          onSuccess={() => setScreen("borrowers")}
        />
      )}
    </AdminShell>
  );
}

export default App;
