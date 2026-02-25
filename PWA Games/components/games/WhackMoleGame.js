import { useState, useEffect, useRef } from 'react';

export default function WhackMoleGame({ goHome, soundEnabled }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeMole, setActiveMole] = useState(null);
  const moleRef = useRef(null);
  const gameStateRef = useRef({ active: true });

  useEffect(() => {
    if (timeLeft <= 0) {
      gameStateRef.current.active = false;
      localStorage.setItem('whackmole_score', Math.max(parseInt(localStorage.getItem('whackmole_score')) || 0, score));
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score]);

  useEffect(() => {
    if (!gameStateRef.current.active) return;

    const showMole = () => {
      const holes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      const randomIdx = Math.floor(Math.random() * holes.length);
      setActiveMole(holes[randomIdx]);

      setTimeout(() => {
        if (gameStateRef.current.active) {
          setActiveMole(null);
          setTimeout(showMole, 500);
        }
      }, 800);
    };

    showMole();
  }, []);

  const handleMoleClick = () => {
    if (gameStateRef.current.active && activeMole !== null) {
      const newScore = score + 10;
      setScore(newScore);
      localStorage.setItem('whackmole_score', newScore);
      setActiveMole(null);
    }
  };

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Whack-a-Mole</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2em', marginBottom: '20px', fontWeight: 'bold' }}>Time: {timeLeft}s</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '15px',
            maxWidth: '300px',
            margin: '0 auto'
          }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div
                key={idx}
                onClick={handleMoleClick}
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: activeMole === idx ? '#ff6b6b' : '#8B7355',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2em',
                  fontWeight: 'bold',
                  border: '3px solid #654321',
                  transition: 'all 0.1s'
                }}
              >
                {activeMole === idx ? '🐹' : '🕳️'}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
