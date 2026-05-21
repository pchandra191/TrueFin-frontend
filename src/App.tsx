import { useState, useEffect } from "react";
import { AdminShell, type Screen } from "./components/utilities/utilities";
import { LoginScreen } from "./components/auth/LoginScreen";
import { BorrowerManagementScreen } from "./components/borrower/BorrowerManagementScreen";
import { DashboardScreen } from "./components/analytics/DashboardScreen";
import { AddBorrowerScreen } from "./components/borrower/AddNewBorrower";
import { getMe, logout } from "./apis/AuthApis";

function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin User");
  const [authChecked, setAuthChecked] = useState(false);

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
