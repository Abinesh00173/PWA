import Head from 'next/head';
import Menu from '../components/Menu';
import GameGrid from '../components/GameGrid';
import ScoresModal from '../components/ScoresModal';
import Layout from '../components/Layout';
import useGameAppState from '../hooks/useGameAppState';
import SnakeGame from '../components/games/SnakeGame';
import TicTacToeGame from '../components/games/TicTacToeGame';
import MemoryGame from '../components/games/MemoryGame';
import FlappyGame from '../components/games/FlappyGame';
import BreakoutGame from '../components/games/BreakoutGame';
import TetrisGame from '../components/games/TetrisGame';
import PongGame from '../components/games/PongGame';
import Game2048 from '../components/games/Game2048';
import SpaceShooterGame from '../components/games/SpaceShooterGame';
import QuizGame from '../components/games/QuizGame';
import DotsGame from '../components/games/DotsGame';
import TapCrushGame from '../components/games/TapCrushGame';
import WhackMoleGame from '../components/games/WhackMoleGame';
import DinoGame from '../components/games/DinoGame';
import SimonGame from '../components/games/SimonGame';
import CookieClickerGame from '../components/games/CookieClickerGame';
import TypingGame from '../components/games/TypingGame';
import HangmanGame from '../components/games/HangmanGame';
import AsteroidGame from '../components/games/AsteroidGame';
import ClickerGame from '../components/games/ClickerGame';
import PacManGame from '../components/games/PacManGame';
import Connect4Game from '../components/games/Connect4Game';
import CheckersGame from '../components/games/CheckersGame';
import BubblePopGame from '../components/games/BubblePopGame';
import BallJumpGame from '../components/games/BallJumpGame';
import RacingGame from '../components/games/RacingGame';

const categories = [
  { id: 'arcade', icon: 'sports_kabaddi', name: 'Arcade' },
  { id: 'puzzle', icon: 'extension', name: 'Puzzle' },
  { id: 'strategy', icon: 'strategy', name: 'Strategy' },
  { id: 'action', icon: 'bolt', name: 'Action' },
  { id: 'racing', icon: 'directions_car', name: 'Racing' },
];

const trendingGames = [
  { id: 'tetris', icon: '🔲', name: 'Tetris', category: 'Puzzle', rating: 4.9, players: '2.3k' },
  { id: 'pacman', icon: '👻', name: 'Pac-Man', category: 'Arcade', rating: 4.9, players: '1.8k' },
  { id: 'snake', icon: '🐍', name: 'Snake', category: 'Arcade', rating: 4.8, players: '1.5k' },
  { id: 'flappy', icon: '🐦', name: 'Flappy Bird', category: 'Arcade', rating: 4.9, players: '1.2k' },
];

const communityPosts = [
  { id: 1, user: 'ProGamer99', avatar: '🎮', message: 'Just hit 10,000 points in Tetris! Who can beat that?', time: '5m ago', likes: 24 },
  { id: 2, user: 'RetroFan', avatar: '👾', message: 'The new Pac-Man update is amazing! Ghost AI is so much better now.', time: '12m ago', likes: 18 },
  { id: 3, user: 'SpeedRunner', avatar: '⚡', message: 'Looking for players to compete in the Snake tournament this weekend!', time: '1h ago', likes: 42 },
  { id: 4, user: 'ArcadeMaster', avatar: '🕹️', message: 'Finally beat my high score in Flappy Bird! 127 pipes without dying 🎉', time: '2h ago', likes: 89 },
  { id: 5, user: 'PuzzleQueen', avatar: '🧩', message: 'Anyone else addicted to 2048? I cant stop playing...', time: '3h ago', likes: 31 },
  { id: 6, user: 'NightOwlGamer', avatar: '🦉', message: 'Just discovered the Breakout game here. Brings back so many memories!', time: '4h ago', likes: 56 },
  { id: 7, user: 'CasualPlayer', avatar: '🎯', message: 'Tip for Memory game: start from the corners, works every time!', time: '5h ago', likes: 73 },
  { id: 8, user: 'CompetitiveEdge', avatar: '🏆', message: 'Weekly leaderboard reset tomorrow. Whos ready to grind?', time: '6h ago', likes: 45 },
  { id: 9, user: 'RetroLover', avatar: '📺', message: 'The Dino game reminds me of Chrome offline days. Nostalgia hit hard!', time: '8h ago', likes: 62 },
  { id: 10, user: 'GameDev_Fan', avatar: '💻', message: 'Love how smooth all the games run. Great optimization!', time: '12h ago', likes: 88 },
];

