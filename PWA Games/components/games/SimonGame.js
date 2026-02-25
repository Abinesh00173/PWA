import { useState, useEffect, useRef } from 'react';

export default function SimonGame({ goHome, soundEnabled }) {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [level, setLevel] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [highlightedButton, setHighlightedButton] = useState(null);
  const gameStateRef = useRef({ isPlayingSequence: false });

  useEffect(() => {
    if (level === 0) startNewGame();
  }, []);

  const startNewGame = () => {
    const newSeq = [Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setPlayerSequence([]);
    setLevel(1);
    playSequence(newSeq);
  };

  const playSequence = async (seq) => {
    gameStateRef.current.isPlayingSequence = true;
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      highlightButton(seq[i]);
    }
    gameStateRef.current.isPlayingSequence = false;
  };

  const highlightButton = async (num) => {
    setHighlightedButton(num);
    await new Promise(resolve => setTimeout(resolve, 300));
    setHighlightedButton(null);
  };

  const handleButtonClick = async (num) => {
    if (!gameActive || gameStateRef.current.isPlayingSequence) return;

    const newPlayerSeq = [...playerSequence, num];
    setPlayerSequence(newPlayerSeq);

    await highlightButton(num);

    if (newPlayerSeq[newPlayerSeq.length - 1] !== sequence[newPlayerSeq.length - 1]) {
      localStorage.setItem('simon_score', Math.max(parseInt(localStorage.getItem('simon_score')) || 0, level));
      setGameActive(false);
      return;
    }

    if (newPlayerSeq.length === sequence.length) {
      const newSeq = [...sequence, Math.floor(Math.random() * 4)];
      setSequence(newSeq);
      setPlayerSequence([]);
      setLevel(level + 1);
      playSequence(newSeq);
    }
  };

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa502'];
  const buttonLabels = ['Red', 'Cyan', 'Blue', 'Orange'];

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Simon Says</h3>
        <span>Level {level}</span>
      </div>
      <div className="game-canvas-container">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {!gameActive && <div style={{ fontSize: '1.5em', marginBottom: '20px', color: '#e74c3c' }}>Game Over!</div>}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            maxWidth: '300px',
            margin: '20px auto'
          }}>
            {colors.map((color, idx) => (
              <button
                key={idx}
                onClick={() => handleButtonClick(idx)}
                disabled={!gameActive || gameStateRef.current.isPlayingSequence}
                style={{
                  height: '120px',
                  backgroundColor: highlightedButton === idx ? color : `${color}80`,
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '1em',
                  fontWeight: 'bold',
                  color: highlightedButton === idx ? '#000' : '#fff',
                  transition: 'all 0.1s'
                }}
              >
                {buttonLabels[idx]}
              </button>
            ))}
          </div>
          {!gameActive && (
            <button
              onClick={() => startNewGame()}
              style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}
            >
              Play Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
