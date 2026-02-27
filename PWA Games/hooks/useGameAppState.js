import { useEffect, useState } from 'react';

export default function useGameAppState() {
  const [currentGame, setCurrentGame] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scoresOpen, setScoresOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('light-mode');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light-mode';
    const savedSound = localStorage.getItem('sound_enabled');

    setTheme(savedTheme);
    document.body.className = savedTheme;

    if (savedSound !== null) {
      setSoundEnabled(savedSound === 'true');
    }
  }, []);

  useEffect(() => {
    document.body.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sound_enabled', String(soundEnabled));
  }, [soundEnabled]);

  const startGame = (gameName) => {
    setCurrentGame(gameName);
    setMenuOpen(false);
  };

  const goHome = () => {
    setCurrentGame(null);
    setCurrentView('home');
    setMenuOpen(false);
  };

  const navigateTo = (view) => {
    setCurrentView(view);
    setCurrentGame(null);
    setMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light-mode' ? 'dark-mode' : 'light-mode'));
    setMenuOpen(false);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  const showScores = () => {
    setScoresOpen(true);
    setMenuOpen(false);
  };

  return {
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
    closeScores: () => setScoresOpen(false),
  };
}
