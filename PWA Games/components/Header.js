export default function Header({ title, onMenuClick }) {
  return (
    <header className="header" role="banner">
      <button className="menu-toggle" onClick={onMenuClick} type="button" aria-label="Open menu">
        ☰
      </button>
      <div className="header-title">{title}</div>
      <div className="score-display" aria-live="polite">
        <span id="scoreText">Score: 0</span>
      </div>
    </header>
  );
}
