# 🛡️ Nexus Protocol Defender
**Secure the Verifiable Internet**

A pixel art space shooter built for the Nexus Playground contest. Pilot your verification node through hostile protocol space to protect the decentralized supercomputer from malicious agents threatening network consensus!

![Game Preview](https://img.shields.io/badge/Status-Playable-brightgreen) ![Platform](https://img.shields.io/badge/Platform-Browser-blue) ![License](https://img.shields.io/badge/License-Open%20Source-orange)

## 🎮 Game Features

### **Core Gameplay**
- **Verification Node Combat**: Pilot a detailed 64x64 pixel art verification node with animated processing cores
- **Node Integrity System**: 6-heart system representing network consensus strength
- **Progressive Protocol Threats**: Malicious agent attack rates increase every protocol wave
- **Strategic Proof Fragments**: Permanent proof burst until damage, timed consensus shields and velocity boosts

### **Visual Excellence**
- **Pixel-Perfect Art**: Hand-crafted sprites with crisp, clean aesthetics
- **Animated Effects**: Muzzle flashes, engine flames, particle explosions
- **Dynamic Background**: Scrolling space with planets, nebulae, and asteroids
- **Responsive UI**: Real-time heart display and power-up countdown timers

### **Advanced Systems**
- **Modular Codebase**: Clean, maintainable architecture with 8 focused modules
- **Mobile-Friendly**: Touch controls and responsive design
- **Performance Optimized**: Smooth 60fps gameplay with efficient rendering

## 🎯 How to Play

### **Controls**
- **Mouse/Touch**: Move ship by pointing where you want to go
- **Keyboard**: WASD or Arrow keys for movement
- **Firing**: Automatic when moving or hold Spacebar
- **Pause**: ESC or P key

### **Objective**
Maintain network consensus as long as possible while defending the Verifiable Internet! Eliminate malicious agents to earn NEX Points and collect proof fragments to enhance your verification node.

### **Scoring**
- **Protocol Disruptors**: 100 NEX Points
- **Consensus Breakers**: 250 NEX Points
- **Network Defense Bonus**: NEX Points increase with protocol wave progression

## ⚡ Power-Up System

### **🔴 Health Power-up (Heart)**
- Restores exactly 1 heart
- Cannot exceed 6 hearts maximum
- Essential for survival in later waves

### **💨 Speed Boost (Wings)**
- **Duration**: Exactly 10 seconds
- **Effect**: 50% movement speed increase
- **Visual**: Yellow speed trails behind ship
- **Timer**: Countdown display in UI

### **🔫 Rapid Fire (Bullets)**
- **Duration**: Permanent until damage taken
- **Effect**: Dual-weapon firing, faster rate
- **Strategy**: Protect this power-up - it's lost when hit!
- **Visual**: "RAPID FIRE: ACTIVE" indicator

### **🛡️ Shield (Hexagon)**
- **Duration**: Exactly 10 seconds
- **Effect**: Complete invincibility
- **Visual**: Pulsing cyan shield around ship
- **Timer**: Countdown display in UI

## 🌌 Enemy Types

### **Scout Ships (Red)**
- **Size**: 36x36 pixels (50% larger for easier targeting)
- **Health**: 50 HP
- **Speed**: Fast movement
- **Pattern**: Straight downward flight
- **Firing**: Straight-down bullets only

### **Fighter Ships (Purple)**
- **Size**: 48x42 pixels (50% larger for easier targeting)
- **Health**: 100 HP
- **Speed**: Slower but more durable
- **Pattern**: Weaving movement
- **Firing**: Heavy bullets, straight down

## 🏗️ Technical Architecture

### **Modular Design**
```
js/
├── utils.js           # Helper functions and constants
├── assetManager.js    # Sprite creation and management
├── backgroundRenderer.js # Space background system
├── inputManager.js    # Mouse, touch, keyboard handling
├── player.js          # Player ship class
├── gameObjects.js     # Bullets, enemies, power-ups
├── gameState.js       # Core game logic
└── game.js           # Main game coordinator
```

### **Key Features**
- **No External Dependencies**: Pure vanilla JavaScript
- **Pixel Art Pipeline**: Programmatic sprite generation
- **Efficient Collision**: Rectangle-based detection
- **Responsive Canvas**: Dynamic sizing for all devices

## 🚀 Getting Started

### **Quick Start**
1. Clone or download the repository
2. Open `index.html` in any modern web browser
3. Click "START GAME" and begin defending the network!

### **Development**
```bash
# No build process required - just open in browser
# For local development, use a simple HTTP server:
python -m http.server 8000
# or
npx serve .
```

### **Deployment**
- **GitHub Pages**: Push to gh-pages branch
- **Itch.io**: Upload entire folder as HTML5 game
- **Any Web Host**: Upload all files to web directory

## 🎨 Game Design Philosophy

### **Nexus Theming**
- **Color Palette**: Blues and cyans representing network connectivity
- **Visual Metaphors**: Ships as network nodes, enemies as threats
- **Clean Aesthetics**: Focus on gameplay over flashy effects

### **Arcade-Inspired**
- **Heart System**: Classic 6-heart health like retro games
- **Progressive Difficulty**: Escalating challenge curve
- **Power-up Strategy**: Risk/reward mechanics
- **Pixel Perfect**: Crisp, nostalgic visual style

## 🏆 Contest Information

Built for **Nexus Playground Level 2** contest:
- **Theme**: Nexus-branded, playable, shareable game
- **Requirements**: Open-source, community-friendly
- **Platform**: Browser-based HTML5 game
- **Social**: #NexusPlayground @NexusLabs

## 📱 Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Mobile Browsers**: Optimized touch controls
- **Minimum**: ES6 support required

## 🔧 Configuration

Game balance can be adjusted in `js/utils.js`:
```javascript
const GAME_CONFIG = {
    PLAYER: { SPEED: 300, SIZE: 64 },
    ENEMY: { SPAWN_RATE: 2000, SCOUT_SPEED: 150 },
    BULLET: { PLAYER_SPEED: 500, ENEMY_SPEED: 200 }
};
```

## 🤝 Contributing

This is an open-source contest entry! Feel free to:
- Report bugs or suggest improvements
- Fork and create your own version
- Share gameplay videos and screenshots
- Contribute to the codebase

## 📄 License

Open source - feel free to learn from, modify, and share!

## 🎯 Future Enhancements

Potential additions for post-contest development:
- Boss battles with unique mechanics
- Multiple ship types and customization
- Sound effects and background music
- Local leaderboards and achievements
- Additional weapon types and special abilities

---

**🚀 Ready to defend the Nexus network? Launch the game and show those threats who's boss!**

*Built with ❤️ for the Nexus community*
