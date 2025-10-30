## Fishing Game Development Log

### 2024-11-21
- Project bootstrapped from scratch in `/Users/teebs/Documents/AI-work/fishing game`.
- Chosen stack: vanilla HTML5 Canvas + CSS + JavaScript for portability and zero build tooling.
- Planned structure:
  - `index.html` — main page and UI layout.
  - `style.css` — basic styling for game screen and menus.
  - `game.js` — core game loop, fishing logic, and state management.
  - `assets/` — placeholder for future art/audio (currently empty).
- Core goals:
  1. Cast line to catch randomly generated fish with rarity tiers.
  2. Earn currency to upgrade bait, increasing rare catch rates.
  3. Showcase list screen that tracks and displays caught fish.
  4. Keep code modular enough to add areas, art, and polish later.
- Assumptions:
  - Desktop browser target first; mobile support is a stretch goal.
  - Using simple shapes/placeholders until art is available.
- Implemented responsive UI shell (`index.html`, `style.css`) with HUD, controls, and modal-style collection panel.
- Built `game.js` canvas loop with stick figure angler, animated bobber, cast/wait/hook/reel phases, and keyboard shortcuts (Space to cast/reel, U to upgrade, Esc to close panels).
- Added fish rarity tables, bait tiers with upgrade costs and odds, dynamic catch generation with coin rewards, and a persistent collection log that tracks counts plus personal best sizes/values.
- Wired bait upgrades to earned coins and updated HUD/collection rendering logic to reflect state changes in real time.
- Expanded the layout to a full-viewport experience with responsive canvas resizing, lighter water palette, and a timber dock environment for the stick fisherman.
- Added animated catch spotlight UI with procedurally generated SVG fish art, making every successful reel-in display a unique collectible card.
- Next steps: refine fish art/detail polish, introduce splash/particle animations plus ambient audio, and optimize mobile touch controls alongside balance tuning for bait upgrades.
- Bug fix: ensured `game.js` bootstrap waits for DOM readiness (immediate when already loaded, otherwise via `DOMContentLoaded`) so button wiring always succeeds regardless of how the page is refreshed.
- Visual tweak: redrew the stick figure with thicker strokes, bright colors, a simple hat, and a visible rod to make the angler pop against the background.
- Bug fix: forced `.hidden` utility class to win specificity (via `!important`) so the catch overlay starts hidden and no longer traps the player on first load.
- Visual tweak: adjusted the fishing line to connect from the rod tip instead of the grip so the cast looks natural.
- Bug fix: restored the rod segment by anchoring the line rendering back to the fisher's hand before extending to the rod tip.
- Layout update: removed desktop letterboxing and let the game shell scale to the full viewport (using 100dvh/100vw) so the fishing scene fills the entire device screen.
- Collection update: added thumb art beside each fish entry by reusing the SVG generator so the showcase list now highlights what every species looks like at a glance.
- UX update: collection entries are interactive; clicking or pressing Enter/Space opens the overlay with a full-size fish card for that species.
- Economy update: collection overlay now offers a “Sell One” action (and keyboard `S`) to trade surplus fish for coins, with rarity-weighted payouts.
