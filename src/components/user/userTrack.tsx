import { useEffect, useState, useMemo, memo } from "react";
import { useLocation, useParams } from "react-router-dom";
import SummaryCards from "./comp/SummaryCards";
import ProgressBar from "./comp/ProgressBar";
import InstallmentTable from "./comp/InstallmentTable";
import { getTrackByUniqueId, UserTrackResponse } from "../../apis/UserApis";
import { LoadingSpinner } from "../utilities/utilities";
import { useSEO } from "../seo";

function getCached<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as { data: T; timestamp: number };
    if (Date.now() - parsed.timestamp > 10 * 60 * 1000) return null;
    return parsed.data;
  } catch {
    return null;
  }
}

export default function UserTrack() {
  const { uniqueId } = useParams();
  const location = useLocation();
  
  // Initialize from cache synchronously
  const [data, setData] = useState<UserTrackResponse | null>(() => {
    if (location.state) return location.state;
    if (!uniqueId) return null;
    const cacheKey = `tf_cache_med_track_${uniqueId}`;
    return getCached<UserTrackResponse>(cacheKey);
  });
  
  const [loading, setLoading] = useState(data === null);
  const [error, setError] = useState("");
  const { setSEO } = useSEO();

  useEffect(() => {
    if (!uniqueId || data) return;

    getTrackByUniqueId(uniqueId)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [data, uniqueId]);

  useEffect(() => {
    if (data) {
      setSEO({
        title: `${data.name} - Loan Tracking | TrueFin`,
        description: `View installment history for ${data.name}. Paid: ₹${data.summary.totalPaid || 0}. Outstanding: ₹${data.lastLeft || 0}.`,
      });
    }
  }, [data, setSEO]);

  if (loading) return <LoadingSpinner message="Loading your loan details..." />;
  if (error || !data) return <div className="user-error-block">{error || "No tracking data found."}</div>;

  const extractAmount = (value?: string | number) => {
    if (typeof value === "number") return value;
    if (!value) return 0;
    const match = value.match(/-?\d+(\.\d+)?/);
    return match ? Number(match[0]) : 0;
  };

  const totalPaid = Number(data.summary.totalPaid || 0);
  const installmentConditionAmount =
    data.installmentCondition && data.installmentCondition !== "NA"
      ? extractAmount(data.installmentCondition)
      : null;
  const baseOutstanding = installmentConditionAmount ?? extractAmount(data.lastLeft);
  const computedOutstanding = Math.max(0, baseOutstanding - totalPaid);
  const installmentPerMonth = data.IPM?.[0] ?? 0;

  const totalUpcomingInstallment = useMemo(
    () => data.installments.filter((installment) => installment.status?.toLowerCase() === "pending").length,
    [data.installments]
  );

  const enrichedSummary = useMemo(() => ({
    ...data.summary,
    totalPaid,
    outstanding: computedOutstanding,
    installmentPerMonth,
    totalUpcomingInstallment,
  }), [data.summary, totalPaid, computedOutstanding, installmentPerMonth, totalUpcomingInstallment]);

  const totalAmount = Math.max(1, totalPaid + computedOutstanding);
  const progress = (totalPaid / totalAmount) * 100;

  return (
    <div className="track-shell">
      <div className="track-wrap">
        <div className="track-header">
          <h1>{data.name}</h1>
          <p>Borrower ID: {data.uniqueId}</p>
          <div>Connector: {data.connectorName} | City: {data.cityId}</div>
        </div>

        <SummaryCards summary={enrichedSummary} />
        <ProgressBar progress={progress} />
        <InstallmentTable installments={data.installments} />
      </div>
    </div>
  );
}
