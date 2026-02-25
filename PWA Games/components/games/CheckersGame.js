import { useState } from 'react';

export default function CheckersGame({ goHome }) {
  const [board, setBoard] = useState(initializeBoard());
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('Game Started');

  function initializeBoard() {
    const b = Array(64).fill(0);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i + j) % 2 === 1) {
          b[i * 8 + j] = 2;
          b[(7 - i) * 8 + j] = 1;
        }
      }
    }
    return b;
  }

  const handlePieceClick = (idx) => {
    setBoard(board);
  };

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Checkers</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '1.2em', marginBottom: '20px' }}>{message}</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 40px)',
            gap: '0',
            margin: '20px auto',
            backgroundColor: '#000',
            borderRadius: '5px',
            width: 'fit-content'
          }}>
            {board.map((val, idx) => (
              <div
                key={idx}
                onClick={() => handlePieceClick(idx)}
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: ((Math.floor(idx / 8) + idx) % 2) === 0 ? '#fff' : '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '1.5em'
                }}
              >
                {val === 1 ? '🔵' : val === 2 ? '🔴' : ''}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
