// Main Game Loop, Camera, Controls and HUD
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;

        this.viewWidth = 512;
        this.viewHeight = 320;
        this.canvas.width = this.viewWidth;
        this.canvas.height = this.viewHeight;

        this.cameraX = 0;
        this.currentLevelIndex = 0;
        this.level = null;
        this.player = null;
        this.particles = new ParticleSystem();

        this.score = 0;
        this.coinsCollected = 0;
        this.lives = 3;
        this.gameState = 'TITLE'; // 'TITLE', 'PLAYING', 'GAMEOVER', 'VICTORY'
        this.waveTimer = 0;
        this.activeSignText = null;

        this.keys = {
            left: false,
            right: false,
            jump: false,
            jumpJustPressed: false
        };

        this.initControls();
    }

    initControls() {
        window.addEventListener('keydown', (e) => {
            if (window.sounds) window.sounds.init();

            if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
                if (!this.keys.jump) {
                    this.keys.jumpJustPressed = true;
                }
                this.keys.jump = true;
                e.preventDefault();
            }
            if (['ArrowLeft', 'KeyA'].includes(e.code)) {
                this.keys.left = true;
                e.preventDefault();
            }
            if (['ArrowRight', 'KeyD'].includes(e.code)) {
                this.keys.right = true;
                e.preventDefault();
            }

            // Start or Restart with Space/Enter
            if (['Space', 'Enter'].includes(e.code)) {
                if (this.gameState === 'TITLE' || this.gameState === 'GAMEOVER' || this.gameState === 'VICTORY') {
                    this.startNewGame();
                }
            }
        });

        window.addEventListener('keyup', (e) => {
            if (['Space', 'ArrowUp', 'KeyW'].includes(e.code)) {
                this.keys.jump = false;
            }
            if (['ArrowLeft', 'KeyA'].includes(e.code)) {
                this.keys.left = false;
            }
            if (['ArrowRight', 'KeyD'].includes(e.code)) {
                this.keys.right = false;
            }
        });

        // Touch / UI buttons
        const btnLeft = document.getElementById('btn-left');
        const btnRight = document.getElementById('btn-right');
        const btnJump = document.getElementById('btn-jump');

        const bindTouch = (btn, onDown, onUp) => {
            if (!btn) return;
            const startHandler = (e) => {
                e.preventDefault();
                if (window.sounds) window.sounds.init();
                onDown();
            };
            const endHandler = (e) => {
                e.preventDefault();
                onUp();
            };
            btn.addEventListener('touchstart', startHandler, { passive: false });
            btn.addEventListener('touchend', endHandler, { passive: false });
            btn.addEventListener('mousedown', startHandler);
            btn.addEventListener('mouseup', endHandler);
            btn.addEventListener('mouseleave', endHandler);
        };

        bindTouch(btnLeft, () => { this.keys.left = true; }, () => { this.keys.left = false; });
        bindTouch(btnRight, () => { this.keys.right = true; }, () => { this.keys.right = false; });
        bindTouch(btnJump, () => {
            this.keys.jumpJustPressed = true;
            this.keys.jump = true;
            if (this.gameState !== 'PLAYING') this.startNewGame();
        }, () => {
            this.keys.jump = false;
        });
    }

    startNewGame() {
        this.score = 0;
        this.coinsCollected = 0;
        this.lives = 3;
        this.currentLevelIndex = 0;
        this.loadLevel(this.currentLevelIndex);
        this.gameState = 'PLAYING';
    }

    loadLevel(index) {
        this.currentLevelIndex = index;
        const levelData = Levels[index];
        // Deep copy level data so collected items reset
        this.level = {
            ...levelData,
            coins: levelData.coins.map(c => ({ ...c, collected: false })),
            decorations: [...levelData.decorations]
        };

        this.player = new Player(this.level.spawn.x, this.level.spawn.y);
        this.cameraX = 0;
        this.particles.clear();
        this.activeSignText = null;
    }

    loseLife() {
        this.lives--;
        if (this.lives <= 0) {
            this.gameState = 'GAMEOVER';
        }
    }

    update() {
        this.waveTimer += 0.05;

        if (this.gameState === 'STAGE_TRANSITION') {
            this.transitionTimer--;
            if (this.transitionTimer <= 0) {
                this.loadLevel(this.currentLevelIndex + 1);
                this.gameState = 'PLAYING';
            }
            return;
        }

        if (this.gameState !== 'PLAYING') return;

        this.player.update(this.keys, this.level, this.particles);
        this.particles.update();

        // Smooth Camera Follow
        const targetCamX = this.player.x + this.player.width / 2 - this.viewWidth / 2;
        const maxCamX = (this.level.width * 32) - this.viewWidth;
        this.cameraX += (Math.max(0, Math.min(maxCamX, targetCamX)) - this.cameraX) * 0.1;

        // Check Coin Collection
        for (const coin of this.level.coins) {
            if (!coin.collected) {
                const dx = (this.player.x + this.player.width / 2) - (coin.x + 10);
                const dy = (this.player.y + this.player.height / 2) - (coin.y + 10);
                if (Math.hypot(dx, dy) < 24) {
                    coin.collected = true;
                    this.score += 100;
                    this.coinsCollected++;
                    if (window.sounds) window.sounds.playCoin();
                    this.particles.createCoinSparkles(coin.x + 10, coin.y + 10);
                }
            }
        }

        // Check Sign Proximity & Tooltips
        this.activeSignText = null;
        for (const deco of this.level.decorations) {
            if (deco.type === 'sign') {
                const dist = Math.abs((this.player.x + this.player.width / 2) - (deco.x + 12));
                if (dist < 40 && Math.abs(this.player.y - deco.y) < 40) {
                    this.activeSignText = deco.text;
                }
            } else if (deco.type === 'flag') {
                // Goal flag reached!
                const dist = Math.abs((this.player.x + this.player.width / 2) - (deco.x + 14));
                if (dist < 28 && Math.abs(this.player.y - deco.y) < 50) {
                    if (window.sounds) window.sounds.playVictory();
                    if (this.currentLevelIndex + 1 < Levels.length) {
                        this.score += 500;
                        this.gameState = 'STAGE_TRANSITION';
                        this.transitionTimer = 90;
                    } else {
                        this.score += 1500;
                        this.gameState = 'VICTORY';
                    }
                }
            }
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.viewWidth, this.viewHeight);

        // 1. Sky & Ocean Background
        this.drawBackground(ctx);

        if (this.gameState === 'TITLE') {
            this.drawTitleScreen(ctx);
            return;
        }

        // 2. Map Tiles & Water
        this.drawTilemap(ctx);

        // 3. Decorations (Trees, Signs, Bushes, Flag)
        this.drawDecorations(ctx);

        // 4. Collectible Coins
        this.drawCoins(ctx);

        // 5. Particles
        this.particles.draw(ctx, this.cameraX);

        // 6. Player Knight
        this.player.draw(ctx, this.cameraX);

        // 7. Water surface animated waves
        this.drawWaterWaves(ctx);

        // 8. On-screen Sign Tutorial / Hint Prompt
        if (this.activeSignText) {
            this.drawSignPrompt(ctx, this.activeSignText);
        }

        // 9. HUD Overlay (Score, Coins, Hearts, Stage)
        this.drawHUD(ctx);

        // Overlays for Transitions, Game Over & Victory
        if (this.gameState === 'STAGE_TRANSITION') {
            this.drawTransitionScreen(ctx);
        } else if (this.gameState === 'GAMEOVER') {
            this.drawGameOverScreen(ctx);
        } else if (this.gameState === 'VICTORY') {
            this.drawVictoryScreen(ctx);
        }
    }

    drawBackground(ctx) {
        // Sky gradient using level's skyColors
        const skyColors = (this.level && this.level.skyColors) ? this.level.skyColors : ['#29B6F6', '#0288D1', '#01579B'];
        const skyGrad = ctx.createLinearGradient(0, 0, 0, this.viewHeight);
        skyGrad.addColorStop(0, skyColors[0]);
        skyGrad.addColorStop(0.65, skyColors[1]);
        skyGrad.addColorStop(1, skyColors[2]);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

        // Distant background clouds (parallax)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        const cloudOffset = (this.cameraX * 0.2) % 300;
        for (let i = -1; i < 4; i++) {
            const cx = i * 200 - cloudOffset;
            ctx.beginPath();
            ctx.arc(cx, 38, 20, 0, Math.PI * 2);
            ctx.arc(cx + 25, 32, 26, 0, Math.PI * 2);
            ctx.arc(cx + 50, 38, 20, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawTilemap(ctx) {
        const startCol = Math.max(0, Math.floor(this.cameraX / 32) - 1);
        const endCol = Math.min(this.level.width, Math.ceil((this.cameraX + this.viewWidth) / 32) + 1);

        for (let x = startCol; x < endCol; x++) {
            for (let y = 0; y < this.level.height; y++) {
                const tile = this.level.getTile(x, y);
                const rx = Math.floor(x * 32 - this.cameraX);
                const ry = y * 32;

                if (tile === 1) {
                    // Check if adjacent tiles are air or water to render cliff edge
                    const leftT = this.level.getTile(x - 1, y);
                    const rightT = this.level.getTile(x + 1, y);
                    if (rightT === 0 || rightT === 4) {
                        ctx.drawImage(Sprites.images.cliffRightTile, rx, ry);
                    } else if (leftT === 0 || leftT === 4) {
                        ctx.drawImage(Sprites.images.cliffLeftTile, rx, ry);
                    } else {
                        ctx.drawImage(Sprites.images.grassTile, rx, ry);
                    }
                } else if (tile === 2) {
                    ctx.drawImage(Sprites.images.dirtTile, rx, ry);
                    const leftT = this.level.getTile(x - 1, y);
                    const rightT = this.level.getTile(x + 1, y);
                    if (rightT === 0 || rightT === 4) {
                        ctx.fillStyle = '#1A0E06';
                        ctx.fillRect(rx + 30, ry, 2, 32);
                        ctx.fillStyle = '#3A1F0D';
                        ctx.fillRect(rx + 28, ry, 2, 32);
                    }
                    if (leftT === 0 || leftT === 4) {
                        ctx.fillStyle = '#1A0E06';
                        ctx.fillRect(rx, ry, 2, 32);
                        ctx.fillStyle = '#3A1F0D';
                        ctx.fillRect(rx + 2, ry, 2, 32);
                    }
                } else if (tile === 3) {
                    ctx.drawImage(Sprites.images.islandTile, rx, ry);
                } else if (tile === 4) {
                    // 100% VISIBLE WATER IN THE HOLE!
                    const tileAbove = this.level.getTile(x, y - 1);
                    if (tileAbove !== 4) {
                        // Surface tile with foaming waves
                        const waveFrame = Math.floor((Date.now() / 250 + x) % 2);
                        const waterImg = (waveFrame === 0) ? Sprites.images.waterSurface1 : Sprites.images.waterSurface2;
                        ctx.drawImage(waterImg, rx, ry);
                    } else {
                        // Submerged deep water tile
                        ctx.drawImage(Sprites.images.waterDeep, rx, ry);
                    }
                }
            }
        }
    }

    drawDecorations(ctx) {
        for (const deco of this.level.decorations) {
            const rx = Math.floor(deco.x - this.cameraX);
            const ry = deco.y;

            if (rx < -64 || rx > this.viewWidth + 64) continue;

            if (deco.type === 'palm') {
                ctx.drawImage(Sprites.images.palmTree, rx, ry);
            } else if (deco.type === 'sign') {
                ctx.drawImage(Sprites.images.signpost, rx, ry);
            } else if (deco.type === 'bush') {
                ctx.drawImage(Sprites.images.bush, rx, ry);
            } else if (deco.type === 'flag') {
                ctx.drawImage(Sprites.images.goalFlag, rx, ry);
            }
        }
    }

    drawCoins(ctx) {
        const frame = Math.floor((Date.now() / 150) % 4);
        const coinSprite = Sprites.images.coinFrames[frame];

        for (const coin of this.level.coins) {
            if (coin.collected) continue;
            const rx = Math.floor(coin.x - this.cameraX);
            // Gentle hovering bobbing effect
            const bob = Math.sin(Date.now() / 250 + coin.x) * 3;
            const ry = Math.floor(coin.y + bob);

            if (rx >= -20 && rx <= this.viewWidth + 20) {
                ctx.drawImage(coinSprite, rx, ry);
            }
        }
    }

    drawWaterWaves(ctx) {
        const startCol = Math.max(0, Math.floor(this.cameraX / 32) - 1);
        const endCol = Math.min(this.level.width, Math.ceil((this.cameraX + this.viewWidth) / 32) + 1);

        for (let x = startCol; x < endCol; x++) {
            for (let y = 0; y < this.level.height; y++) {
                if (this.level.getTile(x, y) === 4 && this.level.getTile(x, y - 1) !== 4) {
                    const rx = Math.floor(x * 32 - this.cameraX);
                    const ry = y * 32;

                    // Foaming white wave crests
                    ctx.fillStyle = '#FFFFFF';
                    const bob1 = Math.sin(this.waveTimer * 2.5 + x * 0.9) * 2;
                    const bob2 = Math.cos(this.waveTimer * 2.5 + x * 0.9) * 2;
                    ctx.fillRect(rx + 2, ry + 2 + bob1, 12, 2);
                    ctx.fillRect(rx + 18, ry + 2 + bob2, 12, 2);

                    // Aqua highlight
                    ctx.fillStyle = '#38BDF8';
                    ctx.fillRect(rx + 4, ry + 4 + bob1, 8, 1);
                    ctx.fillRect(rx + 20, ry + 4 + bob2, 8, 1);

                    // Rising air bubble
                    ctx.fillStyle = 'rgba(224, 242, 254, 0.75)';
                    const bubbleY = ry + 12 + Math.floor((this.waveTimer * 12 + x * 7) % 16);
                    ctx.fillRect(rx + 14, bubbleY, 2, 2);
                }
            }
        }
    }

    drawSignPrompt(ctx, text) {
        ctx.save();
        ctx.font = 'bold 13px monospace';
        const textWidth = ctx.measureText(text).width;
        const boxWidth = textWidth + 24;
        const boxHeight = 28;
        const boxX = (this.viewWidth - boxWidth) / 2;
        const boxY = 70;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.strokeStyle = '#FACC15';
        ctx.lineWidth = 2;
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.fillText(text, this.viewWidth / 2, boxY + 18);
        ctx.restore();
    }

    drawHUD(ctx) {
        ctx.save();
        ctx.font = 'bold 14px monospace';

        // Semi-transparent top bar
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(0, 0, this.viewWidth, 32);

        // Stage Name / Number
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        const stageLabel = (this.level && this.level.stageNum) ? `STAGE ${this.level.stageNum}` : (this.level ? this.level.name : '');
        ctx.fillText(stageLabel, 12, 21);

        // Hearts (Lives)
        let heartStr = '';
        for (let i = 0; i < this.lives; i++) heartStr += '❤️ ';
        ctx.fillText(heartStr, 230, 21);

        // Coin counter with mini coin icon
        ctx.fillStyle = '#FACC15';
        ctx.fillText(`🪙 ${this.coinsCollected}`, 340, 21);

        // Score
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'right';
        ctx.fillText(`SCORE: ${this.score}`, this.viewWidth - 14, 21);
        ctx.restore();
    }

    drawTransitionScreen(ctx) {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
        ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

        ctx.save();
        ctx.textAlign = 'center';

        ctx.fillStyle = '#FACC15';
        ctx.font = 'bold 26px monospace';
        ctx.fillText('STAGE CLEARED! (+500 PTS)', this.viewWidth / 2, 115);

        ctx.fillStyle = '#38BDF8';
        ctx.font = '16px monospace';
        const nextStage = Levels[this.currentLevelIndex + 1];
        const nextName = nextStage ? nextStage.name : 'Next Stage';
        ctx.fillText(`Entering: ${nextName}...`, this.viewWidth / 2, 160);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '14px monospace';
        ctx.fillText(`Total Coins: 🪙 ${this.coinsCollected}  •  Score: ${this.score}`, this.viewWidth / 2, 205);

        ctx.fillStyle = '#4ADE80';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('GET READY...', this.viewWidth / 2, 250);
        ctx.restore();
    }

    drawTitleScreen(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
        ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

        ctx.save();
        ctx.textAlign = 'center';

        // Title
        ctx.fillStyle = '#FACC15';
        ctx.font = 'bold 32px monospace';
        ctx.fillText('KNIGHT QUEST 2D', this.viewWidth / 2, 90);

        // Subtitle
        ctx.fillStyle = '#94A3B8';
        ctx.font = '14px monospace';
        ctx.fillText('4 Epic Stages • 100% Free & Open Retro Platformer', this.viewWidth / 2, 120);

        // Hero Preview Sprite (Enlarged)
        ctx.drawImage(Sprites.images.knightIdle, this.viewWidth / 2 - 24, 140, 48, 54);

        // Prompt
        ctx.fillStyle = '#38BDF8';
        ctx.font = 'bold 16px monospace';
        const blink = Math.floor(Date.now() / 400) % 2 === 0;
        if (blink) {
            ctx.fillText('PRESS SPACE OR CLICK JUMP TO PLAY', this.viewWidth / 2, 230);
        }

        // Instructions
        ctx.fillStyle = '#E2E8F0';
        ctx.font = '12px monospace';
        ctx.fillText('Controls: [A/D] or [←/→] Walk  •  [SPACE / W / ↑] Jump', this.viewWidth / 2, 270);
        ctx.restore();
    }

    drawGameOverScreen(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 32px monospace';
        ctx.fillText('GAME OVER', this.viewWidth / 2, 110);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '16px monospace';
        ctx.fillText(`Score: ${this.score}  •  Coins: ${this.coinsCollected}`, this.viewWidth / 2, 160);

        ctx.fillStyle = '#FACC15';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('PRESS SPACE OR CLICK JUMP TO RETRY', this.viewWidth / 2, 220);
        ctx.restore();
    }

    drawVictoryScreen(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, this.viewWidth, this.viewHeight);

        ctx.save();
        ctx.textAlign = 'center';
        ctx.fillStyle = '#FACC15';
        ctx.font = 'bold 30px monospace';
        ctx.fillText('ROYAL VICTORY!', this.viewWidth / 2, 90);

        ctx.fillStyle = '#38BDF8';
        ctx.font = '15px monospace';
        ctx.fillText('You conquered all 4 Grand Stages of the Kingdom!', this.viewWidth / 2, 125);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '18px monospace';
        ctx.fillText(`Final Score: ${this.score}  •  Coins: ${this.coinsCollected}`, this.viewWidth / 2, 170);

        ctx.fillStyle = '#4ADE80';
        ctx.font = 'bold 15px monospace';
        ctx.fillText('PRESS SPACE OR CLICK JUMP TO PLAY AGAIN', this.viewWidth / 2, 225);
        ctx.restore();
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

window.addEventListener('DOMContentLoaded', () => {
    Sprites.init();
    window.gameInstance = new Game();
    window.gameInstance.loop();
});
