import { useState, useEffect, useRef } from 'react';

export default function BubblePopGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const gameStateRef = useRef({
    bubbles: [],
    gameActive: true
  });

  useEffect(() => {
    if (timeLeft <= 0) {
      gameStateRef.current.gameActive = false;
      localStorage.setItem('bubblepop_score', Math.max(parseInt(localStorage.getItem('bubblepop_score')) || 0, score));
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 320;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    const addBubble = () => {
      if (!state.gameActive) return;
      const size = Math.random() * 15 + 8;
      state.bubbles.push({
        x: Math.random() * (320 - size * 2),
        y: 480,
        size: size,
        vy: -(Math.random() * 2 + 1)
      });
    };

    const draw = () => {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 320, 480);

      state.bubbles = state.bubbles.filter(b => b.y > -b.size);
      state.bubbles.forEach(b => {
        b.y += b.vy;
        ctx.strokeStyle = '#00FFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.stroke();
      });

      if (state.bubbles.length < 8 && state.gameActive) {
        addBubble();
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

      for (let i = state.bubbles.length - 1; i >= 0; i--) {
        const b = state.bubbles[i];
        const dist = Math.hypot(x - b.x, y - b.y);
        if (dist < b.size) {
          state.bubbles.splice(i, 1);
          const points = Math.floor(b.size) * 2;
          setScore(prev => {
            const newScore = prev + points;
            localStorage.setItem('bubblepop_score', newScore);
            return newScore;
          });
          break;
        }
      }
    };

    canvas.addEventListener('click', handleClick);
    draw();

    return () => canvas.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Bubble Pop</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
        <div style={{ marginTop: '10px', fontSize: '1.2em', fontWeight: 'bold', textAlign: 'center' }}>
          Time: {timeLeft}s
        </div>
      </div>
    </div>
  );
}
