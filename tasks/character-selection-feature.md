# Character Selection Feature Implementation Plan

## Overview
Replace the stick figure fisherman with 3 selectable character images. Each character has a unique rod tip position that requires proper fishing line alignment.

## User Requirements
- **Character images**: Located in `/characters/` directory (3 PNG files)
- **Replace stick figure**: Completely remove procedurally-drawn stick figure
- **Pricing**: One character free (default), others purchasable
- **Remove customization**: Delete existing hat/outfit system
- **No persistence**: Reset on page refresh (current behavior)

## Character Images
1. `image-removebg-preview.png` - Blue outfit character (FREE/default)
2. `image_2-removebg-preview.png` - Pink bunny character (~300 coins)
3. `image_5-removebg-preview.png` - Green outfit character (~500 coins)

## Implementation Phases

### Phase 1: Character System Setup
1. **Load character images** - Create Image objects for all 3 character PNGs
2. **Define character catalog** - Create character data structure with:
   - Character 1 (blue outfit): FREE/default
   - Character 2 (pink bunny): ~300 coins
   - Character 3 (green outfit): ~500 coins
3. **Add character state** - Track selected character and owned characters

### Phase 2: Visual Alignment (Using Puppeteer)
4. **Load game in browser** - Use Puppeteer to navigate to the game
5. **Test each character rendering** - Render each character on canvas at the stickman position
6. **Measure rod tip positions** - For each character, determine exact pixel coordinates where rod tip appears
7. **Calculate rod tip offsets** - Store X/Y offset values for each character

### Phase 3: Core Implementation
8. **Replace drawStickman() with drawCharacter()** - Remove stick figure drawing, render selected character image instead
9. **Update fishing line start point** - Use character-specific rod tip coordinates in `drawFishingLine()`
10. **Update bobber positioning** - Ensure bobber spawns correctly aligned with new rod tips

### Phase 4: Store Integration
11. **Remove hat/outfit customization** - Delete cosmetics catalog, UI panels, and related code
12. **Update store UI** - Modify customization panel to show character selection instead
13. **Implement character purchase/selection** - Add buy/equip logic for characters

### Phase 5: Testing & Polish
14. **Test all characters** - Use Puppeteer to verify fishing line alignment for each character
15. **Test responsive sizing** - Ensure characters scale properly on different screen sizes
16. **Verify game mechanics** - Confirm fishing, catching, and animations work with all characters

## Key Technical Changes

### Files to Modify
- `game.js` - Main implementation file
- `index.html` - Update UI panels
- `style.css` - Update styling (if needed)

### Code Sections to Change
- **Lines 113-182**: Remove cosmetics catalog
- **Lines 1221-1332**: Replace `drawStickman()` with `drawCharacter()`
- **Lines 1334-1348**: Update fishing line start point
- **Lines 250-257**: Replace `stickman` object with `character` system

### New Data Structures
```javascript
const characters = {
  char1: {
    id: "char1",
    name: "Fisher Blue",
    cost: 0,
    image: null, // Will be loaded
    rodTipOffsetX: TBD, // Measured with Puppeteer
    rodTipOffsetY: TBD
  },
  // ... char2, char3
}

state.characters = {
  owned: new Set(["char1"]), // char1 is free
  selected: "char1"
}
```

## Rod Tip Alignment Strategy
- Current: `stickman.rodTipX/Y` calculated from hand position
- New: `character.baseX + rodTipOffsets[selectedChar].x`
- Use Puppeteer to visually measure and test each character's rod tip position
