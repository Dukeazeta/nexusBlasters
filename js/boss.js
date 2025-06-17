// Nexus Blasters - Boss Class

// Boss class - Epic boss encounters
class Boss extends Enemy {
    constructor(x, y, type = 'protocolTitan', wave = 5) {
        // Boss sizes are much larger than regular enemies - Significantly increased health for challenging encounters
        const bossConfig = {
            protocolTitan: { width: 120, height: 100, health: 3000, speed: 80 },
            consensusDestroyer: { width: 140, height: 120, health: 5000, speed: 60 },
            networkOverlord: { width: 160, height: 140, health: 8000, speed: 40 }
        };

        const config = bossConfig[type] || bossConfig.protocolTitan;

        // Apply progressive difficulty scaling based on wave
        const difficultyMultiplier = 1 + ((wave - 5) / 5) * 0.3; // 30% increase every 5 waves
        config.health = Math.floor(config.health * difficultyMultiplier);
        super(x, y, 'boss');

        // Override enemy properties with boss-specific values
        this.width = config.width;
        this.height = config.height;
        this.health = config.health;
        this.maxHealth = config.health;
        this.speed = config.speed;
        this.bossType = type;
        this.points = 5000; // Massive point reward

        // Boss-specific properties
        this.phase = 1;
        this.maxPhases = 3;
        this.phaseTransitionTimer = 0;
        this.isTransitioning = false;
        this.entranceTimer = 3000; // 3 second dramatic entrance
        this.hasEntered = false;

        // Attack patterns
        this.attackPattern = 'basic';
        this.attackTimer = 0;
        this.attackCooldown = 1000;
        this.burstCount = 0;
        this.maxBursts = 3;

        // Movement patterns
        this.movePattern = 'hover';
        this.hoverDirection = 1;
        this.targetX = x;
        this.originalY = y;

        // Visual effects
        this.glowIntensity = 0;
        this.warningFlash = false;
        this.warningTimer = 0;

        // Override firing properties with progressive scaling
        const baseFireRate = 500;
        this.shootCooldown = Math.max(200, baseFireRate - (wave - 5) * 20); // Faster firing with higher waves

        console.log(`Boss spawned: ${type} with ${this.health} HP (Wave ${wave} scaling applied)`);
    }

    update(deltaTime, playerX, playerY) {
        // Handle dramatic entrance
        if (!this.hasEntered) {
            this.updateEntrance(deltaTime);
            return;
        }

        // Handle phase transitions
        if (this.isTransitioning) {
            this.updatePhaseTransition(deltaTime);
            return;
        }

        // Check for phase change
        this.checkPhaseTransition();

        // Update movement
        this.updateBossMovement(deltaTime);

        // Update attack patterns
        this.updateBossAttacks(deltaTime, playerX, playerY);

        // Update visual effects
        this.updateBossEffects(deltaTime);

        // Update firing animation
        this.updateFiringAnimation(deltaTime);
    }

    updateEntrance(deltaTime) {
        this.entranceTimer -= deltaTime;

        // Slow descent during entrance
        this.y += this.speed * 0.3 * (deltaTime / 1000);

        // Warning flash effect
        this.warningTimer += deltaTime;
        this.warningFlash = Math.floor(this.warningTimer / 200) % 2 === 0;

        if (this.entranceTimer <= 0) {
            this.hasEntered = true;
            this.targetX = this.x;
            audioManager.playSound('bossEnter');
            effectsManager.bossEntered(this.x, this.y, this.bossType);
        }
    }

    updatePhaseTransition(deltaTime) {
        this.phaseTransitionTimer -= deltaTime;

        // Flash effect during transition
        this.warningTimer += deltaTime;
        this.warningFlash = Math.floor(this.warningTimer / 100) % 2 === 0;

        if (this.phaseTransitionTimer <= 0) {
            this.isTransitioning = false;
            this.phase++;
            this.updateAttackPattern();
            audioManager.playSound('bossPhaseChange');
            effectsManager.bossPhaseTransition(this.x, this.y, this.phase);
        }
    }

    checkPhaseTransition() {
        const healthPercent = this.health / this.maxHealth;
        const phaseThreshold = (this.maxPhases - this.phase + 1) / this.maxPhases;

        if (healthPercent <= phaseThreshold && this.phase < this.maxPhases && !this.isTransitioning) {
            this.isTransitioning = true;
            this.phaseTransitionTimer = 2000; // 2 second transition
            effectsManager.addScreenShake(15, 1000);
        }
    }

    updateBossMovement(deltaTime) {
        const dt = deltaTime / 1000;

        switch (this.movePattern) {
            case 'hover':
                // Gentle side-to-side movement
                this.moveTimer += deltaTime;
                const hoverSpeed = 50;
                this.targetX += this.hoverDirection * hoverSpeed * dt;

                // Bounce off screen edges
                if (this.targetX <= 100 || this.targetX >= 700) {
                    this.hoverDirection *= -1;
                }

                // Smooth movement toward target
                this.x += (this.targetX - this.x) * 2 * dt;
                break;

            case 'aggressive':
                // More erratic movement in later phases
                this.moveTimer += deltaTime;
                if (this.moveTimer >= 2000) {
                    this.targetX = Utils.randomFloat(100, 700);
                    this.moveTimer = 0;
                }
                this.x += (this.targetX - this.x) * 3 * dt;
                break;
        }
    }

