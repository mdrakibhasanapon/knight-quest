// Procedural Pixel Art Generator (100% Original, Royalty & Copyright-Free)
const Sprites = {
    TILE_SIZE: 32,
    initialized: false,
    images: {},

    createPixelCanvas(width, height) {
        const c = document.createElement('canvas');
        c.width = width;
        c.height = height;
        const ctx = c.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        return { canvas: c, ctx: ctx };
    },

    init() {
        if (this.initialized) return;
        this.generateTiles();
        this.generateKnight();
        this.generateCoins();
        this.generateObstacles();
        this.generateDecorations();
        this.initialized = true;
    },

    generateTiles() {
        const S = this.TILE_SIZE;

        // 1. Grass Top Tile (Center)
        const grass = this.createPixelCanvas(S, S);
        const gCtx = grass.ctx;
        gCtx.fillStyle = '#8B5A2B';
        gCtx.fillRect(0, 0, S, S);
        gCtx.fillStyle = '#A06E3C';
        gCtx.fillRect(4, 16, 6, 6);
        gCtx.fillRect(18, 20, 8, 6);
        gCtx.fillStyle = '#6E431F';
        gCtx.fillRect(12, 14, 4, 4);
        gCtx.fillRect(8, 24, 6, 4);
        gCtx.fillRect(24, 14, 4, 4);
        gCtx.fillStyle = '#3E9628';
        gCtx.fillRect(0, 0, S, 10);
        gCtx.fillStyle = '#56C537';
        gCtx.fillRect(0, 0, S, 6);
        gCtx.fillStyle = '#7CE35A';
        gCtx.fillRect(2, 1, 6, 2);
        gCtx.fillRect(12, 1, 8, 2);
        gCtx.fillRect(24, 1, 6, 2);
        gCtx.fillStyle = '#3E9628';
        for (let x = 0; x < S; x += 4) {
            const h = (x % 8 === 0) ? 14 : 11;
            gCtx.fillRect(x, 6, 3, h - 6);
        }
        gCtx.fillStyle = 'rgba(0,0,0,0.18)';
        gCtx.fillRect(0, S - 2, S, 2);
        this.images.grassTile = grass.canvas;

        // 2. Dirt Fill Tile
        const dirt = this.createPixelCanvas(S, S);
        const dCtx = dirt.ctx;
        dCtx.fillStyle = '#946132';
        dCtx.fillRect(0, 0, S, S);
        dCtx.fillStyle = '#A87342';
        dCtx.fillRect(4, 4, 8, 8);
        dCtx.fillRect(18, 16, 10, 8);
        dCtx.fillRect(8, 20, 6, 6);
        dCtx.fillStyle = '#6D411D';
        dCtx.fillRect(16, 6, 6, 6);
        dCtx.fillRect(4, 16, 6, 8);
        dCtx.fillRect(24, 8, 4, 6);
        dCtx.fillStyle = 'rgba(0,0,0,0.22)';
        dCtx.fillRect(0, S - 2, S, 2);
        dCtx.fillRect(S - 2, 0, 2, S);
        this.images.dirtTile = dirt.canvas;

        // 3. Floating Island Tile
        const island = this.createPixelCanvas(S, S);
        const iCtx = island.ctx;
        iCtx.fillStyle = '#8B5A2B';
        iCtx.fillRect(2, 0, S - 4, S - 4);
        iCtx.fillStyle = '#A06E3C';
        iCtx.fillRect(6, 12, 8, 8);
        iCtx.fillStyle = '#56C537';
        iCtx.fillRect(0, 0, S, 8);
        iCtx.fillStyle = '#3E9628';
        iCtx.fillRect(0, 8, S, 4);
        iCtx.fillStyle = 'rgba(0,0,0,0.25)';
        iCtx.fillRect(2, S - 4, S - 4, 4);
        this.images.islandTile = island.canvas;

        // 4. Cliff Right Tile (Drop-off edge into pit)
        const cliffR = this.createPixelCanvas(S, S);
        const crCtx = cliffR.ctx;
        crCtx.drawImage(grass.canvas, 0, 0);
        crCtx.fillStyle = '#3A1F0D';
        crCtx.fillRect(S - 4, 0, 4, S); // Dark cliff wall edge
        crCtx.fillStyle = '#1A0E06';
        crCtx.fillRect(S - 2, 0, 2, S);
        this.images.cliffRightTile = cliffR.canvas;

        // 5. Cliff Left Tile
        const cliffL = this.createPixelCanvas(S, S);
        const clCtx = cliffL.ctx;
        clCtx.drawImage(grass.canvas, 0, 0);
        clCtx.fillStyle = '#3A1F0D';
        clCtx.fillRect(0, 0, 4, S);
        clCtx.fillStyle = '#1A0E06';
        clCtx.fillRect(0, 0, 2, S);
        this.images.cliffLeftTile = cliffL.canvas;
    },

    generateObstacles() {
        const S = this.TILE_SIZE;

        // 1. Water Surface Tile (Frame 1) - Vibrant aqua body with white crests
        const makeWaterSurface = (waveOffset) => {
            const { canvas, ctx } = this.createPixelCanvas(S, S);
            
            // Translucent water body
            const grad = ctx.createLinearGradient(0, 6, 0, S);
            grad.addColorStop(0, '#0284C7'); // Cyan/Aqua
            grad.addColorStop(0.6, '#0369A1');
            grad.addColorStop(1, '#075985');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 6, S, S - 6);

            // Underwater light rays
            ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
            ctx.fillRect(4, 10, 6, S - 10);
            ctx.fillRect(18, 14, 8, S - 14);

            // Underwater air bubbles
            ctx.fillStyle = '#BAE6FD';
            ctx.fillRect(8, 20 - waveOffset, 2, 2);
            ctx.fillRect(22, 16 + waveOffset, 2, 2);
            ctx.fillRect(14, 26, 3, 3);

            // Distinct Foaming Wave Crests (matches user screenshot `~~~~`)
            // White foam crests on top
            ctx.fillStyle = '#FFFFFF';
            for (let x = 0; x < S; x += 8) {
                const ox = (x + waveOffset) % S;
                ctx.fillRect(ox, 2, 6, 3);
                ctx.fillRect(ox + 1, 1, 4, 1);
            }
            // Cyan foam shadow
            ctx.fillStyle = '#38BDF8';
            for (let x = 0; x < S; x += 8) {
                const ox = (x + waveOffset) % S;
                ctx.fillRect(ox, 5, 6, 2);
            }
            return canvas;
        };

        this.images.waterSurface1 = makeWaterSurface(0);
        this.images.waterSurface2 = makeWaterSurface(4);

        // 2. Deep Water Tile (Fully submerged water)
        const deepW = this.createPixelCanvas(S, S);
        const dwCtx = deepW.ctx;
        dwCtx.fillStyle = '#0369A1';
        dwCtx.fillRect(0, 0, S, S);
        dwCtx.fillStyle = '#075985';
        dwCtx.fillRect(0, 16, S, 16);
        // Floating bubbles
        dwCtx.fillStyle = '#7DD3FC';
        dwCtx.fillRect(6, 8, 3, 3);
        dwCtx.fillRect(20, 18, 2, 2);
        dwCtx.fillRect(12, 24, 2, 2);
        this.images.waterDeep = deepW.canvas;

        // 3. Spikes Hazard Tile (Triple iron spikes with red danger tips)
        const spike = this.createPixelCanvas(S, S);
        const spCtx = spike.ctx;

        // Base stone plate
        spCtx.fillStyle = '#334155';
        spCtx.fillRect(1, 26, S - 2, 6);
        spCtx.fillStyle = '#475569';
        spCtx.fillRect(2, 27, S - 4, 2);

        // 3 Spikes (Triangle pixel coordinates)
        const drawSpikeTriangle = (centerX) => {
            // Outline
            spCtx.fillStyle = '#0F172A';
            for (let row = 0; row < 20; row++) {
                const halfW = Math.floor(row * 0.28);
                spCtx.fillRect(centerX - halfW - 1, 6 + row, (halfW * 2) + 3, 1);
            }

            // Silver metal fill
            spCtx.fillStyle = '#94A3B8';
            for (let row = 0; row < 19; row++) {
                const halfW = Math.floor(row * 0.28);
                spCtx.fillRect(centerX - halfW, 6 + row, (halfW * 2) + 1, 1);
            }

            // Left specular shine highlight
            spCtx.fillStyle = '#F8FAFC';
            for (let row = 2; row < 18; row++) {
                const halfW = Math.floor(row * 0.28);
                spCtx.fillRect(centerX - halfW, 6 + row, 1, 1);
            }

            // Red blood / hazard sharp tip!
            spCtx.fillStyle = '#EF4444';
            spCtx.fillRect(centerX, 6, 1, 4);
            spCtx.fillRect(centerX - 1, 8, 3, 2);
            spCtx.fillStyle = '#B91C1C';
            spCtx.fillRect(centerX - 1, 10, 3, 2);
        };

        drawSpikeTriangle(5);
        drawSpikeTriangle(16);
        drawSpikeTriangle(27);
        this.images.spikeTile = spike.canvas;

        // 4. Leaping Hazard Fish (Piranha)
        const fish = this.createPixelCanvas(24, 24);
        const fCtx = fish.ctx;
        // Red body
        fCtx.fillStyle = '#DC2626';
        fCtx.fillRect(4, 4, 14, 14);
        fCtx.fillRect(2, 6, 18, 10);
        // Back tail fin
        fCtx.fillStyle = '#B91C1C';
        fCtx.fillRect(18, 2, 4, 6);
        fCtx.fillRect(18, 14, 4, 6);
        // Yellow evil eye
        fCtx.fillStyle = '#FEF08A';
        fCtx.fillRect(6, 6, 5, 5);
        fCtx.fillStyle = '#000000';
        fCtx.fillRect(6, 7, 2, 3);
        // Sharp white teeth
        fCtx.fillStyle = '#FFFFFF';
        fCtx.fillRect(2, 10, 3, 2);
        fCtx.fillRect(2, 14, 3, 2);
        fCtx.fillRect(4, 12, 2, 2);
        this.images.hazardFish = fish.canvas;
    },

    generateKnight() {
        const W = 32;
        const H = 36;

        const drawKnightBase = (walkOffset, isJumping = false) => {
            const { canvas, ctx } = this.createPixelCanvas(W, H);

            // 1. Red Plume on Helmet
            ctx.fillStyle = '#E52521';
            ctx.fillRect(8, 2, 10, 4);
            ctx.fillRect(4, 4, 6, 4);
            ctx.fillStyle = '#FF5252';
            ctx.fillRect(9, 3, 6, 2);

            // 2. Silver Helmet
            ctx.fillStyle = '#8F9BA6';
            ctx.fillRect(8, 6, 16, 16);
            ctx.fillStyle = '#B4C3D0';
            ctx.fillRect(10, 7, 12, 4);
            ctx.fillStyle = '#4B5563';
            ctx.fillRect(12, 12, 12, 8);
            ctx.fillStyle = '#111827';
            ctx.fillRect(14, 14, 8, 2);
            ctx.fillRect(16, 16, 2, 4);
            ctx.fillRect(19, 16, 2, 4);

            // 3. Green Cloak / Body Tunic
            ctx.fillStyle = '#228B22';
            ctx.fillRect(6, 20, 16, 10);
            ctx.fillStyle = '#2EAA2E';
            ctx.fillRect(7, 21, 10, 6);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(6, 29, 16, 2);

            // 4. Legs / Boots
            ctx.fillStyle = '#2B2B2B';
            if (isJumping) {
                ctx.fillRect(8, 30, 5, 4);
                ctx.fillRect(15, 29, 5, 4);
            } else {
                const leg1 = 30 + walkOffset;
                const leg2 = 30 - walkOffset;
                ctx.fillRect(8, Math.min(H - 4, Math.max(28, leg1)), 5, 5);
                ctx.fillRect(16, Math.min(H - 4, Math.max(28, leg2)), 5, 5);
            }
            return canvas;
        };

        this.images.knightIdle = drawKnightBase(0);
        this.images.knightWalk1 = drawKnightBase(2);
        this.images.knightWalk2 = drawKnightBase(-2);
        this.images.knightJump = drawKnightBase(0, true);
    },

    generateCoins() {
        const S = 20;
        this.images.coinFrames = [];
        const widths = [16, 12, 6, 12];

        for (let i = 0; i < 4; i++) {
            const { canvas, ctx } = this.createPixelCanvas(S, S);
            const w = widths[i];
            const x = (S - w) / 2;

            ctx.fillStyle = '#E5A00D';
            ctx.fillRect(x, 2, w, S - 4);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x + 1, 4, Math.max(1, w - 2), S - 8);
            ctx.fillStyle = '#FFF7A5';
            ctx.fillRect(x + 2, 5, Math.max(1, w - 4), 3);

            this.images.coinFrames.push(canvas);
        }
    },

    generateDecorations() {
        const pw = 48;
        const ph = 64;
        const palm = this.createPixelCanvas(pw, ph);
        const pCtx = palm.ctx;

        pCtx.fillStyle = '#8B5A2B';
        pCtx.fillRect(20, 24, 8, 40);
        pCtx.fillStyle = '#A66E38';
        for (let y = 28; y < ph; y += 8) {
            pCtx.fillRect(18, y, 12, 3);
        }

        pCtx.fillStyle = '#228B22';
        pCtx.fillRect(16, 8, 16, 16);
        pCtx.fillRect(8, 12, 32, 10);
        pCtx.fillRect(4, 18, 10, 8);
        pCtx.fillRect(34, 18, 10, 8);
        pCtx.fillStyle = '#4CAF50';
        pCtx.fillRect(18, 6, 12, 6);
        pCtx.fillRect(10, 10, 10, 4);
        pCtx.fillRect(28, 10, 10, 4);
        this.images.palmTree = palm.canvas;

        const sign = this.createPixelCanvas(24, 28);
        const sCtx = sign.ctx;
        sCtx.fillStyle = '#6E431F';
        sCtx.fillRect(10, 10, 4, 18);
        sCtx.fillStyle = '#9C6938';
        sCtx.fillRect(2, 4, 20, 12);
        sCtx.fillStyle = '#BE874E';
        sCtx.fillRect(4, 6, 16, 8);
        sCtx.fillStyle = '#4A2A0A';
        sCtx.fillRect(11, 7, 2, 4);
        sCtx.fillRect(11, 12, 2, 2);
        this.images.signpost = sign.canvas;

        const mush = this.createPixelCanvas(20, 20);
        const mCtx = mush.ctx;
        mCtx.fillStyle = '#2E7D32';
        mCtx.fillRect(2, 8, 16, 10);
        mCtx.fillStyle = '#4CAF50';
        mCtx.fillRect(4, 5, 12, 6);
        mCtx.fillStyle = '#81C784';
        mCtx.fillRect(6, 6, 3, 3);
        mCtx.fillRect(12, 8, 2, 2);
        this.images.bush = mush.canvas;

        const flag = this.createPixelCanvas(28, 48);
        const fCtx = flag.ctx;
        fCtx.fillStyle = '#78909C';
        fCtx.fillRect(6, 4, 4, 44);
        fCtx.fillStyle = '#FFD700';
        fCtx.fillRect(4, 2, 8, 4);
        fCtx.fillStyle = '#E53935';
        fCtx.fillRect(10, 6, 16, 14);
        fCtx.fillStyle = '#FFD700';
        fCtx.fillRect(13, 9, 8, 8);
        this.images.goalFlag = flag.canvas;
    }
};

window.Sprites = Sprites;
