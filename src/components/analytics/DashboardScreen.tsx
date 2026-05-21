import { type CSSProperties, useEffect, useState } from "react";
import { getDashboardStats, getCollections, DashboardStats, Collection } from "../../apis/AnalyticsApis";
import { getBorrowers, Borrower } from "../../apis/BorrowerApis";
import { Icon } from "../utilities/utilities";
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

export function DashboardScreen({ onAddLoan }: { onAddLoan: () => void }) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [recentBorrowers, setRecentBorrowers] = useState<Borrower[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [s, c, b] = await Promise.all([
          getDashboardStats(),
          getCollections({ months: 6 }),
          getBorrowers({ cityId: 1, limit: 4 }),
        ]);
        setStats(s);
        setCollections(c.collections);
        setRecentBorrowers(b.borrowers);
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const maxCollection = Math.max(...collections.map((c) => c.amount), 1);
  const paidPercent = percentage(stats?.paidInstallments, stats?.totalInstallments);
  const defaulterPercent = percentage(stats?.defaulterInstallments, stats?.totalInstallments);
  const pendingPercent = percentage(stats?.pendingInstallments, stats?.totalInstallments);

  return (
    <main className="content dashboard">
      <div className="page-heading">
        <div>
          <h2>Dashboard Overview</h2>
          <p>Real-time installment tracking and collection analytics.</p>
        </div>
        <button className="primary-button" onClick={onAddLoan}>
          <Icon name="add" /> Add New Loan
        </button>
      </div>

      <section className="metric-grid">
        <Metric
          icon="group"
          label="Total Borrowers"
          value={stats ? stats.totalBorrowers.toLocaleString() : "—"}
          trend="12%"
        />
        <Metric
          icon="account_balance_wallet"
          label="Outstanding Amount"
          value={stats ? formatCurrency(stats.outstandingAmount) : "—"}
          trend="8%"
          tone="tertiary"
        />
        <Metric
          icon="bar_chart"
          label="Monthly Collection"
          value={stats ? formatCurrency(stats.monthlyCollection) : "—"}
          trend="24%"
        />
        <Metric
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
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <i key={i} style={{ height: "40%" }} />
                ))
              : collections.map((c, i) => (
                  <i
                    key={i}
                    style={{ height: `${(c.amount / maxCollection) * 100}%` }}
                  />
                ))}
          </div>
          <div className="chart-labels">
            {collections.length > 0
              ? collections.map((c) => <span key={c.month}>{c.month}</span>)
              : ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
                  <span key={m}>{m}</span>
                ))}
          </div>
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
          <Legend label="Paid" value={paidPercent} color="primary" />
          <Legend label="Pending" value={pendingPercent} color="blue" />
          <Legend label="Defaulted" value={defaulterPercent} color="orange" />
        </div>
      </section>

      <DataTable title="Recent Activity" rows={recentBorrowers} compact loading={loading} />
    </main>
  );
}

export default DashboardScreen;
