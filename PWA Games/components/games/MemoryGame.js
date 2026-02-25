import { useState, useEffect } from 'react';

export default function MemoryGame({ goHome, soundEnabled }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  useEffect(() => {
    if (matched.length === 8 && matched.length > 0) {
      setIsWon(true);
      const score = 100 - moves;
      const saved = parseInt(localStorage.getItem('memory_score')) || 0;
      if (score > saved) localStorage.setItem('memory_score', score);
    }
  }, [matched]);

  const initGame = () => {
    const symbols = ['🌟', '🎸', '🎲', '🎯', '🎪', '🎨', '🎭', '🎬'];
    const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
  };

  const handleCardClick = (idx) => {
    if (flipped.includes(idx) || matched.includes(idx) || flipped.length === 2) return;

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const pairsMatched = matched.length / 2;

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Memory Game</h3>
        <span>Pairs: {pairsMatched}/8</span>
      </div>
      <div className="game-canvas-container">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '1.1em', marginBottom: '15px' }}>Moves: {moves}</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 80px)',
            gap: '10px',
            margin: '20px auto',
            maxWidth: '380px',
          }}>
            {cards.map((card, idx) => (
              <button
                key={idx}
                onClick={() => handleCardClick(idx)}
                style={{
                  width: '80px',
                  height: '80px',
                  fontSize: '2em',
                  backgroundColor: matched.includes(idx) ? '#27ae60' : flipped.includes(idx) ? '#3498db' : '#95a5a6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {(flipped.includes(idx) || matched.includes(idx)) ? card : '?'}
              </button>
            ))}
          </div>
          {isWon && (
            <div style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#27ae60', marginTop: '20px' }}>
              🎉 You Won in {moves} moves!
            </div>
          )}
          <button
            onClick={initGame}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              fontSize: '1em',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}
