function ProgressBar({ completed, total }) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)' }}>
          Progress
        </span>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)' }}>
          {completed}/{total} tasks ({percent}%)
        </span>
      </div>
      <div style={{
        width: '100%',
        height: 10,
        background: 'var(--border)',
        borderRadius: 99,
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${percent}%`,
          height: '100%',
          background: 'linear-gradient(90deg, var(--accent), #a78bfa)',
          borderRadius: 99,
          transition: 'width 0.6s ease',
        }} />
      </div>
    </div>
  );
}

export default ProgressBar;