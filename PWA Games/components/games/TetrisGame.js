import { useState, useEffect, useRef } from 'react';

const TETROMINOS = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[0, 1, 0], [1, 1, 1]], // T
];

export default function TetrisGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const gameStateRef = useRef({
    board: Array(20).fill(null).map(() => Array(10).fill(0)),
    piece: null, x: 3, y: 0, score: 0, gameRunning: true
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 200;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;
    const cellSize = 20;

    const spawnPiece = () => {
      state.piece = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
      state.x = 3;
      state.y = 0;
    };

    spawnPiece();

    const canPlacePiece = (piece, x, y) => {
      for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece[row].length; col++) {
          if (piece[row][col]) {
            const nx = x + col;
            const ny = y + row;
            if (nx < 0 || nx >= 10 || ny >= 20 || (ny >= 0 && state.board[ny][nx])) return false;
          }
        }
      }
      return true;
    };

    const placePiece = () => {
      for (let row = 0; row < state.piece.length; row++) {
        for (let col = 0; col < state.piece[row].length; col++) {
          if (state.piece[row][col]) {
            const ny = state.y + row;
            if (ny >= 0) state.board[ny][state.x + col] = 1;
          }
        }
      }

      for (let row = 0; row < 20; row++) {
        if (state.board[row].every(cell => cell)) {
          state.board.splice(row, 1);
          state.board.unshift(Array(10).fill(0));
          state.score += 100;
          setScore(state.score);
        }
      }

      spawnPiece();
      if (!canPlacePiece(state.piece, state.x, state.y)) {
        state.gameRunning = false;
        if (state.score > parseInt(localStorage.getItem('tetris_score') || 0)) {
          localStorage.setItem('tetris_score', state.score);
        }
      }
    };

    const gameLoop = () => {
      if (!state.gameRunning) return;

      if (canPlacePiece(state.piece, state.x, state.y + 1)) {
        state.y++;
      } else {
        placePiece();
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 400);

      state.board.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
          }
        });
      });

      if (state.piece) {
        ctx.fillStyle = '#e74c3c';
        state.piece.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell) {
              ctx.fillRect((state.x + x) * cellSize, (state.y + y) * cellSize, cellSize - 1, cellSize - 1);
            }
          });
        });
      }

      requestAnimationFrame(gameLoop);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && canPlacePiece(state.piece, state.x - 1, state.y)) state.x--;
      if (e.key === 'ArrowRight' && canPlacePiece(state.piece,state.x + 1, state.y)) state.x++;
    };

    window.addEventListener('keydown', handleKeyDown);
    const interval = setInterval(gameLoop, 500);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Tetris</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
