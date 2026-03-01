import { GameHeaderBar } from '../components/GameUIComponents';

export default function PlaceholderGame({ name, goHome }) {
  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title={name} score={0} showBest={false} />
      <div className="game-canvas-container">
        <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.5em', color: 'var(--text)' }}>
          {name} - Coming Soon!
          <div style={{ marginTop: '20px', fontSize: '0.8em', opacity: 0.7 }}>
            This game is being developed
          </div>
        </div>
      </div>
    </div>
  );
}
