const games = [
  { id: 'snake', icon: '🐍', name: 'Snake', desc: 'Classic Snake Game', category: 'Arcade', rating: 4.8 },
  { id: 'tictactoe', icon: '⭕', name: 'Tic Tac Toe', desc: 'Beat AI', category: 'Strategy', rating: 4.5 },
  { id: 'memory', icon: '🧠', name: 'Memory', desc: 'Match Pairs', category: 'Puzzle', rating: 4.7 },
  { id: 'flappy', icon: '🐦', name: 'Flappy Bird', desc: 'Dodge Obstacles', category: 'Arcade', rating: 4.9 },
  { id: 'breakout', icon: '🧱', name: 'Breakout', desc: 'Break Bricks', category: 'Arcade', rating: 4.6 },
  { id: 'tetris', icon: '🔲', name: 'Tetris', desc: 'Drop & Stack', category: 'Puzzle', rating: 4.9 },
  { id: 'pong', icon: '🏓', name: 'Pong', desc: 'Ping Pong', category: 'Sports', rating: 4.4 },
  { id: '2048', icon: '2️⃣0️⃣4️⃣8️⃣', name: '2048', desc: 'Merge Numbers', category: 'Puzzle', rating: 4.8 },
  { id: 'spaceshooter', icon: '🚀', name: 'Space Shooter', desc: 'Shoot & Survive', category: 'Action', rating: 4.7 },
  { id: 'quiz', icon: '❓', name: 'Quiz Master', desc: 'Test Knowledge', category: 'Trivia', rating: 4.5 },
  { id: 'dots', icon: '🔵', name: 'Dots Connect', desc: 'Connect Dots', category: 'Puzzle', rating: 4.3 },
  { id: 'tapcrush', icon: '💥', name: 'Tap Crush', desc: 'Tap Shapes', category: 'Arcade', rating: 4.4 },
  { id: 'whackmole', icon: '🔨', name: 'Whack-a-Mole', desc: 'Hit Targets', category: 'Arcade', rating: 4.6 },
  { id: 'dino', icon: '🦖', name: 'Dino Runner', desc: 'Jump & Dodge', category: 'Arcade', rating: 4.8 },
  { id: 'simon', icon: '🎯', name: 'Simon Says', desc: 'Memory Pattern', category: 'Puzzle', rating: 4.5 },
  { id: 'asteroid', icon: '☄️', name: 'Asteroid', desc: 'Space Survival', category: 'Action', rating: 4.7 },
  { id: 'pacman', icon: '👻', name: 'Pac-Man', desc: 'Collect & Escape', category: 'Arcade', rating: 4.9 },
  { id: 'clicker', icon: '🍪', name: 'Cookie Clicker', desc: 'Tap & Earn', category: 'Idle', rating: 4.3 },
  { id: 'typing', icon: '⌨️', name: 'Typing Test', desc: 'Type Speed', category: 'Skill', rating: 4.4 },
  { id: 'hangman', icon: '🪢', name: 'Hangman', desc: 'Guess Words', category: 'Word', rating: 4.5 },
  { id: 'connect4', icon: '🔴', name: 'Connect Four', desc: 'Beat AI', category: 'Strategy', rating: 4.6 },
  { id: 'checkers', icon: '♟️', name: 'Checkers', desc: 'Classic Game', category: 'Strategy', rating: 4.5 },
  { id: 'bubblepop', icon: '🫧', name: 'Bubble Pop', desc: 'Pop Bubbles', category: 'Arcade', rating: 4.4 },
  { id: 'balljump', icon: '⚽', name: 'Ball Jump', desc: 'Jump Platforms', category: 'Arcade', rating: 4.3 },
  { id: 'racing', icon: '🏎️', name: 'Racing Game', desc: 'Drive Fast', category: 'Racing', rating: 4.7 },
];

export default function GameGrid({ startGame }) {
  return (
    <section className="games-section" aria-label="Available games">
      <div className="section-header">
        <h2 className="section-title">All Games</h2>
      </div>
      <div className="games-grid">
        {games.map((game) => (
          <button
            key={game.id}
            className="game-card"
            onClick={() => startGame(game.id)}
            type="button"
            aria-label={`Play ${game.name}`}
          >
            <div className="game-card-image">
              <div className="game-icon">{game.icon}</div>
              <div className="game-card-rating">
                <span className="material-symbols-outlined">star</span>
                {game.rating}
              </div>
            </div>
            <div className="game-card-content">
              <div className="game-name">{game.name}</div>
              <div className="game-desc">{game.category} • {game.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