const upcomingFeatures = [
  { id: 1, title: 'Multiplayer Mode', desc: 'Play with friends', icon: 'groups', date: 'Coming Soon' },
  { id: 2, title: 'Leaderboards', desc: 'Global rankings', icon: 'leaderboard', date: 'March 2026' },
];

export default function Home() {
  const {
    currentGame,
    currentView,
    menuOpen,
    scoresOpen,
    soundEnabled,
    startGame,
    goHome,
    navigateTo,
    toggleMenu,
    toggleTheme,
    toggleSound,
    showScores,
    closeScores,
  } = useGameAppState();

  const renderGame = () => {
    const gameComponents = {
      snake: <SnakeGame goHome={goHome} soundEnabled={soundEnabled} />,
      tictactoe: <TicTacToeGame goHome={goHome} />,
      memory: <MemoryGame goHome={goHome} soundEnabled={soundEnabled} />,
      flappy: <FlappyGame goHome={goHome} soundEnabled={soundEnabled} />,
      breakout: <BreakoutGame goHome={goHome} soundEnabled={soundEnabled} />,
      tetris: <TetrisGame goHome={goHome} soundEnabled={soundEnabled} />,
      pong: <PongGame goHome={goHome} soundEnabled={soundEnabled} />,
      '2048': <Game2048 goHome={goHome} soundEnabled={soundEnabled} />,
      spaceshooter: <SpaceShooterGame goHome={goHome} soundEnabled={soundEnabled} />,
      quiz: <QuizGame goHome={goHome} />,
      dots: <DotsGame goHome={goHome} soundEnabled={soundEnabled} />,
      tapcrush: <TapCrushGame goHome={goHome} soundEnabled={soundEnabled} />,
      whackmole: <WhackMoleGame goHome={goHome} soundEnabled={soundEnabled} />,
      dino: <DinoGame goHome={goHome} soundEnabled={soundEnabled} />,
      simon: <SimonGame goHome={goHome} soundEnabled={soundEnabled} />,
      clicker: <CookieClickerGame goHome={goHome} />,
      typing: <TypingGame goHome={goHome} />,
      hangman: <HangmanGame goHome={goHome} />,
      asteroid: <AsteroidGame goHome={goHome} soundEnabled={soundEnabled} />,
      pacman: <PacManGame goHome={goHome} soundEnabled={soundEnabled} />,
      connect4: <Connect4Game goHome={goHome} />,
      checkers: <CheckersGame goHome={goHome} />,
      bubblepop: <BubblePopGame goHome={goHome} soundEnabled={soundEnabled} />,
      balljump: <BallJumpGame goHome={goHome} soundEnabled={soundEnabled} />,
      racing: <RacingGame goHome={goHome} soundEnabled={soundEnabled} />,
    };

    return gameComponents[currentGame] || null;
  };

  return (
    <>
      <Head>
        <title>NEXUS - Play Games</title>
        <meta name="description" content="Play awesome games on NEXUS - your ultimate gaming destination" />
      </Head>

      <Menu
        isOpen={menuOpen}
        onClose={toggleMenu}
        goHome={goHome}
        toggleSound={toggleSound}
        showScores={showScores}
        toggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        navigateTo={navigateTo}
      />

      <Layout title={currentGame ? currentGame.toUpperCase() : 'NEXUS'} onMenuClick={toggleMenu} isHome={!currentGame} navigateTo={navigateTo} currentView={currentView}>
        {currentGame ? (
          renderGame()
        ) : currentView === 'community' ? (
          <div className="screen custom-scrollbar" id="communityScreen">
            <div className="container">
              {/* Community Page */}
              <section className="community-page">
                <div className="community-page-header">
                  <h2 className="community-page-title">
                    <span className="material-symbols-outlined">forum</span>
                    Community
                  </h2>
                  <button className="btn btn-outline btn-pill community-join-btn">
                    Join Discussion
                  </button>
                </div>

                {/* Community Stats */}
                <div className="community-stats-bar">
                  <div className="stat-item">
                    <span className="stat-value">2.4k</span>
                    <span className="stat-label">Members</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">156</span>
                    <span className="stat-label">Online Now</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">892</span>
                    <span className="stat-label">Posts Today</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">45</span>
                    <span className="stat-label">Tournaments</span>
                  </div>
                </div>

                {/* Featured Topics */}
                <div className="community-topics">
                  <h3 className="topics-title">Trending Topics</h3>
                  <div className="topics-list">
                    <button className="topic-tag active">#AllPosts</button>
                    <button className="topic-tag">#HighScores</button>
                    <button className="topic-tag">#Tournaments</button>
                    <button className="topic-tag">#Tips</button>
                    <button className="topic-tag">#Suggestions</button>
                    <button className="topic-tag">#Introductions</button>
                  </div>
                </div>

                <div className="community-posts-list">
                  {communityPosts.map((post) => (
                    <div key={post.id} className="community-post-card">
                      <div className="post-avatar">{post.avatar}</div>
                      <div className="post-content">
                        <div className="post-header">
                          <span className="post-username">{post.user}</span>
                        </div>
                        <p className="post-message">{post.message}</p>
                        <div className="post-actions">
                          <button className="post-action-btn">
                            <span className="material-symbols-outlined">favorite_border</span>
                            <span>{post.likes}</span>
                          </button>
                          <button className="post-action-btn">
                            <span className="material-symbols-outlined">chat_bubble_outline</span>
                            <span>Reply</span>
                          </button>
                        </div>
                      </div>
                      <div className="post-time">{post.time}</div>
                    </div>
                  ))}
                </div>

                {/* Load More */}
                <div className="community-load-more">
                  <button className="btn btn-outline btn-pill">Load More Posts</button>
                </div>
              </section>
            </div>
          </div>
        ) : (
          <div className="screen custom-scrollbar" id="homeScreen">
            <div className="container">
              {/* Hero Section */}
              <section className="hero-section">
                <div className="hero-content">
                  <span className="hero-badge">Featured Game</span>
                  <h1 className="hero-title">NEXUS Gaming</h1>
                  <p className="hero-desc">The ultimate destination for gamers. Play 25+ awesome games right in your browser!</p>
                  <div className="hero-actions">
                    <button className="hero-btn hero-btn-primary" onClick={() => startGame('snake')}>
                      <span className="material-symbols-outlined">play_arrow</span>
                      Play Now
                    </button>
                    <button className="hero-btn hero-btn-secondary" onClick={() => document.querySelector('.category-section').scrollIntoView({behavior: 'smooth'})}>Learn More</button>
                  </div>
                </div>
              </section>

              {/* Category Section */}
              <section className="category-section">
                <div className="section-header">
                  <h3 className="section-title">Browse by Category</h3>
                </div>
                <div className="category-grid">
                  {categories.map((cat) => (
                    <div key={cat.id} className="category-card">
                      <div className="category-icon">
                        <span className="material-symbols-outlined">{cat.icon}</span>
                      </div>
                      <p className="category-name">{cat.name}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Trending Now Section */}
              <section className="trending-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <span className="material-symbols-outlined section-icon">trending_up</span>
                    Trending Now
                  </h3>
                  <button className="btn btn-ghost btn-sm">View All</button>
                </div>
                <div className="trending-grid">
                  {trendingGames.map((game) => (
                    <button
                      key={game.id}
                      className="trending-card"
                      onClick={() => startGame(game.id)}
                      type="button"
                    >
                      <div className="trending-icon">{game.icon}</div>
                      <div className="trending-info">
                        <span className="trending-name">{game.name}</span>
                        <span className="trending-category">{game.category}</span>
                      </div>
                      <div className="trending-stats">
                        <div className="trending-rating">
                          <span className="material-symbols-outlined">star</span>
                          {game.rating}
                        </div>
                        <div className="trending-players">
                          <span className="material-symbols-outlined">person</span>
                          {game.players}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </section>

              {/* Upcoming Features Section */}
              <section className="upcoming-section">
                <div className="section-header">
                  <h3 className="section-title">
                    <span className="material-symbols-outlined section-icon">rocket_launch</span>
                    Coming Soon
                  </h3>
                </div>
                <div className="upcoming-grid">
                  {upcomingFeatures.map((feature) => (
                    <div key={feature.id} className="upcoming-card">
                      <div className="upcoming-icon">
                        <span className="material-symbols-outlined">{feature.icon}</span>
                      </div>
                      <div className="upcoming-info">
                        <span className="upcoming-title">{feature.title}</span>
                        <span className="upcoming-desc">{feature.desc}</span>
                      </div>
                      <button className="btn btn-outline btn-sm btn-pill">
                        {feature.date}
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* Games Grid */}
              <GameGrid startGame={startGame} />
            </div>
          </div>
        )}
      </Layout>

      <ScoresModal isOpen={scoresOpen} onClose={closeScores} />
    </>
  );
}
