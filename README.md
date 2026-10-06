# Knight Quest 2D - Extended Campaign Edition

A classic 2D retro side-scrolling platformer created in HTML5 & JavaScript.
Inspired by retro 8-bit & 16-bit classics (Super Mario, Alex Kidd, Wonder Boy).

## 100% Copyright-Free & Royalty-Free (CC0 1.0 Universal)
Every single component in this game is dedicated to the **Public Domain (CC0)**:
* **Art & Sprites:** 100% Procedurally generated pixel art (knight, helmet plume, grass & dirt tiles, floating isles, palm trees, coins, and water). No copyrighted sprites or third-party image files.
* **Audio & Music:** 100% Procedurally synthesized via the browser's Web Audio API oscillators. No external MP3/WAV files.
* **Code:** Clean, dependency-free vanilla JavaScript and HTML5 Canvas.

## Campaign Overview (4 Long Stages - ~14,600 Pixels of Adventure)
1. **Stage 1: Sunlit Isles** (96 tiles): Classic day beach archipelago with palm trees, rolling grass hills, water holes, and stepping stones.
2. **Stage 2: Azure Archipelago** (110 tiles): Tropical turquoise noon sky, high stone pillars, floating stone staircases, and multi-block ocean gaps.
3. **Stage 3: Sunset Shoals** (120 tiles): Golden hour sunset sky, wide oceanic abysses, twin watchtowers, and precision leaps.
4. **Stage 4: Royal Citadel Gate** (130 tiles): Epic twilight indigo fortress, grand ocean moats, high secret coin paths, and the ultimate Royal Flag!

## How to Play
1. Double-click [index.html](file:///C:/Users/USER/.gemini/antigravity/scratch/knight-platformer/index.html) in your file explorer to open and play directly in any modern browser (Edge, Chrome, Firefox, Safari).
2. Or run a lightweight local web server:
   ```bash
   python -m http.server 8000
   ```
   and visit `http://localhost:8000`.

### Controls
* **Move Left / Right:** `A` / `D` or `Left Arrow` / `Right Arrow`
* **Jump:** `SPACE`, `W`, or `Up Arrow` (Release early for shorter hop; hold for maximum height)
* **Touch / Mouse:** On-screen D-Pad and Jump buttons are available for mobile devices or mouse clicks.

## Project Structure
* `index.html`: Main game interface, arcade styling, and touch controls.
* `style.css`: Pixelated canvas styling, responsive layout, and dark retro theme.
* `js/audio.js`: Web Audio API sound synthesizer (jump, coin chime, splash, hurt, victory).
* `js/sprites.js`: Procedural pixel art rendering to offscreen canvas textures.
* `js/levels.js`: 4 long, multi-screen stages with unique sky palettes and obstacle placements.
* `js/physics.js`: Platformer physics, tile collision resolution, coyote time, and particle effects.
* `js/game.js`: Game loop, camera tracking, stage transitions, scoring, lives, and state management.

## License
CC0 1.0 Universal (Public Domain Dedication). Feel free to use, modify, distribute, or monetize freely without attribution!
