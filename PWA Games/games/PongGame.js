import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function PongGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState('0:0');
  const [isDesktop, setIsDesktop] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [playerScore, setPlayerScore] = useState(0);
  const gameStateRef = useRef({
    p1Y: 150, p2Y: 150, ballX: 200, ballY: 150, ballDX: 4, ballDY: 4,
    score1: 0, score2: 0, gameRunning: true
  });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('pong_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const startGame = () => {
    gameStateRef.current = {
      p1Y: 150, p2Y: 150, ballX: 200, ballY: 150, ballDX: 4, ballDY: 4,
      score1: 0, score2: 0, gameRunning: true
    };
    setScore('0:0');
    setPlayerScore(0);
    setGameStatus('playing');
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    const gameLoop = () => {
      if (!state.gameRunning) return;

      state.ballX += state.ballDX;
      state.ballY += state.ballDY;

      if (state.ballY < 0 || state.ballY > 300) state.ballDY *= -1;

      if (state.ballX < 15 && state.ballY > state.p1Y && state.ballY < state.p1Y + 60) {
        state.ballDX *= -1;
      }
      if (state.ballX > 385 && state.ballY > state.p2Y && state.ballY < state.p2Y + 60) {
        state.ballDX *= -1;
      }

      if (state.ballX < 0) {
        state.score2++;
        setScore(`${state.score1}:${state.score2}`);
        state.ballX = 200;
        state.ballY = 150;
        // End game if opponent reaches 5
        if (state.score2 >= 5) {
          state.gameRunning = false;
          const finalScore = state.score1;
          setPlayerScore(finalScore);
          if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem('pong_highscore', finalScore);
          }
          setGameStatus('gameover');
          return;
        }
      }
      if (state.ballX > 400) {
        state.score1++;
        setScore(`${state.score1}:${state.score2}`);
        setPlayerScore(state.score1);
        state.ballX = 200;
        state.ballY = 150;
      }

      if (Math.random() < 0.1) {
        if (state.p2Y < state.ballY) state.p2Y += 3;
        else state.p2Y -= 3;
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 300);

      ctx.fillStyle = '#fff';
      ctx.fillRect(10, state.p1Y, 10, 60);
      ctx.fillRect(380, state.p2Y, 10, 60);

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 5, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(gameLoop);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.p1Y = Math.max(0, Math.min(e.clientY - rect.top - 30, 240));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    const interval = setInterval(gameLoop, 1000 / 60);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, [gameStatus, highScore]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Pong" score={score} showBest={false} />
      <div className="game-canvas-container">
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={400} height={300}></canvas>
          {gameStatus === 'start' && (
            <StartOverlay
              isDesktop={isDesktop}
              icon="🏓"
              title="PONG"
              features={[
                { icon: '↕️', text: 'Move' },
                { icon: '🏐', text: 'Hit' },
                { icon: '⭐', text: 'Score' }
              ]}
              onStart={startGame}
              highScore={highScore}
            />
          )}
          {gameStatus === 'gameover' && (
            <GameOverOverlay
              isDesktop={isDesktop}
              score={playerScore}
              highScore={highScore}
              isNewHighScore={playerScore >= highScore && playerScore > 0}
              onRestart={startGame}
            />
          )}
        </div>
      </div>
    </div>
  );
}
