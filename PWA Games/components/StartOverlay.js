import { GameOverlay } from './GameOverlay';

export function StartOverlay({ 
  isDesktop, 
  icon, 
  title, 
  subtitle = 'Arcade Game',
  features = [],
  onStart,
  highScore = 0,
  hintText,
}) {
  const styles = {
    iconContainer: {
      width: isDesktop ? '100px' : '70px',
      height: isDesktop ? '100px' : '70px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.3))',
      border: isDesktop ? '4px solid rgba(0, 212, 255, 0.4)' : '3px solid rgba(0, 212, 255, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: isDesktop ? '20px' : '12px',
      boxShadow: '0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(124, 58, 237, 0.2)',
      flexShrink: 0,
    },
    icon: {
      fontSize: isDesktop ? '50px' : '35px',
    },
    title: {
      fontSize: isDesktop ? '42px' : '28px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: 'none',
      letterSpacing: isDesktop ? '4px' : '2px',
      marginBottom: isDesktop ? '8px' : '4px',
      flexShrink: 0,
    },
    subtitle: {
      fontSize: isDesktop ? '14px' : '11px',
      color: 'rgba(255, 255, 255, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: isDesktop ? '3px' : '2px',
      marginBottom: isDesktop ? '24px' : '12px',
      flexShrink: 0,
    },
    featureList: {
      display: 'flex',
      gap: isDesktop ? '20px' : '12px',
      marginBottom: isDesktop ? '28px' : '16px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      flexShrink: 0,
    },
    featureItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isDesktop ? '6px' : '4px',
    },
    featureIcon: {
      width: isDesktop ? '44px' : '32px',
      height: isDesktop ? '44px' : '32px',
      borderRadius: '12px',
      background: 'rgba(255, 255, 255, 0.05)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isDesktop ? '20px' : '16px',
    },
    featureText: {
      fontSize: isDesktop ? '11px' : '9px',
      color: 'rgba(255, 255, 255, 0.6)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    playBtn: {
      background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
      border: 'none',
      padding: isDesktop ? '16px 48px' : '12px 36px',
      borderRadius: '30px',
      color: '#0a0a1a',
      fontSize: isDesktop ? '18px' : '15px',
      fontWeight: '800',
      cursor: 'pointer',
      boxShadow: '0 6px 30px rgba(0, 255, 136, 0.4), 0 0 60px rgba(0, 255, 136, 0.2)',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: isDesktop ? '3px' : '2px',
      flexShrink: 0,
    },
    hint: {
      fontSize: isDesktop ? '11px' : '9px',
      color: 'rgba(255, 255, 255, 0.4)',
      marginTop: isDesktop ? '16px' : '8px',
    },
    highScoreLabel: {
      fontSize: isDesktop ? '11px' : '8px',
      color: 'rgba(255, 255, 255, 0.4)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    highScoreValue: {
      fontSize: isDesktop ? '24px' : '16px',
      fontWeight: '700',
      color: '#ff00ff',
      textShadow: '0 0 20px rgba(255, 0, 255, 0.5)',
    },
  };

  return (
    <GameOverlay isDesktop={isDesktop} variant="start">
      <div style={styles.iconContainer}>
        <span style={styles.icon}>{icon}</span>
      </div>
      <div style={styles.title}>{title}</div>
      <div style={styles.subtitle}>{subtitle}</div>
      
      {features.length > 0 && (
        <div style={styles.featureList}>
          {features.map((feature, idx) => (
            <div key={idx} style={styles.featureItem}>
              <div style={styles.featureIcon}>{feature.icon}</div>
              <span style={styles.featureText}>{feature.text}</span>
            </div>
          ))}
        </div>
      )}
      
      <button 
        style={styles.playBtn}
        onClick={onStart}
        onMouseEnter={e => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 8px 40px rgba(0, 255, 136, 0.5), 0 0 80px rgba(0, 255, 136, 0.3)';
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 6px 30px rgba(0, 255, 136, 0.4), 0 0 60px rgba(0, 255, 136, 0.2)';
        }}
      >
        ▶ START
      </button>
      
      <div style={styles.hint}>
        {hintText || (isDesktop ? 'Press SPACE or click to start' : 'Tap to start')}
      </div>
      
      {highScore > 0 && (
        <div style={{ marginTop: isDesktop ? '16px' : '8px', textAlign: 'center' }}>
          <div style={styles.highScoreLabel}>High Score</div>
          <div style={styles.highScoreValue}>{highScore}</div>
        </div>
      )}
    </GameOverlay>
  );
}

export function GameOverOverlay({
  isDesktop,
  score,
  highScore = 0,
  isNewHighScore = false,
  onRestart,
}) {
  const styles = {
    iconContainer: {
      width: isDesktop ? '80px' : '50px',
      height: isDesktop ? '80px' : '50px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(255, 0, 102, 0.3), rgba(255, 0, 102, 0.1))',
      border: isDesktop ? '3px solid rgba(255, 0, 102, 0.5)' : '2px solid rgba(255, 0, 102, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: isDesktop ? '16px' : '8px',
      boxShadow: '0 0 40px rgba(255, 0, 102, 0.3)',
    },
    icon: {
      fontSize: isDesktop ? '40px' : '24px',
    },
    title: {
      fontSize: isDesktop ? '36px' : '24px',
      fontWeight: '900',
      background: 'linear-gradient(135deg, #ff0066, #ff6699)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: isDesktop ? '3px' : '2px',
      marginBottom: isDesktop ? '16px' : '8px',
    },
    scoreLabel: {
      fontSize: isDesktop ? '11px' : '8px',
      color: 'rgba(255, 255, 255, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '4px',
    },
    score: {
      fontSize: isDesktop ? '48px' : '32px',
      fontWeight: '900',
      color: '#fff',
      textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
      marginBottom: isDesktop ? '16px' : '8px',
    },
    newHighScore: {
      background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2), rgba(255, 0, 255, 0.1))',
      border: '1px solid rgba(255, 0, 255, 0.4)',
      padding: isDesktop ? '8px 20px' : '4px 12px',
      borderRadius: '20px',
      color: '#ff00ff',
      marginBottom: isDesktop ? '20px' : '10px',
      fontWeight: '700',
      fontSize: isDesktop ? '14px' : '10px',
    },
    playBtn: {
      background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
      border: 'none',
      padding: isDesktop ? '14px 40px' : '10px 30px',
      borderRadius: '30px',
      color: '#0a0a1a',
      fontSize: isDesktop ? '16px' : '14px',
      fontWeight: '800',
      cursor: 'pointer',
      boxShadow: '0 6px 30px rgba(0, 255, 136, 0.4)',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase',
      letterSpacing: '2px',
    },
    hint: {
      fontSize: isDesktop ? '11px' : '9px',
      color: 'rgba(255, 255, 255, 0.4)',
      marginTop: isDesktop ? '12px' : '8px',
    },
  };

  return (
    <GameOverlay isDesktop={isDesktop}>
      <div style={styles.iconContainer}>
        <span style={styles.icon}>💀</span>
      </div>
      <div style={styles.title}>GAME OVER</div>
      <div style={styles.scoreLabel}>Your Score</div>
      <div style={styles.score}>{score}</div>
      
      {isNewHighScore && (
        <div style={styles.newHighScore}>🏆 NEW HIGH SCORE!</div>
      )}
      
      <button 
        style={styles.playBtn}
        onClick={onRestart}
        onMouseEnter={e => {
          e.target.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={e => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        ▶ PLAY AGAIN
      </button>
      
      <div style={styles.hint}>Tap or press SPACE</div>
    </GameOverlay>
  );
}
