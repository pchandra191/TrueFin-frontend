import { FormEvent, useMemo, useState } from "react";
import { createBorrower } from "../../apis/BorrowerApis";
import { Icon, FormPanel, Input, Select } from "../utilities/utilities";

const CITIES = [
  { id: 1, name: "Shahjahanpur" },
  { id: 2, name: "Bareilly" },
  { id: 3, name: "Tilhar" },
  { id: 4, name: "Katra" },
  { id: 5, name: "Haldwani" },
  { id: 6, name: "Dehradun" },
  { id: 7, name: "Moradabad" },
];

export function AddBorrowerScreen({
  onCancel,
  onSuccess,
}: {
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cityId, setCityId] = useState("1");
  const [connectorName, setConnectorName] = useState("");
  const [ipm, setIpm] = useState("");
  const [lastLeft, setLastLeft] = useState("");
  const [installmentStartMonth, setInstallmentStartMonth] = useState("");
  const [installmentCondition, setInstallmentCondition] = useState("NA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const schedule = useMemo(() => {
    if (!installmentStartMonth) return [];
    const [year, month] = installmentStartMonth.split("-").map(Number);
    return Array.from({ length: 12 }, (_, i) => {
      const d = new Date(year, (month ?? 1) - 1 + i, 15);
      return d.toLocaleDateString("en-IN", { month: "short", year: "numeric", day: "numeric" });
    });
  }, [installmentStartMonth]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!name || !cityId) {
      setError("Name and City are required");
      return;
    }
    setLoading(true);
    try {
      await createBorrower({
        name,
        phoneNumber,
        cityId: Number(cityId),
        connectorName,
        IPM: ipm ? [Number(ipm)] : [0],
        lastLeft: lastLeft || "0",
        installmentStartMonth,
        installmentCondition,
        installments: [],
      });
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Failed to create borrower");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="content add-borrower">
      <div className="breadcrumb">
        <a>Loans</a>
        <Icon name="chevron_right" />
        <strong>Add New Borrower</strong>
      </div>
      <div className="page-heading">
        <div>
          <h2>Add New Borrower</h2>
          <p>Register a new client and configure their repayment schedule.</p>
        </div>
      </div>

      {error && <div className="form-error">{error}</div>}

      <form className="borrower-form" onSubmit={submit}>
        <div className="form-grid">
          <FormPanel icon="person" title="Borrower Identity">
            <Input
              label="Full Name"
              placeholder="e.g. Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="Phone Number"
              placeholder="e.g. 9876543210"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <Select
              label="City"
              options={CITIES.map((c) => `${c.name} (${c.id})`)}
              onChange={(e) => {
                const match = e.target.value.match(/\((\d+)\)/);
                if (match) setCityId(match[1]);
              }}
            />
            <Input
              label="Connector Name"
              placeholder="Assigned relationship manager"
              hint="The individual responsible for initiating this loan."
              value={connectorName}
              onChange={(e) => setConnectorName(e.target.value)}
            />
          </FormPanel>

          <FormPanel icon="receipt_long" title="Loan Details">
            <div className="two-col">
              <Input
                label="IPM (Installment Per Month)"
                placeholder="e.g. 1000"
                prefix="₹"
                value={ipm}
                onChange={(e) => setIpm(e.target.value)}
              />
              <Input
                label="Last Left Amount"
                placeholder="e.g. 12000"
                prefix="₹"
                value={lastLeft}
                onChange={(e) => setLastLeft(e.target.value)}
              />
              <Input
                label="Start Month"
                type="month"
                value={installmentStartMonth}
                onChange={(e) => setInstallmentStartMonth(e.target.value)}
              />
              <Select
                label="Installment Condition"
                options={["NA", "Standard", "Premium", "Subprime", "Secured"]}
                value={installmentCondition}
                onChange={(e) => setInstallmentCondition(e.target.value)}
              />
            </div>
          </FormPanel>
        </div>

        {schedule.length > 0 && (
          <section className="panel schedule-panel">
            <div className="panel-header">
              <div>
                <h3>Auto-generated Installment Schedule</h3>
                <p>Projected 12-month payment timeline based on details above.</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Due Date</th>
                  <th>IPM Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((date, index) => (
                  <tr key={date}>
                    <td>{String(index + 1).padStart(2, "0")}</td>
                    <td>{date}</td>
                    <td>
                      <strong>₹{ipm ? Number(ipm).toLocaleString() : "—"}</strong>
                    </td>
                    <td>
                      <span className="status neutral">Scheduled</span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>Total Commitment</td>
                  <td>₹{ipm ? (Number(ipm) * 12).toLocaleString() : "—"}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </section>
        )}

        <div className="form-actions">
          <button
            className="secondary-button large"
            type="button"
            onClick={onCancel}
          >
            Cancel & Reset
          </button>
          <button
            className="primary-button large"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Borrower"}{" "}
            <Icon name="arrow_forward" />
          </button>
        </div>
      </form>
    </main>
  );
}

export default AddBorrowerScreen;
