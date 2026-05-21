import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackLogin } from "../../apis/UserApis";

export default function userLogin() {
  const [uniqueId, setUniqueId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const normalizedId = uniqueId.trim();
      const data = await trackLogin(normalizedId);
      navigate(`/track/${normalizedId}`, { state: data });
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  }

  return (
    <div className="user-screen">
      <div className="user-card">
        <h1>TruFin</h1>
        <h2>Track your loan</h2>
        <p>Enter your Unique ID to view your installments</p>
        <form onSubmit={handleSubmit} className="user-form">
          <input
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            placeholder="Ex: TRU12345"
            className="user-input"
            required
          />

          <button disabled={loading} className="user-button">
            {loading ? "Checking..." : "Track Loan"}
          </button>
        </form>

        {error && <p className="user-error">{error}</p>}

        <small>Your ID is shared by your TruFin connector</small>
      </div>
    </div>
  );
}
