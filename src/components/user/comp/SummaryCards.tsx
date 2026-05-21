export default function SummaryCards({ summary }: any) {
  const Card = ({ label, value }: any) => (
    <div className="track-card">
      <p>{label}</p>
      <strong>{value}</strong>
    </div>
  );

  return (
    <div className="track-card-grid">
      <Card label="Total Paid" value={`Rs ${summary.totalPaid}`} />
      <Card label="Outstanding" value={`Rs ${summary.outstanding}`} />
      <Card label="Installments" value={summary.totalInstallments} />
      <Card label="Missed" value={summary.defaulterCount} />
      <Card label="Installment / Month" value={`Rs ${summary.installmentPerMonth || 0}`} />
      <Card label="Upcoming Installment" value={ summary.totalUpcomingInstallment || 0} />
    </div>
  );
}
