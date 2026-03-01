import { useState, useEffect } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay } from '../components/StartOverlay';

export default function CookieClickerGame({ goHome }) {
  const [cookies, setCookies] = useState(0);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    setHighScore(parseInt(localStorage.getItem('cookieclicker_highscore')) || 0);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    setCookies(0);
    setGameStatus('playing');
  };

  const handleClick = () => {
    if (gameStatus !== 'playing') return;
    const newCookies = cookies + 1;
    setCookies(newCookies);
    if (newCookies > highScore) {
      setHighScore(newCookies);
      localStorage.setItem('cookieclicker_highscore', newCookies);
    }
    localStorage.setItem('clicker_score', newCookies);
  };

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Cookie Clicker" score={`${cookies} Cookies`} showBest={false} />
      <div className="game-canvas-container">
        {gameStatus === 'start' && (
          <StartOverlay
            isDesktop={isDesktop}
            icon="🍪"
            title="COOKIE CLICKER"
            subtitle="Idle Game"
            features={[
              { icon: '👆', text: 'Click' },
              { icon: '💰', text: 'Earn' },
              { icon: '⬆️', text: 'Upgrade' }
            ]}
            onStart={startGame}
            highScore={highScore}
          />
        )}
        {gameStatus === 'playing' && (
        <button
          onClick={handleClick}
          style={{
            fontSize: '4em',
            padding: '40px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          🍪
        </button>
        )}
      </div>
    </div>
  );
}
