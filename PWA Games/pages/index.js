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

export default function Home() {
  const {
    currentGame,
    menuOpen,
    scoresOpen,
    soundEnabled,
    startGame,
    goHome,
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
        <title>GameVerse - Play Games</title>
      </Head>

      <Menu
        isOpen={menuOpen}
        onClose={toggleMenu}
        goHome={goHome}
        toggleSound={toggleSound}
        showScores={showScores}
        toggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
      />

      <Layout title={currentGame ? currentGame.toUpperCase() : 'GameVerse'} onMenuClick={toggleMenu}>
        {!currentGame ? (
          <div className="screen" id="homeScreen">
            <div className="container">
              <div className="title">🎮 GameVerse</div>
              <div className="subtitle">Play Awesome Games!</div>
              <GameGrid startGame={startGame} />
            </div>
          </div>
        ) : (
          renderGame()
        )}
      </Layout>

      <ScoresModal isOpen={scoresOpen} onClose={closeScores} />
    </>
  );
}
