export function GameHeaderBar({
  onBack,
  title,
  score,
  highScore,
  backLabel = '← Back',
  scoreLabel = 'Score',
  bestLabel = 'Best',
  showBest,
}) {
  const shouldShowBest = showBest ?? (highScore !== undefined && highScore !== null);

  const styles = {
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'rgba(124, 58, 237, 0.1)',
      borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
      flexShrink: 0,
    },
    backBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s',
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
    },
    scoreContainer: {
      display: 'flex',
      gap: '16px',
    },
    scoreBox: {
      textAlign: 'center',
    },
    scoreLabel: {
      fontSize: '10px',
      color: 'rgba(255, 255, 255, 0.6)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    scoreValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#00ff88',
    },
    highScoreValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#ff00ff',
    },
  };

  return (
    <div style={styles.header}>
      <button
        style={styles.backBtn}
        onClick={onBack}
        onMouseEnter={e => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
        onMouseLeave={e => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
      >
        {backLabel}
      </button>
      <h3 style={styles.title}>{title}</h3>
      <div style={styles.scoreContainer}>
        <div style={styles.scoreBox}>
          <div style={styles.scoreLabel}>{scoreLabel}</div>
          <div style={styles.scoreValue}>{score}</div>
        </div>
        {shouldShowBest && (
          <div style={styles.scoreBox}>
            <div style={styles.scoreLabel}>{bestLabel}</div>
            <div style={styles.highScoreValue}>{highScore}</div>
          </div>
        )}
      </div>
    </div>
  );
}
