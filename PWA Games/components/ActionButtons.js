export function JumpButton({ isDesktop, onClick, label = 'Jump' }) {
  const styles = {
    button: {
      width: isDesktop ? '120px' : '100px',
      height: isDesktop ? '60px' : '50px',
      background: 'linear-gradient(145deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.3))',
      border: '2px solid rgba(0, 212, 255, 0.4)',
      color: '#00d4ff',
      borderRadius: '14px',
      fontSize: isDesktop ? '18px' : '16px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
      boxShadow: '0 4px 15px rgba(0, 212, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
      padding: isDesktop ? '16px' : '8px',
    },
    hint: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
      textAlign: 'center',
    },
  };

  return (
    <div style={styles.container}>
      <button 
        style={styles.button} 
        onTouchStart={(e) => { e.preventDefault(); onClick(); }}
        onMouseDown={onClick}
      >
        {label}
      </button>
      <div style={styles.hint}>{isDesktop ? 'Space or tap' : 'Tap to jump'}</div>
    </div>
  );
}

export function ResetButton({ onClick, label = 'Reset' }) {
  const styles = {
    button: {
      padding: '10px 20px',
      background: 'linear-gradient(145deg, rgba(255, 0, 102, 0.2), rgba(255, 0, 102, 0.1))',
      border: '2px solid rgba(255, 0, 102, 0.4)',
      color: '#ff0066',
      borderRadius: '10px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.15s',
    },
  };

  return (
    <button style={styles.button} onClick={onClick}>
      {label}
    </button>
  );
}
