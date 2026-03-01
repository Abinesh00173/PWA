import { useState, useEffect } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay } from '../components/StartOverlay';

export default function ClickerGame({ goHome }) {
  const [score, setScore] = useState(0);
  const [cps, setCps] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    setHighScore(parseInt(localStorage.getItem('clicker_highscore')) || 0);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    setScore(0);
    setCps(1);
    setAutoClickers(0);
    setGameStatus('playing');
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const interval = setInterval(() => {
      setScore(prev => {
        const updated = prev + autoClickers;
        if (updated > highScore) {
          setHighScore(updated);
          localStorage.setItem('clicker_highscore', updated);
        }
        localStorage.setItem('clicker_score', updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClickers, gameStatus, highScore]);

  const handleClick = () => {
    if (gameStatus !== 'playing') return;
    const newScore = score + cps;
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('clicker_highscore', newScore);
    }
    localStorage.setItem('clicker_score', newScore);
  };

  const buyAutoClicker = () => {
    if (gameStatus !== 'playing') return;
    const cost = 50 * (autoClickers + 1);
    if (score >= cost) {
      const newScore = score - cost;
      const newClickers = autoClickers + 1;
      setScore(newScore);
      setAutoClickers(newClickers);
      setCps(cps + 1);
      localStorage.setItem('clicker_score', newScore);
    }
  };

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Clicker" score={score} showBest={false} />
      <div className="game-canvas-container">
        {gameStatus === 'start' && (
          <StartOverlay
            isDesktop={isDesktop}
            icon="👆"
            title="CLICKER"
            subtitle="Tap Game"
            features={[
              { icon: '👆', text: 'Tap' },
              { icon: '💯', text: 'Score' },
              { icon: '⚡', text: 'Speed' }
            ]}
            onStart={startGame}
            highScore={highScore}
          />
        )}
        {gameStatus === 'playing' && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '2em', marginBottom: '20px' }}>🍪 {score}</div>
          <button
            onClick={handleClick}
            style={{
              fontSize: '3em',
              padding: '20px 40px',
              marginBottom: '30px',
              backgroundColor: '#FFD700',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            CLICK!
          </button>
          <div style={{ marginBottom: '20px', fontSize: '1.1em' }}>CPS: {cps}</div>
          <button
            onClick={buyAutoClicker}
            disabled={score < 50 * (autoClickers + 1)}
            style={{
              padding: '10px 20px',
              fontSize: '1em',
              backgroundColor: score >= 50 * (autoClickers + 1) ? '#3498db' : '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Buy Auto Clicker (Cost: {50 * (autoClickers + 1)})
          </button>
          <div style={{ marginTop: '20px', fontSize: '0.9em', color: '#bdc3c7' }}>
            Auto Clickers: {autoClickers}
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
