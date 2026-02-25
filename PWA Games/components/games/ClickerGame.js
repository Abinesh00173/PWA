import { useState, useEffect } from 'react';

export default function ClickerGame({ goHome }) {
  const [score, setScore] = useState(parseInt(localStorage.getItem('clicker_score')) || 0);
  const [cps, setCps] = useState(1);
  const [autoClickers, setAutoClickers] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newScore = parseInt(localStorage.getItem('clicker_score')) || 0;
      setScore(prev => {
        const updated = prev + autoClickers;
        localStorage.setItem('clicker_score', updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [autoClickers]);

  const handleClick = () => {
    const newScore = score + cps;
    setScore(newScore);
    localStorage.setItem('clicker_score', newScore);
  };

  const buyAutoClicker = () => {
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
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Clicker</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
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
      </div>
    </div>
  );
}
