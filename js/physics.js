// Platformer Physics and Particle System
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    add(x, y, vx, vy, color, size, life) {
        this.particles.push({
            x, y, vx, vy, color, size,
            maxLife: life,
            life: life
        });
    }

    createDust(x, y) {
        for (let i = 0; i < 4; i++) {
            const vx = (Math.random() - 0.5) * 1.5;
            const vy = -Math.random() * 1.2;
            this.add(x, y, vx, vy, '#D7CCC8', 3, 15 + Math.random() * 10);
        }
    }

    createCoinSparkles(x, y) {
        const colors = ['#FFD700', '#FFF59D', '#FFA000', '#FFFFFF'];
        for (let i = 0; i < 10; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 3;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.add(x, y, vx, vy, color, 3, 20 + Math.random() * 10);
        }
    }

    createSplash(x, y) {
        for (let i = 0; i < 14; i++) {
            const vx = (Math.random() - 0.5) * 3;
            const vy = -1.5 - Math.random() * 3.5;
            this.add(x, y, vx, vy, '#80D8FF', 3, 25 + Math.random() * 15);
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.12; // light gravity
            p.life--;
            if (p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx, cameraX) {
        for (const p of this.particles) {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
            ctx.fillRect(Math.floor(p.x - cameraX), Math.floor(p.y), p.size, p.size);
        }
        ctx.globalAlpha = 1.0;
    }

    clear() {
        this.particles = [];
    }
}

class Player {
    constructor(x, y) {
        this.spawnX = x;
        this.spawnY = y;
        this.reset();
    }

    reset() {
        this.x = this.spawnX;
        this.y = this.spawnY;
        this.vx = 0;
        this.vy = 0;
        this.width = 20;
        this.height = 30;
        this.facing = 1; // 1: right, -1: left
        this.onGround = false;
        this.coyoteTime = 0;
        this.jumpBuffer = 0;
        this.walkFrame = 0;
        this.walkTimer = 0;
        this.isDead = false;
        this.respawnTimer = 0;
        this.invulnerableTimer = 0;
    }

    update(keys, level, particles) {
        if (this.isDead) {
            this.respawnTimer--;
            if (this.respawnTimer <= 0) {
                this.isDead = false;
                this.x = this.spawnX;
                this.y = this.spawnY;
                this.vx = 0;
                this.vy = 0;
                this.invulnerableTimer = 60;
            }
            return;
        }

        if (this.invulnerableTimer > 0) {
            this.invulnerableTimer--;
        }

        // Horizontal Movement
        const accel = 0.55;
        const friction = 0.82;
        const maxSpeed = 3.8;

        if (keys.left) {
            this.vx -= accel;
            this.facing = -1;
        } else if (keys.right) {
            this.vx += accel;
            this.facing = 1;
        } else {
            this.vx *= friction;
            if (Math.abs(this.vx) < 0.1) this.vx = 0;
        }

        // Clamp speed
        this.vx = Math.max(-maxSpeed, Math.min(maxSpeed, this.vx));

        // Jump mechanics (with coyote time & jump buffer)
        if (this.onGround) {
            this.coyoteTime = 6; // ~6 frames leeway
        } else {
            if (this.coyoteTime > 0) this.coyoteTime--;
        }

        if (keys.jumpJustPressed) {
            this.jumpBuffer = 6;
            keys.jumpJustPressed = false;
        }
        if (this.jumpBuffer > 0) this.jumpBuffer--;

        if (this.jumpBuffer > 0 && this.coyoteTime > 0) {
            this.vy = -10.5;
            this.onGround = false;
            this.coyoteTime = 0;
            this.jumpBuffer = 0;
            if (window.sounds) window.sounds.playJump();
            particles.createDust(this.x + this.width / 2, this.y + this.height);
        }

        // Variable jump height: release early cuts jump short
        if (!keys.jump && this.vy < -3.5) {
            this.vy *= 0.65;
        }

        // Gravity
        this.vy += 0.52;
        if (this.vy > 10) this.vy = 10; // terminal fall speed

        // Move Horizontal & Resolve Collisions
        this.x += this.vx;
        this.resolveTileCollision(level, 'x', particles);

        // Move Vertical & Resolve Collisions
        this.y += this.vy;
        this.onGround = false;
        this.resolveTileCollision(level, 'y', particles);

        // Animation timers
        if (this.onGround && Math.abs(this.vx) > 0.3) {
            this.walkTimer += Math.abs(this.vx) * 0.12;
            if (this.walkTimer > 1) {
                this.walkTimer = 0;
                this.walkFrame = (this.walkFrame + 1) % 2;
                if (Math.random() < 0.35) {
                    particles.createDust(this.x + this.width / 2, this.y + this.height);
                }
            }
        } else {
            this.walkFrame = 0;
            this.walkTimer = 0;
        }

        // Check Spike Collision (Tile 5)
        const pLeft = Math.floor((this.x + 4) / 32);
        const pRight = Math.floor((this.x + this.width - 4) / 32);
        const pTop = Math.floor((this.y + 6) / 32);
        const pBottom = Math.floor((this.y + this.height - 1) / 32);

        for (let tx = pLeft; tx <= pRight; tx++) {
            for (let ty = pTop; ty <= pBottom; ty++) {
                if (level.getTile(tx, ty) === 5) {
                    this.die(particles, 'spike');
                    return;
                }
            }
        }

        // Check Water / Void Hazard (Tile 4)
        const footTileX = Math.floor((this.x + this.width / 2) / 32);
        const footTileY = Math.floor((this.y + this.height - 2) / 32);
        const tileBelow = level.getTile(footTileX, footTileY);

        if (tileBelow === 4 || this.y > 320) {
            this.die(particles, 'water');
        }
    }

    die(particles, reason = 'water') {
        if (this.isDead) return;
        this.isDead = true;
        this.respawnTimer = 45;
        if (window.sounds) {
            if (reason === 'water') {
                window.sounds.playSplash();
            }
            window.sounds.playHurt();
        }
        if (reason === 'water') {
            particles.createSplash(this.x + this.width / 2, Math.min(this.y + this.height, 8 * 32 + 10));
        } else {
            particles.createDust(this.x + this.width / 2, this.y + this.height);
        }
        if (window.gameInstance) {
            window.gameInstance.loseLife();
        }
    }

    isSolid(tileType) {
        return tileType === 1 || tileType === 2 || tileType === 3;
    }

    resolveTileCollision(level, axis, particles) {
        const tileSize = 32;
        const left = Math.floor(this.x / tileSize);
        const right = Math.floor((this.x + this.width - 0.1) / tileSize);
        const top = Math.floor(this.y / tileSize);
        const bottom = Math.floor((this.y + this.height - 0.1) / tileSize);

        for (let tx = left; tx <= right; tx++) {
            for (let ty = top; ty <= bottom; ty++) {
                const tile = level.getTile(tx, ty);
                if (this.isSolid(tile)) {
                    if (axis === 'x') {
                        if (this.vx > 0) { // moving right
                            this.x = tx * tileSize - this.width;
                            this.vx = 0;
                        } else if (this.vx < 0) { // moving left
                            this.x = (tx + 1) * tileSize;
                            this.vx = 0;
                        }
                    } else if (axis === 'y') {
                        if (this.vy > 0) { // landing on ground
                            this.y = ty * tileSize - this.height;
                            if (!this.onGround && this.vy > 4) {
                                particles.createDust(this.x + this.width / 2, this.y + this.height);
                            }
                            this.vy = 0;
                            this.onGround = true;
                        } else if (this.vy < 0) { // hitting ceiling
                            this.y = (ty + 1) * tileSize;
                            this.vy = 0;
                        }
                    }
                }
            }
        }
    }

    draw(ctx, cameraX) {
        if (this.isDead) return;
        if (this.invulnerableTimer > 0 && Math.floor(this.invulnerableTimer / 4) % 2 === 0) {
            return; // flashing effect
        }

        ctx.save();
        const renderX = Math.floor(this.x - cameraX);
        const renderY = Math.floor(this.y - 4); // sprite height offset

        // Select sprite frame
        let sprite = Sprites.images.knightIdle;
        if (!this.onGround) {
            sprite = Sprites.images.knightJump;
        } else if (Math.abs(this.vx) > 0.3) {
            sprite = (this.walkFrame === 0) ? Sprites.images.knightWalk1 : Sprites.images.knightWalk2;
        }

        if (this.facing === -1) {
            ctx.translate(renderX + 26, renderY);
            ctx.scale(-1, 1);
            ctx.drawImage(sprite, 0, 0);
        } else {
            ctx.drawImage(sprite, renderX - 4, renderY);
        }
        ctx.restore();
    }
}

window.ParticleSystem = ParticleSystem;
window.Player = Player;
