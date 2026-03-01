export function DpadControlsPanel({
  isDesktop,
  gameStatus,
  onDirection,
  onTogglePause,
  onCenterAction,
  hintText,
  speedPercent,
  length,
  showStats = false,
  showPauseButton = true,
  centerButtonLabel,
  directions = ['up', 'left', 'right', 'down'],
}) {
  const styles = {
    controlsPanel: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: isDesktop ? '24px' : '12px',
      background: isDesktop ? 'rgba(15, 10, 31, 0.8)' : 'transparent',
      borderRadius: '20px',
      border: isDesktop ? '2px solid rgba(0, 212, 255, 0.3)' : 'none',
      boxShadow: isDesktop ? '0 0 30px rgba(0, 212, 255, 0.15)' : 'none',
    },
    controlsTitle: {
      fontSize: '13px',
      fontWeight: '700',
      color: '#00d4ff',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '4px',
    },
    dpadContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    },
    dpadRow: {
      display: 'flex',
      gap: '8px',
    },
    controlBtn: {
      width: isDesktop ? '56px' : '50px',
      height: isDesktop ? '56px' : '50px',
      background: 'linear-gradient(145deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.3))',
      border: '2px solid rgba(0, 212, 255, 0.4)',
      color: '#00d4ff',
      borderRadius: '14px',
      fontSize: isDesktop ? '22px' : '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
      boxShadow: '0 4px 15px rgba(0, 212, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    centerBtn: {
      background: 'linear-gradient(145deg, rgba(255, 0, 102, 0.3), rgba(255, 0, 102, 0.1))',
      border: '2px solid rgba(255, 0, 102, 0.5)',
      color: '#ff0066',
      boxShadow: '0 4px 15px rgba(255, 0, 102, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    statsPanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px 16px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '10px',
      width: '100%',
    },
    statRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
    },
    statValue: {
      color: '#00ff88',
      fontWeight: '600',
    },
    hint: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
      textAlign: 'center',
      marginTop: '4px',
    },
  };

  const getCenterButtonLabel = () => {
    if (centerButtonLabel) return centerButtonLabel;
    return gameStatus === 'paused' ? '▶' : '⏸';
  };

  const handleCenterClick = () => {
    if (onCenterAction) onCenterAction();
    else if (onTogglePause) onTogglePause();
  };

  return (
    <div style={styles.controlsPanel}>
      {isDesktop && <div style={styles.controlsTitle}>Controls</div>}
      <div style={styles.dpadContainer}>
        {directions.includes('up') && (
          <div style={styles.dpadRow}>
            <button style={styles.controlBtn} onTouchStart={() => onDirection('up')} onMouseDown={() => onDirection('up')}>
              ▲
            </button>
          </div>
        )}
        <div style={styles.dpadRow}>
          {directions.includes('left') && (
            <button style={styles.controlBtn} onTouchStart={() => onDirection('left')} onMouseDown={() => onDirection('left')}>
              ◀
            </button>
          )}
          {showPauseButton && (
            <button style={{ ...styles.controlBtn, ...styles.centerBtn }} onClick={handleCenterClick}>
              {getCenterButtonLabel()}
            </button>
          )}
          {directions.includes('right') && (
            <button style={styles.controlBtn} onTouchStart={() => onDirection('right')} onMouseDown={() => onDirection('right')}>
              ▶
            </button>
          )}
        </div>
        {directions.includes('down') && (
          <div style={styles.dpadRow}>
            <button style={styles.controlBtn} onTouchStart={() => onDirection('down')} onMouseDown={() => onDirection('down')}>
              ▼
            </button>
          </div>
        )}
      </div>

      {isDesktop && showStats && (
        <div style={styles.statsPanel}>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Speed</span>
            <span style={styles.statValue}>{speedPercent}%</span>
          </div>
          <div style={styles.statRow}>
            <span style={styles.statLabel}>Length</span>
            <span style={styles.statValue}>{length}</span>
          </div>
        </div>
      )}

      <div style={styles.hint}>{hintText}</div>
    </div>
  );
}
