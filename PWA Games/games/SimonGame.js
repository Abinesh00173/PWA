import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function SimonGame({ goHome, soundEnabled }) {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [level, setLevel] = useState(0);
  const [gameActive, setGameActive] = useState(true);
  const [highlightedButton, setHighlightedButton] = useState(null);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const gameStateRef = useRef({ isPlayingSequence: false });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const stored = parseInt(localStorage.getItem('simon_highscore')) || 0;
    setHighScore(stored);
  }, []);

  const startNewGame = () => {
    const newSeq = [Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    setPlayerSequence([]);
    setLevel(1);
    setGameActive(true);
    setGameStatus('playing');
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
      const finalLevel = level;
      if (finalLevel > highScore) {
        setHighScore(finalLevel);
        localStorage.setItem('simon_highscore', finalLevel);
      }
      setGameActive(false);
      setGameStatus('gameover');
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
      <GameHeaderBar onBack={goHome} title="Simon Says" score={`Level ${level}`} showBest={false} />
      <div className="game-canvas-container">
        {gameStatus === 'playing' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
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
          </div>
        )}
      </div>
      {gameStatus === 'start' && (
        <StartOverlay
          isDesktop={isDesktop}
          icon="🎵"
          title="SIMON"
          subtitle="Memory Game"
          features={[
            { icon: '👀', text: 'Watch' },
            { icon: '🧠', text: 'Remember' },
            { icon: '👆', text: 'Repeat' }
          ]}
          onStart={startNewGame}
          highScore={highScore}
        />
      )}
      {gameStatus === 'gameover' && (
        <GameOverOverlay
          isDesktop={isDesktop}
          score={level}
          highScore={highScore}
          isNewHighScore={level >= highScore && level > 0}
          onRestart={startNewGame}
        />
      )}
    </div>
  );
}
