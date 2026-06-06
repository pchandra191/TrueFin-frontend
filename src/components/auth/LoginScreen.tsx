import { FormEvent, useState, useEffect, useCallback, memo } from "react";
import { Icon } from "../utilities/utilities";
import { login } from "../../apis/AuthApis";
import { useSEO } from "../seo";

export function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setSEO } = useSEO();

  useEffect(() => {
    setSEO({
      title: "Admin Login",
      description: "Secure admin login for TrueFin installment tracking system. Manage borrowers, loans, and collections.",
    });
  }, [setSEO]);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login(email, password);
      localStorage.setItem("trufin_token", res.token);
      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, [email, password, onLogin]);

  const handleShowPassword = useCallback(() => setShowPassword((v) => !v), []);

  return (
    <main className="login-screen">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <section className="login-panel">
        <div className="login-brand">
          <div className="brand-mark">
            <Icon name="account_balance" />
          </div>
          <h1>Admin Login</h1>
          <p>
            Securely manage installment plans and borrower accounts for
            micro-finance operations.
          </p>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <label className="field">
            <span>Email</span>
            <div className="input-icon">
              <Icon name="mail" />
              <input
                type="email"
                placeholder="admin@fintrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </label>

          <label className="field">
            <span className="field-row">
              Password <a href="#support">Forgot Password?</a>
            </span>
            <div className="input-icon">
              <Icon name="lock" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                className="icon-button inside"
                type="button"
                aria-label="Show password"
                onClick={handleShowPassword}
              >
                <Icon name={showPassword ? "visibility_off" : "visibility"} />
              </button>
            </div>
          </label>

          <label className="check-row">
            <input type="checkbox" />
            <span>Remember this device for 30 days</span>
          </label>

          <button className="primary-button full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"} <Icon name="verified_user" />
          </button>
        </form>

        <footer className="login-footer">
          <div className="security-pill">
            <Icon name="shield" /> AES-256 Military Grade Encryption
          </div>
          <div className="footer-links">
            <a>Privacy Policy</a>
            <span /> <a>Security Audit</a>
            <span /> <a>Support</a>
          </div>
        </footer>
      </section>
      <button className="support-fab">
        <Icon name="help_outline" /> System Support
      </button>
    </main>
  );
}

export default memo(LoginScreen);
