# Stickman Fishing Game

A browser-based fishing game built with vanilla HTML5 Canvas, CSS, and JavaScript. Cast your line, catch fish, and upgrade your bait to catch rarer species!

🎮 **[Play Now!](https://teebs4140.github.io/stickman-fishing/)**

## Features

### Core Gameplay
- **Interactive Fishing Mechanics**: Cast your line into the water and wait for a bite
- **Two-Stage Mini-Game Challenge**:
  - **Quick-Time Event (QTE)**: React quickly when a fish bites! Click "Reel In" within 2.5 seconds
  - **Meter Timing Game**: Time your click to hit the green target zone as the meter oscillates
  - Difficulty scales with fish size - larger fish = faster meter
  - Two chances to succeed: meter goes up (0→100%) then back down (100→0%)

### Progression System
- **5 Bait Tiers**: Upgrade from Basic Bait to Mythic Lure
- **Currency Economy**: Earn coins from catches, spend on upgrades and sell duplicates
- **15 Unique Fish Species** across 5 rarity tiers:
  - Common (Minnow, Sunfish, Perch)
  - Uncommon (Bass, Catfish, Pike)
  - Rare (Koi, Salmon, Eel)
  - Epic (Angler, Swordfish, Dragonfin)
  - Legendary (Leviathan, Starlit Ray, Phantom Shark)

### Collection System
- **Fishing Log**: Track every species you've caught
- **Personal Records**: Best length and highest value for each fish
- **Interactive Gallery**: Click on any fish to view details and sell duplicates
- **Procedural Fish Art**: Unique SVG illustrations for each species

### Visual & Audio
- Beautiful animated water and sky gradient backgrounds
- Smooth stick figure fisher animation with casting/reeling motions
- Dynamic bobber physics (gentle idle bob → frantic hooked bounce)
- Tap ripple animation for touch feedback on canvas
- Responsive UI with accessibility support
- Haptic feedback (vibration) for mobile devices during key game moments

## Controls

### Keyboard (Desktop)
- **Space**: Cast line / Reel in during QTE / Click meter during mini-game
- **U**: Upgrade bait
- **Escape**: Close panels/overlays

### Mouse (Desktop)
- Click buttons for all actions
- Click on fish in collection to view details
- Click anywhere on meter overlay during mini-game to attempt catch

### Touch (Mobile/Tablet) 🎮
- **Tap water/canvas**: Cast your fishing line (when idle)
- **Tap "Reel In" button**: Respond to fish bite during QTE
- **Tap meter overlay**: Attempt catch during timing game
- **Tap fish in collection**: View details and sell options
- **Tap close buttons**: Dismiss panels and overlays
- **Haptic feedback**: Feel vibrations for bites, successes, and failures
- All button controls work via tap
- Smooth momentum scrolling in collection panel (iOS)

## How to Play

1. **Cast Your Line**: Click "Cast Line" or press Space
2. **Wait for a Bite**: Watch for the bobber to start bouncing frantically
3. **React Fast (QTE)**: When "REEL NOW!" appears, click "Reel In" or press Space within 2.5 seconds
4. **Time the Meter**: A timing meter appears with a moving blue indicator
   - Click when the indicator is in the green zone
   - You have two chances: once going up, once coming down
   - Miss both chances and the fish escapes!
5. **Collect Your Catch**: Successful catches earn coins and add to your collection
6. **Upgrade & Repeat**: Use coins to upgrade your bait for better fish

## Difficulty Scaling

The meter mini-game difficulty is calculated using:
```javascript
meterSpeed = baseSpe * (1 + fishSizeRatio * multiplier)
```

- Small fish (< 30cm): Slower meter, easier timing
- Medium fish (30-80cm): Moderate speed
- Large fish (80-150cm): Fast meter
- Legendary fish (150cm+): Very fast, challenging timing

## Installation & Running

### Option 1: Direct Browser
Simply open `index.html` in a modern web browser.

### Option 2: Local Server (Recommended)
```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server

# Then open http://localhost:8000 in your browser
```

## Project Structure

```
fishing-game/
├── index.html          # Main HTML structure
├── style.css           # All styling and animations
├── game.js             # Core game logic and canvas rendering
├── assets/             # Future: sprites, audio, etc.
├── tasks/              # Development planning documents
│   └── fishing-minigame-plan.md
├── README.md           # This file
└── DEVLOG.md          # Development history
```

## Technical Details

### Architecture
- **Zero Build Tools**: Pure HTML/CSS/JS for maximum portability
- **Canvas Rendering**: 60 FPS game loop with delta-time updates
- **State Machine**: Clean phase management (idle → casting → waiting → hooked → minigame → reeling)
- **Responsive Design**: Adapts to different screen sizes

### Performance
- Efficient canvas drawing with minimal redraws
- Smooth animations using `requestAnimationFrame`
- Optimized fish art generation with SVG data URIs

### Browser Compatibility
- Modern browsers with ES6 support
- HTML5 Canvas required
- Tested on Chrome, Firefox, Safari, Edge
- **Mobile**: Optimized for iOS Safari, Chrome on Android
- **Tablets**: Full support for iPad and Android tablets
- Touch events and haptic feedback (Vibration API) supported on compatible devices

## Configuration

Key game balance values in `game.js` CONFIG object:

```javascript
{
  qteTimeWindowMs: 2500,           // QTE reaction time
  meterSpeed: {
    base: 0.4,                     // Base meter speed
    multiplier: 0.8                // 80% increase for largest fish
  },
  targetZone: { start: 60, end: 75 }, // Green zone position (60-75%)
  hookDelayRangeMs: [2200, 5200]   // Random wait time for bites
}
```

## Future Enhancements

- [x] Mobile touch controls optimization ✅ *Completed 2025-11-01*
- [ ] Sound effects and background music
- [ ] Multiple fishing locations with different fish pools
- [ ] Weather effects affecting catch rates
- [ ] Achievements and milestones
- [ ] Daily challenges
- [ ] Rod upgrades in addition to bait
- [ ] Multiplayer leaderboards
- [ ] PWA manifest for "Add to Home Screen"
- [ ] Swipe gestures for navigation

## Credits

Developed with Claude Code as a fishing game prototype demonstrating:
- Canvas-based game development
- State machine patterns
- Progressive difficulty scaling
- Collection/progression systems

## License

MIT License - Feel free to use and modify for your projects!
