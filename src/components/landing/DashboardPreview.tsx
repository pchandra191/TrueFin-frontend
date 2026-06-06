import { memo, useMemo } from "react";
import { Icon, Status, type BorrowerStatus } from "../utilities/utilities";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

const BORROWERS = [
  { name: "Rajesh Kumar", id: "TRU-1042", phone: "+91 98****221", ipm: 12500, status: "Active" as BorrowerStatus },
  { name: "Sunita Devi", id: "TRU-1088", phone: "+91 98****443", ipm: 8000, status: "Active" as BorrowerStatus },
  { name: "Amit Singh", id: "TRU-1193", phone: "+91 98****772", ipm: 15000, status: "Defaulter" as BorrowerStatus },
  { name: "Priya Sharma", id: "TRU-1201", phone: "+91 98****009", ipm: 20000, status: "Closed" as BorrowerStatus },
];

function formatCurrency(v: number) {
  if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
  return `₹${v.toLocaleString()}`;
}

export const DashboardPreview = memo(function DashboardPreview() {
  const maxCollection = useMemo(() => Math.max(40, 65, 50, 78, 60, 85), []);

  const chartLabels = useMemo(
    () => MONTHS.map((m) => <span key={m}>{m}</span>),
    []
  );

  return (
    <section className="tf-dashboard">
      <div className="tf-dashboard-body tf-dashboard-body-compact">
        <div className="metric-grid">
          {[
            { icon: "group", label: "Total Borrowers", value: "1,284", trend: "12%" },
            { icon: "account_balance_wallet", label: "Outstanding Amount", value: formatCurrency(28000000), trend: "8%", tone: "tertiary" },
            { icon: "bar_chart", label: "Monthly Collection", value: formatCurrency(4850000), trend: "24%" },
            { icon: "warning", label: "Defaulters Count", value: "23", trend: "3%", tone: "error", negative: true },
          ].map((m) => (
            <article key={m.label} className="metric-card">
              <div className="metric-top">
                <div className={`icon-tile ${m.tone || "primary"}`}>
                  <Icon name={m.icon} />
                </div>
                <span className={`trend ${m.tone || "primary"} ${m.negative ? "tf-trend-down" : ""}`}>
                  <Icon name={m.negative ? "arrow_downward" : "trending_up"} /> {m.trend}
                </span>
              </div>
              <p>{m.label}</p>
              <strong>{m.value}</strong>
            </article>
          ))}
        </div>

        <div className="chart-grid">
          <div className="panel span-8">
            <div className="panel-header">
              <h3>Collections Trend</h3>
              <select>
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="bar-chart">
              {[40, 65, 50, 78, 60, 85].map((h, i) => (
                <i key={i} style={{ height: `${(h / maxCollection) * 100}%` }} />
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
                  "--paid-end": "68%",
                  "--pending-end": "88%",
                } as React.CSSProperties
              }
            >
              <strong>68%</strong>
              <span>Paid</span>
            </div>
            <div className="legend">
              <span className="primary" /> <p>Paid</p>
              <strong>68%</strong>
            </div>
            <div className="legend">
              <span className="blue" /> <p>Pending</p>
              <strong>20%</strong>
            </div>
            <div className="legend">
              <span className="orange" /> <p>Defaulted</p>
              <strong>12%</strong>
            </div>
          </div>
        </div>

        <div className="table-card">
          <div className="table-title">
            <h3>Recent Activity</h3>
            <button className="tf-table-viewall">View All</button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Borrower</th>
                  <th>Borrower ID</th>
                  <th>IPM</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {BORROWERS.map((b, i) => (
                  <tr key={b.id} className={i === 0 ? "selected" : ""}>
                    <td>
                      <div className="name-cell">
                        <div className={`avatar ${["primary", "secondary", "tertiary"][i % 3]}`}>
                          {b.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <strong>{b.name}</strong>
                          <span>{b.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td>{b.id}</td>
                    <td className="tf-ipm-cell">₹{b.ipm.toLocaleString()}</td>
                    <td>
                      <Status status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
});
