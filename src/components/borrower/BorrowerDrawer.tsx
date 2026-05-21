import { useState } from "react";
import { Borrower, recordPayment } from "../../apis/BorrowerApis";
import { Icon } from "../utilities/utilities";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const PAID_STATUSES = new Set(["paid", "completed", "sd", "partially-defaulter"]);

function getInstallmentStatus(borrower: Borrower, monthIndex: number) {
  const inst = borrower.installments[monthIndex];
  if (!inst) return "upcoming";
  if (inst.status === "defaulter") return "missed";
  if (PAID_STATUSES.has(inst.status)) return "paid";
  return "upcoming";
}

function totalPaid(borrower: Borrower) {
  return borrower.installments
    .filter((i) => PAID_STATUSES.has(i.status))
    .reduce((sum, i) => sum + i.amount, 0);
}

function defaulterCount(borrower: Borrower) {
  return borrower.installments.filter((i) => i.status === "defaulter").length;
}

export function BorrowerDrawer({
  borrower,
  open,
  onClose,
  onUpdate,
}: {
  borrower: Borrower | null;
  open: boolean;
  onClose: () => void;
  onUpdate?: (borrower?: Borrower) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [payMonth, setPayMonth] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payError, setPayError] = useState("");

  if (!borrower) return null;
  const selectedBorrower = borrower;

  const paid = totalPaid(selectedBorrower);
  const ipm = selectedBorrower.IPM?.[selectedBorrower.IPM.length - 1] ?? 0;
  const remaining = ipm * 12 - paid;
  const defaults = defaulterCount(selectedBorrower);

  async function handleRecordPayment() {
    if (!payMonth || !payAmount) {
      setPayError("Month and amount are required");
      return;
    }
    setPayError("");
    setRecording(true);
    try {
      const updatedBorrower = await recordPayment(selectedBorrower.uniqueId, {
        month: payMonth,
        amount: Number(payAmount),
        status: "paid",
      });
      setPayMonth("");
      setPayAmount("");
      onUpdate?.(updatedBorrower);
    } catch (err: any) {
      setPayError(err.message || "Failed to record payment");
    } finally {
      setRecording(false);
    }
  }

  return (
    <aside className={`drawer ${open ? "open" : ""}`}>
      <header>
        <div>
          <button className="icon-button" onClick={onClose}>
            <Icon name="close" />
          </button>
          <h3>Borrower Profile</h3>
        </div>
        <div>
          <button className="icon-button">
            <Icon name="edit" />
          </button>
          <button className="icon-button danger">
            <Icon name="delete" />
          </button>
        </div>
      </header>

      <div className="drawer-body">
        <section className="profile-summary">
          <div className="avatar xl primary">
            {selectedBorrower.name.slice(0, 2).toUpperCase()}
          </div>
          <h4>{selectedBorrower.name}</h4>
          <p>
            {selectedBorrower.connectorName ? `via ${selectedBorrower.connectorName}` : "No connector"} •{" "}
            City {selectedBorrower.cityId}
          </p>
          {selectedBorrower.phoneNumber && <p>{selectedBorrower.phoneNumber}</p>}
        </section>

        <section className="finance-grid">
          <div>
            <span>Total Paid</span>
            <strong>₹{paid.toLocaleString()}</strong>
          </div>
          <div>
            <span>Remaining</span>
            <strong>₹{remaining.toLocaleString()}</strong>
          </div>
          <div className={defaults > 0 ? "alert" : ""}>
            <span>Defaulted</span>
            <strong>{defaults}</strong>
          </div>
        </section>

        <section>
          <div className="section-head">
            <h5>12-Month Installment History</h5>
            <span>{selectedBorrower.installmentStartMonth || "—"}</span>
          </div>
          <div className="month-grid">
            {MONTHS.map((month, index) => {
              const statusClass = getInstallmentStatus(selectedBorrower, index);
              return (
                <div className={statusClass} key={month}>
                  <span>{month}</span>
                  {statusClass === "missed" ? (
                    <Icon name="cancel" filled />
                  ) : statusClass === "paid" ? (
                    <Icon name="check_circle" filled />
                  ) : (
                    <i />
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="general-info">
          <h5>General Information</h5>
          <div>
            <span>Last Left</span>
            <p>{selectedBorrower.lastLeft}</p>
          </div>
          <div>
            <span>IPM</span>
            <p>₹{ipm.toLocaleString()}</p>
          </div>
          <div>
            <span>Condition</span>
            <p>{selectedBorrower.installmentCondition}</p>
          </div>
          <div>
            <span>Phone</span>
            <p>{selectedBorrower.phoneNumber || "—"}</p>
          </div>
          <div className="wide">
            <span>Unique ID</span>
            <p>{selectedBorrower.uniqueId}</p>
          </div>
        </section>

        {/* Record Payment Form */}
        <section className="general-info">
          <h5>Record Payment</h5>
          {payError && <p style={{ color: "red", fontSize: "12px" }}>{payError}</p>}
          <div>
            <span>Month</span>
            <input
              type="text"
              placeholder="e.g. January"
              value={payMonth}
              onChange={(e) => setPayMonth(e.target.value)}
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
            />
          </div>
          <div>
            <span>Amount</span>
            <input
              type="number"
              placeholder="e.g. 1000"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              style={{ width: "100%", padding: "6px", marginTop: "4px" }}
            />
          </div>
        </section>
      </div>

      <footer>
        <button
          className="primary-button full"
          onClick={handleRecordPayment}
          disabled={recording}
        >
          {recording ? "Recording..." : "Record Payment"}
        </button>
        <button className="secondary-button icon-only">
          <Icon name="print" />
        </button>
      </footer>
    </aside>
  );
}

export default BorrowerDrawer;
