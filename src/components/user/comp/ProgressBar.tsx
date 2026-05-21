export default function ProgressBar({ progress }: any) {
  return (
    <div className="track-panel">
      <p className="track-panel-title">Loan Progress</p>
      <div className="track-progress-bg">
        <div className="track-progress-fill" style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} />
      </div>
      <p className="track-progress-label">{progress.toFixed(0)}% completed</p>
    </div>
  );
}
