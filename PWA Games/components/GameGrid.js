const games = [
  { id: 'snake', icon: '🐍', name: 'Snake', desc: 'Classic Snake Game' },
  { id: 'tictactoe', icon: '⭕', name: 'Tic Tac Toe', desc: 'Beat AI' },
  { id: 'memory', icon: '🧠', name: 'Memory', desc: 'Match Pairs' },
  { id: 'flappy', icon: '🐦', name: 'Flappy Bird', desc: 'Dodge Obstacles' },
  { id: 'breakout', icon: '🧱', name: 'Breakout', desc: 'Break Bricks' },
  { id: 'tetris', icon: '🔲', name: 'Tetris', desc: 'Drop & Stack' },
  { id: 'pong', icon: '🏓', name: 'Pong', desc: 'Ping Pong' },
  { id: '2048', icon: '2️⃣0️⃣4️⃣8️⃣', name: '2048', desc: 'Merge Numbers' },
  { id: 'spaceshooter', icon: '🚀', name: 'Space Shooter', desc: 'Shoot & Survive' },
  { id: 'quiz', icon: '❓', name: 'Quiz Master', desc: 'Test Knowledge' },
  { id: 'dots', icon: '🔵', name: 'Dots Connect', desc: 'Connect Dots' },
  { id: 'tapcrush', icon: '💥', name: 'Tap Crush', desc: 'Tap Shapes' },
  { id: 'whackmole', icon: '🔨', name: 'Whack-a-Mole', desc: 'Hit Targets' },
  { id: 'dino', icon: '🦖', name: 'Dino Runner', desc: 'Jump & Dodge' },
  { id: 'simon', icon: '🎯', name: 'Simon Says', desc: 'Memory Pattern' },
  { id: 'asteroid', icon: '☄️', name: 'Asteroid', desc: 'Space Survival' },
  { id: 'pacman', icon: '👻', name: 'Pac-Man', desc: 'Collect & Escape' },
  { id: 'clicker', icon: '🍪', name: 'Cookie Clicker', desc: 'Tap & Earn' },
  { id: 'typing', icon: '⌨️', name: 'Typing Test', desc: 'Type Speed' },
  { id: 'hangman', icon: '🪢', name: 'Hangman', desc: 'Guess Words' },
  { id: 'connect4', icon: '🔴', name: 'Connect Four', desc: 'Beat AI' },
  { id: 'checkers', icon: '♟️', name: 'Checkers', desc: 'Classic Game' },
  { id: 'bubblepop', icon: '🫧', name: 'Bubble Pop', desc: 'Pop Bubbles' },
  { id: 'balljump', icon: '⚽', name: 'Ball Jump', desc: 'Jump Platforms' },
  { id: 'racing', icon: '🏎️', name: 'Racing Game', desc: 'Drive Fast' },
];

export default function GameGrid({ startGame }) {
  return (
    <section className="games-grid" aria-label="Available games">
      {games.map((game) => (
        <button
          key={game.id}
          className="game-card"
          onClick={() => startGame(game.id)}
          type="button"
          aria-label={`Play ${game.name}`}
        >
          <div className="game-icon">{game.icon}</div>
          <div className="game-name">{game.name}</div>
          <div className="game-desc">{game.desc}</div>
        </button>
      ))}
    </section>
  );
}
