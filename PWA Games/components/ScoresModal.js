import { useState, useEffect } from 'react';

export default function ScoresModal({ isOpen, onClose }) {
  const [scores, setScores] = useState({});

  useEffect(() => {
    if (isOpen) {
      const gameList = ['snake', 'tictactoe', 'memory', 'flappy', 'breakout', 'tetris', 'pong', '2048', 
        'spaceshooter', 'quiz', 'dots', 'tapcrush', 'whackmole', 'dino', 'simon', 'asteroid', 'pacman', 
        'clicker', 'typing', 'hangman', 'connect4', 'checkers', 'bubblepop', 'balljump', 'racing'];
      
      const loadedScores = {};
      gameList.forEach(game => {
        loadedScores[game] = parseInt(localStorage.getItem(`${game}_score`)) || 0;
      });
      setScores(loadedScores);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const gameIcons = {
    snake: '🐍', tictactoe: '⭕', memory: '🧠', flappy: '🐦', breakout: '🧱', tetris: '🔲',
    pong: '🏓', '2048': '2️⃣0️⃣4️⃣8️⃣', spaceshooter: '🚀', quiz: '❓', dots: '🔵', tapcrush: '💥',
    whackmole: '🔨', dino: '🦖', simon: '🎯', asteroid: '☄️', pacman: '👻', clicker: '🍪',
    typing: '⌨️', hangman: '🪢', connect4: '🔴', checkers: '♟️', bubblepop: '🫧', balljump: '⚽', racing: '🏎️'
  };

  const gameNames = {
    tictactoe: 'Tic Tac Toe', spaceshooter: 'Space Shooter', quiz: 'Quiz Master',
    dots: 'Dots Connect', tapcrush: 'Tap Crush', whackmole: 'Whack-a-Mole', dino: 'Dino Runner',
    simon: 'Simon Says', clicker: 'Cookie Clicker', typing: 'Typing Test', connect4: 'Connect Four',
    bubblepop: 'Bubble Pop', balljump: 'Ball Jump', racing: 'Racing Game'
  };

  return (
    <div className="modal" style={{ display: 'flex' }} onClick={onClose} role="presentation">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="High scores">
        <div className="modal-header">
          <h3>🏆 High Scores</h3>
          <button className="close-btn" onClick={onClose} type="button" aria-label="Close high scores">×</button>
        </div>
        <div className="scores-list">
          {Object.keys(scores).map(game => (
            <div key={game} className="score-item">
              <span className="score-game">
                {gameIcons[game]} {gameNames[game] || game.charAt(0).toUpperCase() + game.slice(1)}
              </span>
              <span className="score-value">{scores[game]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
