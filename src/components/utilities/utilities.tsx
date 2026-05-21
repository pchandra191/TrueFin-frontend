import React from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Screen = "login" | "dashboard" | "borrowers" | "add";

export type BorrowerStatus = "Approved" | "Pending" | "Delayed" | "Active" | "Defaulter" | "Closed";

// ─── Icon ─────────────────────────────────────────────────────────────────────

export function Icon({ name, filled = false }: { name: string; filled?: boolean }) {
  return (
    <span
      className="material-symbols-outlined"
      style={{
        fontVariationSettings: filled
          ? "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 24"
          : undefined,
      }}
    >
      {name}
    </span>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

export function Status({ status }: { status: BorrowerStatus }) {
  const tone =
    status === "Defaulter" || status === "Delayed"
      ? "danger"
      : status === "Pending"
      ? "warning"
      : status === "Closed"
      ? "neutral"
      : "success";
  return (
    <span className={`status ${tone}`}>
      <i />
      {status}
    </span>
  );
}

// ─── AdminShell ───────────────────────────────────────────────────────────────

const navItems: Array<{ screen: Screen; icon: string; label: string }> = [
  { screen: "dashboard", icon: "dashboard", label: "Dashboard" },
  { screen: "borrowers", icon: "group", label: "Borrowers" },
  { screen: "add", icon: "payments", label: "Loans" },
  { screen: "dashboard", icon: "analytics", label: "Analytics" },
  { screen: "dashboard", icon: "settings", label: "Settings" },
];

export function AdminShell({
  activeScreen,
  children,
  onNavigate,
  adminName = "Admin User",
  onLogout,
}: {
  activeScreen: Screen;
  children: React.ReactNode;
  onNavigate: (screen: Screen) => void;
  adminName?: string;
  onLogout?: () => void;
}) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h1>TrueFin Admin</h1>
          <p>Installment Manager</p>
        </div>
        <nav>
          {navItems.map((item, index) => {
            const isActive =
              item.screen === activeScreen ||
              (activeScreen === "add" && item.label === "Loans");
            return (
              <button
                className={`nav-link ${isActive ? "active" : ""}`}
                key={`${item.label}-${index}`}
                onClick={() => onNavigate(item.screen)}
              >
                <Icon name={item.icon} filled={isActive} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="admin-card">
          <div className="avatar primary">
            {adminName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <strong>{adminName}</strong>
            <span>Super Admin</span>
          </div>
          <button className="icon-button" aria-label="Log out" onClick={onLogout}>
            <Icon name="logout" />
          </button>
        </div>
      </aside>

      <header className="topbar">
        <div className="mobile-brand">
          <button className="icon-button">
            <Icon name="menu" />
          </button>
          <span>Installment Tracker</span>
        </div>
        <div className="search">
          <Icon name="search" />
          <input placeholder="Search borrowers, loans, or transactions..." />
        </div>
        <div className="topbar-actions">
          <button className="text-button">Support</button>
          <button className="icon-button notify" aria-label="Notifications">
            <Icon name="notifications" />
          </button>
          <button className="icon-button" aria-label="Help">
            <Icon name="help_outline" />
          </button>
          <div className="topbar-user">
            <div>
              <strong>{adminName}</strong>
              <span>System Manager</span>
            </div>
            <div className="avatar secondary">
              {adminName.slice(0, 1).toUpperCase()}
            </div>
          </div>
          <button className="icon-button" aria-label="Log out" onClick={onLogout}>
            <Icon name="logout" />
          </button>
        </div>
      </header>

      {children}
    </div>
  );
}

// ─── Form Primitives ──────────────────────────────────────────────────────────

export function FormPanel({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="form-panel">
      <h3>
        <Icon name={icon} /> {title}
      </h3>
      <div className="form-stack">{children}</div>
    </section>
  );
}

export function Input({
  label,
  placeholder,
  hint,
  type = "text",
  prefix,
  suffix,
  value,
  onChange,
}: {
  label: string;
  placeholder?: string;
  hint?: string;
  type?: string;
  prefix?: string;
  suffix?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <div className={`currency-field ${prefix || suffix ? "has-adornment" : ""}`}>
        {prefix && <b>{prefix}</b>}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} />
        {suffix && <b>{suffix}</b>}
      </div>
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function Select({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
