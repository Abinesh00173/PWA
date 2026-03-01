import { useState, useEffect } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function MemoryGame({ goHome, soundEnabled }) {
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    setHighScore(parseInt(localStorage.getItem('memory_score')) || 0);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (matched.length === 8 && matched.length > 0) {
      setIsWon(true);
      const score = Math.max(0, 100 - moves);
      const saved = parseInt(localStorage.getItem('memory_score')) || 0;
      if (score > saved) {
        localStorage.setItem('memory_score', score);
        setIsNewHighScore(true);
        setHighScore(score);
      }
      setGameStatus('gameover');
    }
  }, [matched, moves]);

  const initGame = () => {
    const symbols = ['🌟', '🎸', '🎲', '🎯', '🎪', '🎨', '🎭', '🎬'];
    const deck = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setIsWon(false);
    setIsNewHighScore(false);
    setGameStatus('playing');
  };

  const handleCardClick = (idx) => {
    if (gameStatus !== 'playing') return;
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
      <GameHeaderBar onBack={goHome} title="Memory Game" score={`Pairs: ${pairsMatched}/8`} showBest={false} />
      <div className="game-canvas-container">
        {gameStatus === 'start' && (
          <StartOverlay
            isDesktop={isDesktop}
            icon="🧠"
            title="MEMORY"
            subtitle="Match Game"
            features={[
              { icon: '🃏', text: 'Flip' },
              { icon: '🎯', text: 'Match' },
              { icon: '💭', text: 'Remember' }
            ]}
            onStart={initGame}
            highScore={highScore}
          />
        )}
        {gameStatus === 'gameover' && (
          <GameOverOverlay
            isDesktop={isDesktop}
            score={Math.max(0, 100 - moves)}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            onRestart={initGame}
          />
        )}
        {gameStatus === 'playing' && (
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
        )}
      </div>
    </div>
  );
}