    updateBossAttacks(deltaTime, playerX, playerY) {
        this.attackTimer += deltaTime;

        if (this.attackTimer >= this.attackCooldown) {
            this.executeAttackPattern(playerX, playerY);
            this.attackTimer = 0;
        }
    }

    executeAttackPattern(playerX, playerY) {
        switch (this.attackPattern) {
            case 'basic':
                this.basicAttack();
                break;
            case 'burst':
                this.burstAttack();
                break;
            case 'spread':
                this.spreadAttack();
                break;
            case 'laser':
                this.laserAttack(playerX);
                break;
        }
    }

    basicAttack() {
        // Single shot straight down
        if (window.gameState) {
            window.gameState.createEnemyBullet(this.x, this.y + this.height / 2, 0, GAME_CONFIG.BULLET.ENEMY_SPEED, 'boss');
            effectsManager.muzzleFlash(this.x, this.y + this.height / 2, 'boss');
        }
    }

    burstAttack() {
        // Three shots in quick succession
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                if (window.gameState && this.active) {
                    window.gameState.createEnemyBullet(this.x, this.y + this.height / 2, 0, GAME_CONFIG.BULLET.ENEMY_SPEED, 'boss');
                    effectsManager.muzzleFlash(this.x, this.y + this.height / 2, 'boss');
                }
            }, i * 200);
        }
    }

    spreadAttack() {
        // Five shots in a spread pattern
        const angles = [-0.5, -0.25, 0, 0.25, 0.5];
        for (const angle of angles) {
            if (window.gameState) {
                const speed = GAME_CONFIG.BULLET.ENEMY_SPEED;
                const vx = Math.sin(angle) * speed;
                const vy = Math.cos(angle) * speed;
                window.gameState.createEnemyBullet(this.x, this.y + this.height / 2, vx, vy, 'boss');
            }
        }
        effectsManager.muzzleFlash(this.x, this.y + this.height / 2, 'boss');
    }

    laserAttack(playerX) {
        // Aimed shot at player
        if (window.gameState) {
            const dx = playerX - this.x;
            const distance = Math.sqrt(dx * dx + 400 * 400); // Assume player is roughly 400px below
            const speed = GAME_CONFIG.BULLET.ENEMY_SPEED * 1.5;
            const vx = (dx / distance) * speed;
            const vy = (400 / distance) * speed;
            
            window.gameState.createEnemyBullet(this.x, this.y + this.height / 2, vx, vy, 'laser');
            effectsManager.muzzleFlash(this.x, this.y + this.height / 2, 'laser');
        }
    }

    updateAttackPattern() {
        // Change attack patterns based on phase
        switch (this.phase) {
            case 1:
                this.attackPattern = 'basic';
                this.attackCooldown = 1000;
                this.movePattern = 'hover';
                break;
            case 2:
                this.attackPattern = 'burst';
                this.attackCooldown = 1500;
                this.movePattern = 'hover';
                break;
            case 3:
                this.attackPattern = 'spread';
                this.attackCooldown = 2000;
                this.movePattern = 'aggressive';
                break;
        }
    }

    updateBossEffects(deltaTime) {
        // Update glow intensity
        this.glowIntensity = 0.5 + 0.3 * Math.sin(Date.now() * 0.005);

        // Create boss engine trail
        if (Math.random() < 0.8) {
            effectsManager.enemyEngineTrail(this.x, this.y, 'boss');
        }

        // Phase-specific effects
        if (this.phase >= 2 && Math.random() < 0.1) {
            effectsManager.createGlowParticle(this.x, this.y, '#ff8844', 1.5, 0.5);
        }
    }

    render(ctx) {
        // Get boss sprite based on type
        const spriteNames = {
            protocolTitan: 'bossProtocolTitan',
            consensusDestroyer: 'bossConsensusDestroyer',
            networkOverlord: 'bossNetworkOverlord'
        };

        const spriteName = spriteNames[this.bossType] || 'bossProtocolTitan';
        const sprite = assetManager.getSprite(spriteName);

        ctx.save();

        // Apply warning flash effect during entrance or phase transition
        if (this.warningFlash) {
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = '#ff4444';
            ctx.fillRect(this.x - this.width / 2 - 5, this.y - this.height / 2 - 5,
                        this.width + 10, this.height + 10);
        }

        // Apply glow effect
        ctx.globalAlpha = this.glowIntensity;

        if (sprite) {
            ctx.drawImage(sprite, this.x - this.width / 2, this.y - this.height / 2);
        } else {
            // Fallback rendering
            ctx.fillStyle = '#ff8844';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }

        ctx.restore();

        // Draw muzzle flash if firing
        if (this.isFiring) {
            this.renderMuzzleFlash(ctx);
        }

        // Always draw health bar for bosses
        this.renderBossHealthBar(ctx);

        // Draw phase indicator
        this.renderPhaseIndicator(ctx);
    }

    renderBossHealthBar(ctx) {
        const barWidth = this.width * 1.2;
        const barHeight = 8;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 20;

        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health
        const healthPercent = this.getHealthPercentage();
        ctx.fillStyle = healthPercent > 0.5 ? '#ff8844' : '#ff4444';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    renderPhaseIndicator(ctx) {
        const text = `PHASE ${this.phase}`;
        ctx.save();
        ctx.fillStyle = '#ffff44';
        ctx.font = 'bold 12px "Courier New", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, this.x, this.y - this.height / 2 - 35);
        ctx.restore();
    }

    isBoss() {
        return true;
    }
}
