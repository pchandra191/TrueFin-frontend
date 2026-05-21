import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SummaryCards from "./comp/SummaryCards";
import ProgressBar from "./comp/ProgressBar";
import InstallmentTable from "./comp/InstallmentTable";
import { getTrackByUniqueId, UserTrackResponse } from "../../apis/UserApis";
import { useSEO } from "../seo";

export default function UserTrack() {
  const { uniqueId } = useParams();
  const location = useLocation();
  const [data, setData] = useState<UserTrackResponse | null>(location.state ?? null);
  const [loading, setLoading] = useState(!location.state);
  const [error, setError] = useState("");
  const { setSEO } = useSEO();

  useEffect(() => {
    if (!uniqueId || data) return;

    async function fetchData() {
      if (!uniqueId) return;
      try {
        const payload = await getTrackByUniqueId(uniqueId);
        setData(payload);
      } catch (err: any) {
        setError(err.message || "Unable to load tracking details.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [data, uniqueId]);

  useEffect(() => {
    if (data) {
      setSEO({
        title: `${data.name} - Loan Tracking | TrueFin`,
        description: `View installment history for ${data.name}. Paid: ₹${data.summary.totalPaid || 0}. Outstanding: ₹${data.lastLeft || 0}.`,
      });
    }
  }, [data, setSEO]);

  if (loading) return <div className="user-loading">Loading...</div>;
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
  const totalUpcomingInstallment = (data.installments.filter((installment) => installment.status?.toLowerCase() === "pending")).length;
  
  console.log(totalUpcomingInstallment)
  const enrichedSummary = {
    ...data.summary,
    totalPaid,
    outstanding: computedOutstanding,
    installmentPerMonth,
    totalUpcomingInstallment,
  };

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
