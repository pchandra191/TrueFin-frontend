import { Borrower } from "../../apis/BorrowerApis";
import { Icon, Status, BorrowerStatus, LoadingSpinner } from "../utilities/utilities";
import { memo, useMemo } from "react";

const PAID_STATUSES = new Set(["paid", "completed", "sd", "partially-defaulter"]);

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getAvatarTone(index: number) {
  const tones = ["primary", "secondary", "tertiary"];
  return tones[index % tones.length];
}

function mapStatus(installments: Borrower["installments"]): BorrowerStatus {
  const hasDefaulter = installments.some((i) => i.status === "defaulter");
  const allPaid =
    installments.length > 0 &&
    installments.every((i) => PAID_STATUSES.has(i.status));
  if (hasDefaulter) return "Defaulter";
  if (allPaid) return "Closed";
  return "Active";
}

export function DataTable({
  rows,
  title,
  compact = false,
  loading = false,
  onSelect,
}: {
  rows: Borrower[];
  title?: string;
  compact?: boolean;
  loading?: boolean;
  onSelect?: (borrower: Borrower) => void;
}) {
  if (loading) {
    return (
      <section className="table-card">
        <LoadingSpinner message="Loading borrowers..." />
      </section>
    );
  }

  const tableRows = useMemo(() =>
    rows.map((row, index) => {
      const status = mapStatus(row.installments);
      const initials = getInitials(row.name);
      const tone = getAvatarTone(index);
      const ipm = row.IPM?.[row.IPM.length - 1] ?? 0;

      return (
        <tr
          key={row.uniqueId || row._id}
          onClick={() => onSelect?.(row)}
          className={index === 0 && !compact ? "selected" : ""}
          style={{ cursor: onSelect ? "pointer" : "default" }}
        >
          <td>
            <div className="name-cell">
              <div className={`avatar ${tone}`}>{initials}</div>
              <div>
                <strong>{row.name}</strong>
                <span>{row.phoneNumber || row.uniqueId}</span>
              </div>
            </div>
          </td>
          {compact ? (
            <>
              <td>{row.borrowerId}</td>
              <td>₹{ipm.toLocaleString()}</td>
              <td>
                <Status status={status} />
              </td>
              <td>
                <button className="icon-button">
                  <Icon name="visibility" />
                </button>
              </td>
            </>
          ) : (
            <>
              <td>{row.connectorName || "—"}</td>
              <td>{row.cityId}</td>
              <td>₹{ipm.toLocaleString()}</td>
              <td>{row.lastLeft}</td>
              <td>
                <Status status={status} />
              </td>
            </>
          )}
        </tr>
      );
    }),
  [rows, compact, onSelect]);

  return (
    <section className="table-card">
      {title && (
        <div className="table-title">
          <h3>{title}</h3>
          <button>View All</button>
        </div>
      )}
      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Borrower Name</th>
              {compact ? (
                <>
                  <th>Borrower ID</th>
                  <th>IPM</th>
                  <th>Status</th>
                  <th>Actions</th>
                </>
              ) : (
                <>
                  <th>Connector</th>
                  <th>City ID</th>
                  <th>IPM</th>
                  <th>Last Left</th>
                  <th>Status</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </section>
  );
}

export default memo(DataTable);
