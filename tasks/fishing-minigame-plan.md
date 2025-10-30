# Fishing Mini-Game Implementation Plan

## Overview
Add challenge to fishing by implementing a two-stage mini-game when a fish bites:
1. Quick-time event (QTE) - Click "Reel In" within a time window
2. Meter timing game - Click when indicator hits target zone

## Current Game Flow
1. **idle** → Player casts line
2. **casting** → Line animates to water
3. **waiting** → Bobber gently bobs, waiting for bite
4. **hooked** → Bobber bounces frantically, reel button enabled ❌ NO CHALLENGE
5. **reeling** → Fish automatically reeled in
6. **rewards** → Player gets coins and fish added to collection

## Problem
Once hooked (step 4), there's no challenge - player just clicks "Reel In" whenever they want.

## Solution: Two-Stage Mini-Game

### Stage 1: Quick-Time Event (QTE) When Fish Bites
**Location:** Modify the `hooked` phase in `updateLine()` function (game.js:563-566)

**Mechanics:**
- Add countdown timer (2-3 seconds) that starts when fish bites
- Display visual indicator (pulsing "REEL NOW!" text or timer bar on canvas)
- If player clicks "Reel In" within window → proceed to meter mini-game
- If timer expires → fish escapes, show failure message, reset to idle

### Stage 2: Meter Mini-Game Phase
**Location:** Add new `minigame` phase between `hooked` and `reeling`

**Mechanics:**
- Create meter UI overlay with:
  - Horizontal progress bar (0-100%)
  - Colored target zone (sweet spot, e.g., 60-75%)
  - Moving indicator that fills/sweeps across bar
- Meter fill speed based on fish size:
  ```javascript
  speed = baseSpeed + (fishLength / lengthRange[1]) * multiplier
  ```
  - Bigger fish = faster meter = harder timing
- Player clicks when indicator is in target zone:
  - **Success** → continue to reeling phase, full rewards
  - **Failure** → fish escapes OR reduce fish value/size

## Implementation Details

### 1. New UI Elements

**HTML additions (index.html):**
```html
<!-- QTE overlay -->
<div id="qte-overlay" class="qte-overlay hidden">
  <div class="qte-content">
    <h2>REEL NOW!</h2>
    <div class="qte-timer-bar"></div>
  </div>
</div>

<!-- Meter mini-game overlay -->
<div id="meter-overlay" class="meter-overlay hidden">
  <div class="meter-container">
    <h3>Time your catch!</h3>
    <div class="meter-bar">
      <div class="meter-target-zone"></div>
      <div class="meter-indicator"></div>
    </div>
    <p class="meter-hint">Click when in the green zone!</p>
  </div>
</div>
```

**CSS additions (style.css):**
- Meter container styling with backdrop
- Progress bar animations
- Target zone visual (green zone)
- Success/failure flash effects
- QTE timer bar styling

### 2. Game Config Updates

**Add to CONFIG object (game.js:46-53):**
```javascript
qteTimeWindowMs: 2500,           // Time to click reel-in after bite
meterSpeed: {
  base: 0.8,                     // Base speed for small fish
  multiplier: 1.2                // Speed increase per fish size
},
targetZone: { start: 60, end: 75 }, // Sweet spot percentage
```

### 3. Game State Updates

**Add to state object (game.js:110-126):**
```javascript
qteTimer: 0,                     // Tracks QTE countdown
qteActive: false,                // QTE window state
meterProgress: 0,                // Current meter fill (0-100)
meterActive: false,              // Meter mini-game active
```

### 4. Phase Updates

**Modify linePhase enum:**
- Keep: `idle`, `casting`, `waiting`
- Update `hooked` to include QTE timer
- Add: `minigame` (new phase for meter)
- Keep: `reeling`

### 5. Implementation Steps

1. ✅ Create plan document
2. Add QTE overlay HTML/CSS
3. Add meter mini-game overlay HTML/CSS
4. Update CONFIG with timing constants
5. Update state object with new properties
6. Modify `hooked` phase to start QTE timer
7. Add canvas rendering for QTE countdown
8. Handle QTE success (transition to minigame)
9. Handle QTE failure (fish escapes)
10. Implement `minigame` phase logic
11. Add meter animation and rendering
12. Wire click handler to check target zone hit
13. Handle meter success (transition to reeling)
14. Handle meter failure (fish escapes with message)
15. Update `reelLine()` function to work with new flow
16. Add status messages for player feedback
17. Test difficulty balance with different fish sizes
18. Polish animations and transitions

### 6. Difficulty Scaling

**Fish Size → Meter Speed:**
- Small fish (< 30cm): Slow meter, easy timing
- Medium fish (30-80cm): Moderate speed
- Large fish (80-150cm): Fast meter
- Legendary fish (150cm+): Very fast meter, tight window

**Formula:**
```javascript
const fishSizeRatio = pendingCatch.length / pendingCatch.lengthRange[1];
const meterSpeed = CONFIG.meterSpeed.base + (fishSizeRatio * CONFIG.meterSpeed.multiplier);
```

### 7. User Feedback

**Visual:**
- QTE: Pulsing overlay with shrinking timer bar
- Meter: Smooth animation with color-coded zones
- Success: Green flash + particle effects (future)
- Failure: Red flash + "Fish got away!" message

**Audio (future enhancement):**
- Tension music during QTE
- Tick-tock sound as timer counts down
- Success/failure sound effects

## Testing Checklist

- [ ] QTE appears immediately when fish bites
- [ ] QTE timer counts down correctly
- [ ] Clicking "Reel In" during QTE starts meter game
- [ ] Missing QTE causes fish to escape
- [ ] Meter speed scales with fish size
- [ ] Clicking in target zone catches fish
- [ ] Clicking outside target zone causes fish to escape
- [ ] All animations are smooth
- [ ] Status messages are clear and helpful
- [ ] Game returns to idle state correctly after failure
- [ ] Keyboard shortcuts still work (Space for reel)
