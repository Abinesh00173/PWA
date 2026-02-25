import { useState, useEffect, useRef } from 'react';

export default function DotsGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameActive, setGameActive] = useState(true);
  const gameStateRef = useRef({
    dots: [],
    selectedDots: [],
    connectedLine: [],
    mx: 0, my: 0
  });

  useEffect(() => {
    const state = gameStateRef.current;
    for (let i = 0; i < 9; i++) {
      state.dots.push({
        x: (i % 3) * 80 + 80,
        y: Math.floor(i / 3) * 80 + 80,
        id: i,
        selected: false
      });
    }
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameActive(false);
      localStorage.setItem('dots_score', Math.max(parseInt(localStorage.getItem('dots_score')) || 0, score));
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - 1;
        if (next <= 0) setGameActive(false);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, score]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 360;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    const draw = () => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 360, 360);

      ctx.strokeStyle = '#666';
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, 360, 360);

      state.dots.forEach(dot => {
        ctx.fillStyle = dot.selected ? '#FFD700' : '#3498db';
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 8, 0, Math.PI * 2);
        ctx.fill();
      });

      if (state.selectedDots.length > 1) {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        for (let i = 0; i < state.selectedDots.length - 1; i++) {
          const d1 = state.selectedDots[i];
          const d2 = state.selectedDots[i + 1];
          ctx.beginPath();
          ctx.moveTo(d1.x, d1.y);
          ctx.lineTo(d2.x, d2.y);
          ctx.stroke();
        }
      }

      requestAnimationFrame(draw);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.mx = e.clientX - rect.left;
      state.my = e.clientY - rect.top;
    };

    const handleMouseDown = (e) => {
      if (!gameActive) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      for (let dot of state.dots) {
        const dist = Math.hypot(x - dot.x, y - dot.y);
        if (dist < 15) {
          if (!dot.selected) {
            if (state.selectedDots.length === 0 || state.selectedDots[state.selectedDots.length - 1].id !== dot.id) {
              dot.selected = true;
              state.selectedDots.push(dot);
            }
          }
          break;
        }
      }
    };

    const handleMouseUp = () => {
      if (state.selectedDots.length > 2) {
        const points = state.selectedDots.length * 10;
        setScore(prev => {
          const newScore = prev + points;
          localStorage.setItem('dots_score', newScore);
          return newScore;
        });
      }
      state.selectedDots.forEach(dot => dot.selected = false);
      state.selectedDots = [];
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    draw();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameActive]);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Dots</h3>
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
