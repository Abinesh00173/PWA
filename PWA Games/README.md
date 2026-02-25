# GameVerse - Next.js PWA

A modern Progressive Web App (PWA) built with Next.js and React, featuring 25 games.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the project directory:
```bash
cd nextjs-gameverse
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

## 📦 Production Build

Build the production-ready PWA:
```bash
npm run build
npm start
```

The production build will:
- Generate optimized bundles
- Create service worker for offline functionality
- Enable PWA installation on supported devices

## 🎮 Features

- **25 Games**: Including Snake, Tic Tac Toe, Memory, Flappy Bird, Tetris, and more
- **PWA Support**: Install on mobile/desktop, works offline
- **Responsive Design**: Mobile-first, works on all screen sizes
- **High Scores**: Track your best scores with localStorage
- **Dark/Light Theme**: Toggle between themes
- **Sound Effects**: Optional audio feedback

## 📁 Project Structure

```
nextjs-gameverse/
├── pages/
│   ├── _app.js          # App wrapper with global state
│   ├── _document.js     # Custom HTML document
│   └── index.js         # Main game selection page
├── components/
│   ├── Header.js        # Top navigation bar
│   ├── Menu.js          # Side menu
│   ├── GameGrid.js      # Game card grid
│   ├── ScoresModal.js   # High scores modal
│   └── games/           # Individual game components
├── styles/
│   └── globals.css      # Global styles (migrated from original)
├── public/
│   └── manifest.json    # PWA manifest
├── next.config.js       # Next.js + PWA configuration
└── package.json         # Dependencies

```

## 🔧 PWA Configuration

The app uses `next-pwa` for Progressive Web App functionality:
- Service worker auto-generated during build
- Offline caching with NetworkFirst strategy
- Installable on mobile and desktop
- App manifest configured for standalone mode

## 🎯 Game Implementation Status

- ✅ **Snake** - Fully functional
- ✅ **Cookie Clicker** - Fully functional
- 🚧 **Other Games** - Using placeholder template (ready for implementation)

## 📝 Adding New Games

To implement a game from placeholder to fully functional:

1. Open the game file in `components/games/`
2. Replace the `PlaceholderGame` import with your game logic
3. Use React hooks (useState, useEffect, useRef) for game state
4. Canvas-based games should use `useRef` for the canvas element
5. Save scores to localStorage for high score tracking

Example structure:
```javascript
import { useState, useEffect, useRef } from 'react';

export default function YourGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  
  useEffect(() => {
    // Game initialization and loop
  }, []);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Your Game</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
```

## 🌐 Deployment

Deploy to Vercel (recommended for Next.js):

```bash
npm install -g vercel
vercel
```

Or build static export:
```bash
# Add to next.config.js: output: 'export'
npm run build
# Deploy the 'out' directory to any static host
```

## 📱 Testing PWA Features

1. Build for production: `npm run build && npm start`
2. Open in Chrome/Edge at `localhost:3000`
3. Open DevTools → Application → Service Workers
4. Check "Offline" to test offline functionality
5. Click install icon in address bar to add to home screen

## 🛠️ Technology Stack

- **Next.js 14** - React framework with SSR/SSG
- **React 18** - UI library
- **next-pwa** - PWA plugin for Next.js with Workbox
- **Canvas API** - For game rendering
- **LocalStorage** - For score persistence

## 📄 License

MIT License - Feel free to use and modify!

## 🎨 Customization

- **Theme Colors**: Edit CSS variables in `globals.css`
- **Manifest**: Update `public/manifest.json` for app name, icons, colors
- **Games**: Add/remove games in `components/GameGrid.js` and `pages/index.js`

---

**Original Project**: Plain HTML/CSS/JS PWA
**Migrated To**: Next.js + React PWA

Enjoy gaming! 🎮
