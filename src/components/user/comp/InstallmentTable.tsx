export default function InstallmentTable({ installments }: any) {
  const badge = (status: string) => {
    const styles: Record<string, string> = {
      paid: "is-paid",
      pending: "is-pending",
      defaulter: "is-defaulter",
    };

    return <span className={`track-badge ${styles[status] || "is-pending"}`}>{status}</span>;
  };

  return (
    <div className="track-panel">
      <h2 className="track-panel-title">Installment History</h2>
      <div className="track-table-wrap">
        <table className="track-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date Paid</th>
            </tr>
          </thead>
          <tbody>
            {installments.map((item: any, idx: number) => (
              <tr key={idx}>
                <td>{item.month}</td>
                <td>Rs {item.amount}</td>
                <td>{badge(item.status)}</td>
                <td>{item.datePaid || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
