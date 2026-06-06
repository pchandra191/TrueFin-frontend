import { FormEvent, useState, useEffect, useCallback, memo } from "react";
import { Icon } from "../utilities/utilities";
import { login } from "../../apis/AuthApis";
import { useSEO } from "../seo";
import { Link } from "react-router-dom";

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
            <img src="/favicon-32x32.png" alt="TrueFin" className="brand-logo" />
          </div>
          <h1>Admin Login</h1>
          <p>
            Securely manage installment plans, borrowers, and collections
            with TrueFin.
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
              Password <Link to="/support">Forgot Password?</Link>
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
            <Link to="/privacy">Privacy Policy</Link>
            <span /> <Link to="/security">Security Audit</Link>
            <span /> <Link to="/support">Support</Link>
          </div>
        </footer>
      </section>
      <Link className="support-fab" to="/support">
        <Icon name="help_outline" /> System Support
      </Link>
    </main>
  );
}

export default memo(LoginScreen);
