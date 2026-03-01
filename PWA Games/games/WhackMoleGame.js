import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function WhackMoleGame({ goHome, soundEnabled }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [activeMole, setActiveMole] = useState(null);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const moleRef = useRef(null);
  const gameStateRef = useRef({ active: true });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const stored = parseInt(localStorage.getItem('whackmole_highscore')) || 0;
    setHighScore(stored);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setActiveMole(null);
    gameStateRef.current.active = true;
    setGameStatus('playing');
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    if (timeLeft <= 0) {
      gameStateRef.current.active = false;
      const finalScore = score;
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('whackmole_highscore', finalScore);
      }
      setGameStatus('gameover');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score, gameStatus, highScore]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;
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
  }, [gameStatus]);

  const handleMoleClick = () => {
    if (gameStateRef.current.active && activeMole !== null && gameStatus === 'playing') {
      const newScore = score + 10;
      setScore(newScore);
      setActiveMole(null);
    }
  };

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Whack-a-Mole" score={score} showBest={false} />
      <div className="game-canvas-container">
        {gameStatus === 'playing' && (
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
        )}
      </div>
      {gameStatus === 'start' && (
        <StartOverlay
          isDesktop={isDesktop}
          icon="🔨"
          title="WHACK MOLE"
          subtitle="Reflex Game"
          features={[
            { icon: '🐹', text: 'Spot' },
            { icon: '🔨', text: 'Whack' },
            { icon: '⚡', text: 'Fast' }
          ]}
          onStart={startGame}
          highScore={highScore}
        />
      )}
      {gameStatus === 'gameover' && (
        <GameOverOverlay
          isDesktop={isDesktop}
          score={score}
          highScore={highScore}
          isNewHighScore={score >= highScore && score > 0}
          onRestart={startGame}
        />
      )}
    </div>
  );
}
