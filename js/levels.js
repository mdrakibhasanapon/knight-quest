// Multi-Stage Campaign Level Design
// Screen Height: 10 tiles (320px = rows 0..9)
// Tile Codes:
// 0: Air (Open sky / The Hole)
// 1: Grass Top Tile
// 2: Dirt Block Tile
// 3: Floating Island Tile
// 4: Water Hazard Tile (Ocean in the hole)

const Levels = [
    // =========================================================================
    // STAGE 1: SUNLIT ISLES (Length: 96 tiles = ~3,072px)
    // =========================================================================
    {
        name: "Stage 1: Sunlit Isles",
        stageNum: "1 / 4",
        width: 96,
        height: 10,
        skyColors: ['#29B6F6', '#0288D1', '#01579B'],
        spawn: { x: 3 * 32, y: 7 * 32 - 30 },
        decorations: [
            { type: 'sign', x: 5 * 32, y: 7 * 32 - 28, text: "SPACE to Jump!" },
            { type: 'bush', x: 2 * 32, y: 7 * 32 - 16 },
            { type: 'palm', x: 10 * 32, y: 5 * 32 - 60 },
            { type: 'sign', x: 14 * 32, y: 7 * 32 - 28, text: "Watch out for the water hole!" },
            { type: 'palm', x: 23 * 32, y: 7 * 32 - 60 },
            { type: 'bush', x: 28 * 32, y: 7 * 32 - 16 },
            { type: 'palm', x: 42 * 32, y: 5 * 32 - 60 },
            { type: 'bush', x: 48 * 32, y: 6 * 32 - 16 },
            { type: 'sign', x: 51 * 32, y: 6 * 32 - 28, text: "Leap across the floating stones!" },
            { type: 'palm', x: 64 * 32, y: 5 * 32 - 60 },
            { type: 'palm', x: 70 * 32, y: 5 * 32 - 60 },
            { type: 'bush', x: 82 * 32, y: 7 * 32 - 16 },
            { type: 'palm', x: 86 * 32, y: 7 * 32 - 60 },
            { type: 'flag', x: 91 * 32, y: 7 * 32 - 44 }
        ],
        coins: [
            { x: 7 * 32, y: 5 * 32 },
            { x: 11 * 32, y: 3 * 32 },
            { x: 18 * 32, y: 3 * 32 }, // Coin above hole 1
            { x: 25 * 32, y: 5 * 32 },
            { x: 29 * 32, y: 5 * 32 },
            { x: 35 * 32, y: 4 * 32 }, // Over hole 2
            { x: 43 * 32, y: 3 * 32 },
            { x: 47 * 32, y: 4 * 32 },
            { x: 55 * 32, y: 4 * 32 }, // Over hole 3
            { x: 58 * 32, y: 3 * 32 },
            { x: 66 * 32, y: 3 * 32 },
            { x: 75 * 32, y: 4 * 32 }, // Over hole 4
            { x: 84 * 32, y: 5 * 32 },
            { x: 88 * 32, y: 5 * 32 }
        ],
        getTile(x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;

            // Start ground (x: 0..8)
            if (x >= 0 && x <= 8) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            // Elevated hill (x: 9..13)
            if (x >= 9 && x <= 13) {
                if (y === 5) return 1;
                if (y >= 6 && y <= 9) return 2;
            }

            // Step (x: 14..15)
            if (x >= 14 && x <= 15) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            // HOLE 1 (x: 16..19)
            if (x >= 16 && x <= 19) {
                if (x === 18 && y === 5) return 3; // Floating stone
                if (y === 8 || y === 9) return 4; // Water
                return 0;
            }

            // Coastal plateau (x: 20..31)
            if (x >= 20 && x <= 31) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            // HOLE 2 (x: 32..38)
            if (x >= 32 && x <= 38) {
                if (x === 34 && y === 6) return 3;
                if (x === 36 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Mid island plateau (x: 39..51)
            if (x >= 39 && x <= 51) {
                if (x >= 41 && x <= 45 && y === 5) return 1; // High hill on island
                if (x >= 41 && x <= 45 && y >= 6 && y <= 9) return 2;
                if (y === 6) return 1;
                if (y >= 7 && y <= 9) return 2;
            }

            // HOLE 3 (x: 52..60)
            if (x >= 52 && x <= 60) {
                if (x === 54 && y === 6) return 3;
                if (x === 56 && y === 5) return 3;
                if (x === 58 && y === 6) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // High ridge (x: 61..72)
            if (x >= 61 && x <= 72) {
                if (y === 5) return 1;
                if (y >= 6 && y <= 9) return 2;
            }

            // HOLE 4 (x: 73..78)
            if (x >= 73 && x <= 78) {
                if (x === 75 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Grand victory island (x: 79..95)
            if (x >= 79 && x <= 95) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            return 0;
        }
    },

    // =========================================================================
    // STAGE 2: AZURE ARCHIPELAGO (Length: 110 tiles = ~3,520px)
    // =========================================================================
    {
        name: "Stage 2: Azure Archipelago",
        stageNum: "2 / 4",
        width: 110,
        height: 10,
        skyColors: ['#00BCD4', '#0288D1', '#01579B'], // Tropical turquoise
        spawn: { x: 3 * 32, y: 7 * 32 - 30 },
        decorations: [
            { type: 'sign', x: 5 * 32, y: 7 * 32 - 28, text: "High pillars and deep ocean ahead!" },
            { type: 'palm', x: 9 * 32, y: 5 * 32 - 60 },
            { type: 'bush', x: 13 * 32, y: 4 * 32 - 16 },
            { type: 'palm', x: 26 * 32, y: 6 * 32 - 60 },
            { type: 'sign', x: 34 * 32, y: 6 * 32 - 28, text: "Hold jump longer for maximum leap!" },
            { type: 'palm', x: 49 * 32, y: 4 * 32 - 60 },
            { type: 'bush', x: 62 * 32, y: 7 * 32 - 16 },
            { type: 'palm', x: 65 * 32, y: 7 * 32 - 60 },
            { type: 'palm', x: 83 * 32, y: 5 * 32 - 60 },
            { type: 'bush', x: 100 * 32, y: 7 * 32 - 16 },
            { type: 'flag', x: 105 * 32, y: 7 * 32 - 44 }
        ],
        coins: [
            { x: 6 * 32, y: 5 * 32 },
            { x: 10 * 32, y: 3 * 32 },
            { x: 14 * 32, y: 2 * 32 },
            { x: 18 * 32, y: 4 * 32 },
            { x: 21 * 32, y: 3 * 32 },
            { x: 29 * 32, y: 4 * 32 },
            { x: 38 * 32, y: 3 * 32 },
            { x: 41 * 32, y: 4 * 32 },
            { x: 44 * 32, y: 3 * 32 },
            { x: 52 * 32, y: 2 * 32 },
            { x: 63 * 32, y: 5 * 32 },
            { x: 72 * 32, y: 4 * 32 },
            { x: 75 * 32, y: 3 * 32 },
            { x: 78 * 32, y: 4 * 32 },
            { x: 86 * 32, y: 3 * 32 },
            { x: 95 * 32, y: 4 * 32 },
            { x: 102 * 32, y: 5 * 32 }
        ],
        getTile(x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;

            // Start beach (x: 0..7)
            if (x >= 0 && x <= 7) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            // High Pillar 1 (x: 8..10)
            if (x >= 8 && x <= 10) {
                if (y === 5) return 1;
                if (y >= 6 && y <= 9) return 2;
            }

            // High Pillar 2 (x: 12..14)
            if (x >= 12 && x <= 14) {
                if (y === 4) return 1;
                if (y >= 5 && y <= 9) return 2;
            }

            // Ocean gap with staircase stones (x: 15..24)
            if (x >= 15 && x <= 24) {
                if (x === 17 && y === 6) return 3;
                if (x === 20 && y === 5) return 3;
                if (x === 23 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Palm grove plateau (x: 25..36)
            if (x >= 25 && x <= 36) {
                if (y === 6) return 1;
                if (y >= 7 && y <= 9) return 2;
            }

            // Wide Water Chasm 2 (x: 37..46)
            if (x >= 37 && x <= 46) {
                if (x === 39 && y === 6) return 3;
                if (x === 42 && y === 5) return 3;
                if (x === 45 && y === 4) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // High Ridge (x: 47..58)
            if (x >= 47 && x <= 58) {
                if (y === 4) return 1;
                if (y >= 5 && y <= 9) return 2;
            }

            // Step down beach (x: 59..67)
            if (x >= 59 && x <= 67) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            // Water Lagoon (x: 68..79)
            if (x >= 68 && x <= 79) {
                if (x === 70 && y === 6) return 3;
                if (x === 73 && y === 5) return 3;
                if (x === 76 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Hill steps (x: 80..91)
            if (x >= 80 && x <= 91) {
                if (x >= 82 && x <= 86 && y === 5) return 1;
                if (x >= 82 && x <= 86 && y >= 6 && y <= 9) return 2;
                if (y === 6) return 1;
                if (y >= 7 && y <= 9) return 2;
            }

            // Final Gap before finish (x: 92..97)
            if (x >= 92 && x <= 97) {
                if (x === 94 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Finish Island (x: 98..109)
            if (x >= 98 && x <= 109) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            return 0;
        }
    },

    // =========================================================================
    // STAGE 3: SUNSET SHOALS (Length: 120 tiles = ~3,840px)
    // =========================================================================
    {
        name: "Stage 3: Sunset Shoals",
        stageNum: "3 / 4",
        width: 120,
        height: 10,
        skyColors: ['#F97316', '#C2410C', '#431407'], // Golden hour sunset
        spawn: { x: 3 * 32, y: 6 * 32 - 30 },
        decorations: [
            { type: 'sign', x: 5 * 32, y: 6 * 32 - 28, text: "Sunset approaches! Precision is key." },
            { type: 'palm', x: 19 * 32, y: 4 * 32 - 60 },
            { type: 'palm', x: 27 * 32, y: 4 * 32 - 60 },
            { type: 'bush', x: 36 * 32, y: 7 * 32 - 16 },
            { type: 'palm', x: 40 * 32, y: 7 * 32 - 60 },
            { type: 'sign', x: 44 * 32, y: 7 * 32 - 28, text: "Wide oceanic abyss ahead!" },
            { type: 'palm', x: 62 * 32, y: 5 * 32 - 60 },
            { type: 'bush', x: 68 * 32, y: 5 * 32 - 16 },
            { type: 'palm', x: 102 * 32, y: 6 * 32 - 60 },
            { type: 'bush', x: 110 * 32, y: 6 * 32 - 16 },
            { type: 'flag', x: 115 * 32, y: 6 * 32 - 44 }
        ],
        coins: [
            { x: 6 * 32, y: 4 * 32 },
            { x: 11 * 32, y: 3 * 32 },
            { x: 14 * 32, y: 4 * 32 },
            { x: 20 * 32, y: 2 * 32 },
            { x: 24 * 32, y: 3 * 32 },
            { x: 28 * 32, y: 2 * 32 },
            { x: 37 * 32, y: 5 * 32 },
            { x: 48 * 32, y: 4 * 32 },
            { x: 51 * 32, y: 3 * 32 },
            { x: 54 * 32, y: 4 * 32 },
            { x: 64 * 32, y: 3 * 32 },
            { x: 74 * 32, y: 4 * 32 },
            { x: 78 * 32, y: 3 * 32 },
            { x: 82 * 32, y: 4 * 32 },
            { x: 88 * 32, y: 3 * 32 },
            { x: 92 * 32, y: 4 * 32 },
            { x: 105 * 32, y: 4 * 32 },
            { x: 111 * 32, y: 4 * 32 }
        ],
        getTile(x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;

            // Start ridge (x: 0..8)
            if (x >= 0 && x <= 8) {
                if (y === 6) return 1;
                if (y >= 7 && y <= 9) return 2;
            }

            // Water gap 1 (x: 9..16)
            if (x >= 9 && x <= 16) {
                if (x === 11 && y === 5) return 3;
                if (x === 14 && y === 6) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Sunset Twin Towers (x: 17..22, x: 25..30)
            if (x >= 17 && x <= 22) {
                if (y === 4) return 1;
                if (y >= 5 && y <= 9) return 2;
            }

            // Gap between twin towers (x: 23..24)
            if (x >= 23 && x <= 24) {
                if (x === 23 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            if (x >= 25 && x <= 30) {
                if (y === 4) return 1;
                if (y >= 5 && y <= 9) return 2;
            }

            // Lower sea causeway (x: 31..44)
            if (x >= 31 && x <= 44) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            // Wide Abyss (x: 45..57)
            if (x >= 45 && x <= 57) {
                if (x === 47 && y === 6) return 3;
                if (x === 50 && y === 5) return 3;
                if (x === 53 && y === 5) return 3;
                if (x === 55 && y === 6) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Sunset Plateau (x: 58..70)
            if (x >= 58 && x <= 70) {
                if (y === 5) return 1;
                if (y >= 6 && y <= 9) return 2;
            }

            // Stepping descent into lagoon (x: 71..84)
            if (x >= 71 && x <= 84) {
                if (x === 73 && y === 5) return 3;
                if (x === 76 && y === 6) return 3;
                if (x === 79 && y === 5) return 3;
                if (x === 82 && y === 6) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Ocean Trench (x: 85..96)
            if (x >= 85 && x <= 96) {
                if (x === 87 && y === 5) return 3;
                if (x === 90 && y === 4) return 3;
                if (x === 93 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Grand Finish Cliff (x: 97..119)
            if (x >= 97 && x <= 119) {
                if (y === 6) return 1;
                if (y >= 7 && y <= 9) return 2;
            }

            return 0;
        }
    },

    // =========================================================================
    // STAGE 4: ROYAL CITADEL GATE (Length: 130 tiles = ~4,160px)
    // =========================================================================
    {
        name: "Stage 4: Royal Citadel Gate",
        stageNum: "4 / 4",
        width: 130,
        height: 10,
        skyColors: ['#4338CA', '#1E1B4B', '#020617'], // Twilight indigo / royal night
        spawn: { x: 3 * 32, y: 7 * 32 - 30 },
        decorations: [
            { type: 'sign', x: 5 * 32, y: 7 * 32 - 28, text: "FINAL STAGE: Cross the Royal Moat!" },
            { type: 'palm', x: 19 * 32, y: 4 * 32 - 60 },
            { type: 'bush', x: 38 * 32, y: 7 * 32 - 16 },
            { type: 'palm', x: 42 * 32, y: 7 * 32 - 60 },
            { type: 'sign', x: 64 * 32, y: 6 * 32 - 28, text: "Courtyard ahead! Only the brave conquer the gate." },
            { type: 'palm', x: 67 * 32, y: 6 * 32 - 60 },
            { type: 'palm', x: 74 * 32, y: 6 * 32 - 60 },
            { type: 'bush', x: 98 * 32, y: 5 * 32 - 16 },
            { type: 'palm', x: 106 * 32, y: 5 * 32 - 60 },
            { type: 'flag', x: 125 * 32, y: 6 * 32 - 44 }
        ],
        coins: [
            { x: 6 * 32, y: 5 * 32 },
            { x: 12 * 32, y: 4 * 32 },
            { x: 15 * 32, y: 3 * 32 },
            { x: 20 * 32, y: 2 * 32 },
            { x: 27 * 32, y: 4 * 32 },
            { x: 30 * 32, y: 3 * 32 },
            { x: 33 * 32, y: 4 * 32 },
            { x: 45 * 32, y: 5 * 32 },
            // Secret high coin line
            { x: 52 * 32, y: 2 * 32 },
            { x: 55 * 32, y: 2 * 32 },
            { x: 58 * 32, y: 2 * 32 },
            { x: 69 * 32, y: 4 * 32 },
            { x: 80 * 32, y: 4 * 32 },
            { x: 83 * 32, y: 3 * 32 },
            { x: 86 * 32, y: 4 * 32 },
            { x: 90 * 32, y: 3 * 32 },
            { x: 101 * 32, y: 3 * 32 },
            { x: 113 * 32, y: 4 * 32 },
            { x: 120 * 32, y: 4 * 32 },
            { x: 122 * 32, y: 4 * 32 }
        ],
        getTile(x, y) {
            if (x < 0 || x >= this.width || y < 0 || y >= this.height) return 0;

            // Citadel approach (x: 0..8)
            if (x >= 0 && x <= 8) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            // Moat Gap 1 (x: 9..16)
            if (x >= 9 && x <= 16) {
                if (x === 11 && y === 6) return 3;
                if (x === 14 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Outer Watchtower (x: 17..24)
            if (x >= 17 && x <= 24) {
                if (y === 4) return 1;
                if (y >= 5 && y <= 9) return 2;
            }

            // Deep Moat 2 (x: 25..35)
            if (x >= 25 && x <= 35) {
                if (x === 27 && y === 5) return 3;
                if (x === 30 && y === 5) return 3;
                if (x === 33 && y === 6) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Causeway (x: 36..48)
            if (x >= 36 && x <= 48) {
                if (y === 7) return 1;
                if (y >= 8 && y <= 9) return 2;
            }

            // Dual Route Moat (x: 49..62): High path (y=4) and low stones
            if (x >= 49 && x <= 62) {
                if (x === 51 && y === 5) return 3;
                if (x === 53 && y === 4) return 3; // High path
                if (x === 56 && y === 4) return 3;
                if (x === 58 && y === 5) return 3;
                if (x === 60 && y === 6) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Citadel Courtyard (x: 63..76)
            if (x >= 63 && x <= 76) {
                if (y === 6) return 1;
                if (y >= 7 && y <= 9) return 2;
            }

            // Grand Moat (x: 77..94)
            if (x >= 77 && x <= 94) {
                if (x === 79 && y === 5) return 3;
                if (x === 82 && y === 5) return 3;
                if (x === 85 && y === 4) return 3;
                if (x === 88 && y === 5) return 3;
                if (x === 91 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // Fortress Terrace (x: 95..110)
            if (x >= 95 && x <= 110) {
                if (y === 5) return 1;
                if (y >= 6 && y <= 9) return 2;
            }

            // Moat before Royal Gate (x: 111..116)
            if (x >= 111 && x <= 116) {
                if (x === 113 && y === 5) return 3;
                if (y === 8 || y === 9) return 4;
                return 0;
            }

            // The Royal Gate Grand Finish (x: 117..129)
            if (x >= 117 && x <= 129) {
                if (y === 6) return 1;
                if (y >= 7 && y <= 9) return 2;
            }

            return 0;
        }
    }
];

window.Levels = Levels;
