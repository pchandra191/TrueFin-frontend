import { type CSSProperties, useEffect, useState, useMemo, useCallback, memo } from "react";
import { getDashboardStats, getCollections, DashboardStats, Collection } from "../../apis/AnalyticsApis";
import { getBorrowers, Borrower } from "../../apis/BorrowerApis";
import { Icon, LoadingSpinner } from "../utilities/utilities";
import { DataTable } from "../borrower/DataTable";
import { useSEO } from "../seo";

function Metric({
  icon,
  label,
  value,
  trend,
  tone = "primary",
  negative = false,
}: {
  icon: string;
  label: string;
  value: string;
  trend: string;
  tone?: string;
  negative?: boolean;
}) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <div className={`icon-tile ${tone}`}>
          <Icon name={icon} />
        </div>
        <span className={`trend ${tone}`}>
          <Icon name={negative ? "arrow_downward" : "trending_up"} /> {trend}
        </span>
      </div>
      <p>{label}</p>
      <strong>{value}</strong>
    </article>
  );
}

const MemoizedMetric = memo(Metric);

function Legend({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="legend">
      <span className={color} /> <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );
}

const MemoizedLegend = memo(Legend);

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function percentage(part = 0, total = 0) {
  if (!total) return "0%";
  return `${Math.round((part / total) * 100)}%`;
}

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

export function DashboardScreen({ onAddLoan }: { onAddLoan: () => void }) {
  const { setSEO } = useSEO();

  // Initialize from cache immediately
  const [stats, setStats] = useState<DashboardStats | null>(() => 
    getCached<DashboardStats>("tf_cache_med_dashboard_stats")
  );
  const [collections, setCollections] = useState<Collection[]>(() => {
    const cached = getCached<{ collections: Collection[] }>("tf_cache_med_collections_0_6");
    return cached?.collections || [];
  });
  const [recentBorrowers, setRecentBorrowers] = useState<Borrower[]>(() => {
    const cached = getCached<{ borrowers: Borrower[] }>("tf_cache_med_borrowers_1__1_50");
    return cached?.borrowers || [];
  });

  const hasCachedData = stats !== null || collections.length > 0 || recentBorrowers.length > 0;
  const [isLoading, setIsLoading] = useState(!hasCachedData);

  useEffect(() => {
    Promise.all([
      getDashboardStats().then(setStats).catch(() => {}),
      getCollections({ months: 6 }).then(c => setCollections(c.collections)).catch(() => {}),
      getBorrowers({ cityId: 1, limit: 4 }).then(b => setRecentBorrowers(b.borrowers)).catch(() => {}),
    ]).finally(() => setIsLoading(false));
  }, []);

  const maxCollection = useMemo(
    () => Math.max(...collections.map((c) => c.amount), 1),
    [collections]
  );
  const paidPercent = useMemo(
    () => percentage(stats?.paidInstallments, stats?.totalInstallments),
    [stats]
  );
  const defaulterPercent = useMemo(
    () => percentage(stats?.defaulterInstallments, stats?.totalInstallments),
    [stats]
  );
  const pendingPercent = useMemo(
    () => percentage(stats?.pendingInstallments, stats?.totalInstallments),
    [stats]
  );

  const chartLabels = useMemo(
    () =>
      collections.length > 0
        ? collections.map((c) => <span key={c.month}>{c.month}</span>)
        : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
            <span key={m}>{m}</span>
          )),
    [collections]
  );

  const stableOnAddLoan = useCallback(() => onAddLoan(), [onAddLoan]);

  return (
    <main className="content dashboard">
      {isLoading && (!stats || collections.length === 0) && (
        <LoadingSpinner message="Loading dashboard..." />
      )}

      <div className="page-heading">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Real-time installment tracking and collection analytics.</p>
        </div>
        <button className="primary-button" onClick={stableOnAddLoan}>
          <Icon name="add" /> Add New Loan
        </button>
      </div>

      <section className="metric-grid">
        <MemoizedMetric
          icon="group"
          label="Total Borrowers"
          value={stats ? stats.totalBorrowers.toLocaleString() : "—"}
          trend="12%"
        />
        <MemoizedMetric
          icon="account_balance_wallet"
          label="Outstanding Amount"
          value={stats ? formatCurrency(stats.outstandingAmount) : "—"}
          trend="8%"
          tone="tertiary"
        />
        <MemoizedMetric
          icon="bar_chart"
          label="Monthly Collection"
          value={stats ? formatCurrency(stats.monthlyCollection) : "—"}
          trend="24%"
        />
        <MemoizedMetric
          icon="warning"
          label="Defaulters Count"
          value={stats ? String(stats.defaultersCount) : "—"}
          trend="3%"
          tone="error"
          negative
        />
      </section>

      <section className="chart-grid">
        <div className="panel span-8">
          <div className="panel-header">
            <h3>Collections Trend</h3>
            <select>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="bar-chart">
            {collections.map((c, i) => (
              <i
                key={i}
                style={{ height: `${(c.amount / maxCollection) * 100}%` }}
              />
            ))}
          </div>
          <div className="chart-labels">{chartLabels}</div>
        </div>

        <div className="panel span-4 payment-panel">
          <h3>Payment Status</h3>
          <div
            className="donut"
            style={
              {
                "--paid-end": paidPercent,
                "--pending-end": `${parseInt(paidPercent, 10) + parseInt(pendingPercent, 10)}%`,
              } as CSSProperties
            }
          >
            <strong>{paidPercent}</strong>
            <span>Paid</span>
          </div>
          <MemoizedLegend label="Paid" value={paidPercent} color="primary" />
          <MemoizedLegend label="Pending" value={pendingPercent} color="blue" />
          <MemoizedLegend label="Defaulted" value={defaulterPercent} color="orange" />
        </div>
      </section>

      <DataTable title="Recent Activity" rows={recentBorrowers} compact loading={false} />
    </main>
  );
}

export default memo(DashboardScreen);
