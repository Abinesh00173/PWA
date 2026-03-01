import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function TapCrushGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const gameStateRef = useRef({
    shapes: [],
    gameActive: true
  });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const stored = parseInt(localStorage.getItem('tapcrush_highscore')) || 0;
    setHighScore(stored);
  }, []);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    gameStateRef.current.shapes = [];
    gameStateRef.current.gameActive = true;
    setGameStatus('playing');
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    if (timeLeft <= 0) {
      gameStateRef.current.gameActive = false;
      const finalScore = score;
      if (finalScore > highScore) {
        setHighScore(finalScore);
        localStorage.setItem('tapcrush_highscore', finalScore);
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
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 320;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    const addShape = () => {
      if (!state.gameActive) return;
      const size = Math.random() * 25 + 15;
      const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502'];
      state.shapes.push({
        x: Math.random() * (320 - size),
        y: Math.random() * (480 - size),
        size: size,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 2000
      });
    };

    const draw = () => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 320, 480);

      state.shapes = state.shapes.filter(shape => shape.life > 0);
      state.shapes.forEach(shape => {
        shape.life -= 16;
        ctx.fillStyle = shape.color;
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
        ctx.fill();
      });

      if (state.shapes.length < 5 && state.gameActive) {
        addShape();
      }

      if (state.gameActive) {
        requestAnimationFrame(draw);
      }
    };

    const handleClick = (e) => {
      if (!state.gameActive) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let i = 0; i < state.shapes.length; i++) {
        const shape = state.shapes[i];
        const dist = Math.hypot(x - shape.x, y - shape.y);
        if (dist < shape.size) {
          state.shapes.splice(i, 1);
          const points = Math.floor(shape.size / 5) * 10;
          setScore(prev => {
            const newScore = prev + points;
            return newScore;
          });
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);
    draw();

    return () => canvas.removeEventListener('click', handleClick);
  }, [gameStatus]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Tap Crush" score={score} showBest={false} />
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
        {gameStatus === 'playing' && (
          <div style={{ marginTop: '10px', fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center' }}>
            Time: {timeLeft}s
          </div>
        )}
      </div>
      {gameStatus === 'start' && (
        <StartOverlay
          isDesktop={isDesktop}
          icon="💎"
          title="TAP CRUSH"
          subtitle="Match Game"
          features={[
            { icon: '👆', text: 'Tap' },
            { icon: '💥', text: 'Crush' },
            { icon: '⏱️', text: 'Timed' }
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
