import { useState, useEffect } from 'react';

export default function Game2048({ goHome, soundEnabled }) {
  const [board, setBoard] = useState(Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const newBoard = Array(16).fill(0);
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
  }, []);

  const addNewTile = (gameBoard) => {
    const empty = gameBoard.map((val, idx) => val === 0 ? idx : null).filter(val => val !== null);
    if (empty.length === 0) return;
    const idx = empty[Math.floor(Math.random() * empty.length)];
    gameBoard[idx] = Math.random() < 0.9 ? 2 : 4;
  };

  const move = (direction) => {
    const newBoard = [...board];
    let moved = false;
    let points = 0;

    const slideAndCombine = (line) => {
      line = line.filter(val => val !== 0);
      for (let i = 0; i < line.length - 1; i++) {
        if (line[i] === line[i + 1]) {
          line[i] *= 2;
          points += line[i];
          line.splice(i + 1, 1);
        }
      }
      while (line.length < 4) line.push(0);
      return line;
    };

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        const line = slideAndCombine(newBoard.slice(i * 4, i * 4 + 4));
        for (let j = 0; j < 4; j++) {
          if (newBoard[i * 4 + j] !== line[j]) moved = true;
          newBoard[i * 4 + j] = line[j];
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        const line = slideAndCombine(newBoard.slice(i * 4, i * 4 + 4).reverse()).reverse();
        for (let j = 0; j < 4; j++) {
          if (newBoard[i * 4 + j] !== line[j]) moved = true;
          newBoard[i * 4 + j] = line[j];
        }
      }
    } else if (direction === 'up') {
      for (let j = 0; j < 4; j++) {
        const line = slideAndCombine([newBoard[j], newBoard[j + 4], newBoard[j + 8], newBoard[j + 12]]);
        for (let i = 0; i < 4; i++) {
          if (newBoard[i * 4 + j] !== line[i]) moved = true;
          newBoard[i * 4 + j] = line[i];
        }
      }
    } else if (direction === 'down') {
      for (let j = 0; j < 4; j++) {
        const line = slideAndCombine([newBoard[j + 12], newBoard[j + 8], newBoard[j + 4], newBoard[j]]).reverse();
        for (let i = 0; i < 4; i++) {
          if (newBoard[i * 4 + j] !== line[3 - i]) moved = true;
          newBoard[i * 4 + j] = line[3 - i];
        }
      }
    }

    if (moved) {
      addNewTile(newBoard);
      setBoard(newBoard);
      const newScore = score + points;
      setScore(newScore);
      localStorage.setItem('2048_score', newScore);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') { move('left'); e.preventDefault(); }
      if (e.key === 'ArrowRight') { move('right'); e.preventDefault(); }
      if (e.key === 'ArrowUp') { move('up'); e.preventDefault(); }
      if (e.key === 'ArrowDown') { move('down'); e.preventDefault(); }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [board, score]);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>2048</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 80px)',
            gap: '10px',
            margin: '20px auto',
            backgroundColor: '#bbada0',
            padding: '10px',
            borderRadius: '6px',
          }}>
            {board.map((val, idx) => (
              <div key={idx} style={{
                width: '80px',
                height: '80px',
                backgroundColor: val === 0 ? '#cdc1b4' : '#' + ['', '', 'eee4da', 'ede0c8', 'f2b179', 'f59563', 'f67c5f', 'f65e3b', 'edcf72', 'edcc61'][Math.log2(val) || 0],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2em',
                fontWeight: 'bold',
                borderRadius: '3px',
                color: val <= 4 ? '#776e65' : '#f9f6f2',
              }}>
                {val > 0 && val}
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => move('up')} style={{ padding: '10px 15px', fontSize: '1em' }}>⬆️</button>
            <button onClick={() => move('left')} style={{ padding: '10px 15px', fontSize: '1em' }}>⬅️</button>
            <button onClick={() => move('right')} style={{ padding: '10px 15px', fontSize: '1em' }}>➡️</button>
            <button onClick={() => move('down')} style={{ padding: '10px 15px', fontSize: '1em' }}>⬇️</button>
          </div>
        </div>
      </div>
    </div>
  );
}
