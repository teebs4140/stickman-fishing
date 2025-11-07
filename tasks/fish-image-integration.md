# Fish Image Integration Plan

## Overview
Integrate the custom fish images from `/fish/` folder into the catch overlay and collection panel, while keeping the procedurally-drawn fish for background animations.

## Design Decision

### Keep Procedural Fish For:
- **Swimming background fish** - Small, animated, ambient elements that add life to the scene
- Simple shapes work well for performance and visual clarity at small sizes

### Use Custom Images For:
- **Catch overlay** - Showcase moment when player catches a fish - they want to see detail
- **Collection panel** - Gallery view displaying all caught fish beautifully
- These are "reward moments" where the artwork should shine

## Implementation Tasks

### 1. Load Fish Images
**Location:** `game.js` - Add after character images loading (around line 113-121)

```javascript
// Fish images - loaded asynchronously
const fishImages = {};
const fishImageFiles = {
  minnow: "lively-minnow.png",
  sunny: "sunny-sunfish.png",
  perch: "yellow-perch.png",
  bass: "river-bass.png",
  catfish: "mudcat.png",
  pike: "needle-pike.png",
  koi: "glowing-koi.png",
  salmon: "silver-salmon.png",
  eel: "storm-eel.png",
  angler: "glimmer-angler.png",
  swordfish: "azure-swordfish.png",
  dragonfin: "dragonfin-carp.png",
  leviathan: "echoing-leviathan.png",
  starlit: "starlit-ray.png",
  shark: "phantom-shark.png",
  rainbow: "rainbow-fish.png",
  diamond: "diamond-fish.png",
  darkmatter: "dark-matter-fish.png",
};

// Load all fish images
Object.keys(fishImageFiles).forEach(fishId => {
  fishImages[fishId] = new Image();
  fishImages[fishId].src = `fish/${fishImageFiles[fishId]}`;
});
```

### 2. Update Catch Overlay
**Location:** `game.js` - Find `showCatchOverlay()` function (search for "catch-overlay")

**Current behavior:** Uses procedurally-drawn fish on canvas
**New behavior:** Display actual fish image

```javascript
function showCatchOverlay(fish) {
  // ... existing code ...

  // Set the fish image source
  catchImage.src = `fish/${fishImageFiles[fish.id]}`;

  // ... rest of existing code ...
}
```

### 3. Update Collection Panel Rendering
**Location:** `game.js` - Find `renderCollectionUI()` function

**Current behavior:** Draws fish using canvas for each collection item
**New behavior:** Use `<img>` elements with actual fish images

```javascript
function renderCollectionUI() {
  // ... existing iteration code ...

  // Create image element instead of canvas
  const fishImg = document.createElement("img");
  fishImg.src = `fish/${fishImageFiles[entry.fish.id]}`;
  fishImg.alt = entry.fish.name;
  fishImg.style.width = "80px";
  fishImg.style.height = "80px";

  // ... add to list item ...
}
```

### 4. Keep Background Fish As-Is
**Location:** `game.js` - `drawBackgroundFish()` function

**No changes needed** - Keep the procedural drawing for performance and simplicity

## File Mapping

| Fish ID | Image File |
|---------|------------|
| minnow | lively-minnow.png |
| sunny | sunny-sunfish.png |
| perch | yellow-perch.png |
| bass | river-bass.png |
| catfish | mudcat.png |
| pike | needle-pike.png |
| koi | glowing-koi.png |
| salmon | silver-salmon.png |
| eel | storm-eel.png |
| angler | glimmer-angler.png |
| swordfish | azure-swordfish.png |
| dragonfin | dragonfin-carp.png |
| leviathan | echoing-leviathan.png |
| starlit | starlit-ray.png |
| shark | phantom-shark.png |
| rainbow | rainbow-fish.png |
| diamond | diamond-fish.png |
| darkmatter | dark-matter-fish.png |

## Testing Checklist

- [ ] All fish images load without 404 errors
- [ ] Catch overlay displays correct fish image when catching each fish
- [ ] Collection panel shows fish images correctly
- [ ] Images scale appropriately on different screen sizes
- [ ] Background fish animations still work (unchanged)
- [ ] Test catching fish of all rarities (Common, Uncommon, Rare, Epic, Legendary, Mythic)
- [ ] Verify image quality and transparency

## Technical Notes

- Fish images are PNG with transparent backgrounds
- Expected size: ~500x500px
- Images should be optimized for web (compressed appropriately)
- All images loaded asynchronously - game should handle missing images gracefully
- Consider adding loading state or fallback for images that haven't loaded yet

## Benefits

✅ Showcases beautiful custom artwork at key moments
✅ Maintains game performance with procedural background fish
✅ Creates visual reward for catching fish
✅ Makes collection panel more engaging and gallery-like
✅ Players can appreciate the detailed fish art
