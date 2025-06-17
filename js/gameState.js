// Nexus Blasters - Game State Management (Modular)
class GameState {
    constructor() {
        this.state = 'loading'; // loading, menu, playing, paused, gameOver
        this.score = 0;
        this.wave = 1;
        this.kills = 0;

        // Game objects
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.particles = [];

        // Combo system
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.comboTimeout = 3000; // 3 seconds to maintain combo
        this.comboMultiplier = 1.0;

        // Boss defeat tracking for progressive rapid fire upgrades
        this.bossesDefeated = 0;

        // Achievement system
        this.achievements = {
            firstKill: false,
            combo10: false,
            combo25: false,
            combo50: false,
            bossKiller: false,
            survivor: false,
            powerCollector: false
        };
        this.achievementQueue = [];

        // Initialize subsystems
        this.collisionDetection = new CollisionDetection(this);
        this.waveManager = new WaveManager(this);
        this.bossSystem = new BossSystem(this);

        // Legacy compatibility properties
        this.currentBoss = null;
        this.showingBossWarning = false;

        // Make this globally accessible for other classes
        window.gameState = this;
    }
    
    startGame(canvasWidth, canvasHeight) {
        this.state = 'playing';
        this.score = 0;
        this.wave = 1;
        this.kills = 0;

        // Initialize player
        this.player = new Player(canvasWidth / 2, canvasHeight - 80);

        // Clear arrays
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.particles = [];

        // Reset subsystems
        this.waveManager.reset();
        this.bossSystem.reset();

        // Reset combo system
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.comboMultiplier = 1.0;

        // Reset boss defeat tracking
        this.bossesDefeated = 0;
    }
    
    update(deltaTime, inputManager, canvasWidth, canvasHeight) {
        // Handle pause input (works in both playing and paused states)
        if (inputManager.isPausePressed()) {
            if (this.state === 'playing') {
                this.pauseGame();
                return;
            } else if (this.state === 'paused') {
                this.resumeGame();
                return;
            }
        }

        // Only update game logic when playing
        if (this.state !== 'playing') return;

        // Update player
        if (this.player) {
            this.player.update(deltaTime, inputManager, canvasWidth, canvasHeight);

            // Check if player is dead
            if (this.player.isDead()) {
                this.gameOver();
                return;
            }
        }

        // Update subsystems
        this.bossSystem.update(deltaTime, canvasWidth);
        this.waveManager.update(deltaTime, canvasWidth);

        // Update legacy compatibility properties
        this.currentBoss = this.bossSystem.currentBoss;
        this.showingBossWarning = this.bossSystem.showingBossWarning;
        this.bossWarningTimer = this.bossSystem.bossWarningTimer;
        this.bossWarningDuration = this.bossSystem.bossWarningDuration;

        // Update game objects
        this.updateEnemies(deltaTime);
        this.updateBullets(deltaTime, canvasWidth, canvasHeight);
        this.updatePowerUps(deltaTime, canvasHeight);
        this.updateParticles(deltaTime);

        // Update visual effects
        effectsManager.update(deltaTime);

        // Update combo system
        this.updateComboSystem(deltaTime);

        // Update achievements
        this.updateAchievements(deltaTime);

        // Check collisions
        this.collisionDetection.checkAllCollisions();
    }

    // ===== COMBO SYSTEM =====

    updateComboSystem(deltaTime) {
        if (this.combo > 0) {
            this.comboTimer += deltaTime;

            if (this.comboTimer >= this.comboTimeout) {
                this.resetCombo();
            }
        }

        // Update combo multiplier
        this.comboMultiplier = 1.0 + (this.combo * 0.1); // 10% bonus per combo
    }

    addCombo() {
        this.combo++;
        this.comboTimer = 0;

        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }

        // Show combo effect with enhanced visuals (only if player exists)
        if (this.combo >= 5 && this.player) {
            if (this.combo % 5 === 0 && this.combo >= 10) {
                // Use new combo effect for milestone combos
                effectsManager.addComboEffect(this.player.x, this.player.y, this.combo);
            } else {
                // Use floating text for smaller combos
                effectsManager.addFloatingText(
                    this.player.x,
                    this.player.y - 40,
                    `${this.combo}x COMBO!`,
                    GAME_CONFIG.COLORS.PROOF_GOLD,
                    16
                );
            }
        }

        // Check combo achievements
        this.checkComboAchievements();
    }

    resetCombo() {
        if (this.combo >= 10) {
            effectsManager.addFloatingText(
                400,
                300,
                'COMBO BROKEN!',
                GAME_CONFIG.COLORS.THREAT_RED,
                20
            );
        }

        this.combo = 0;
        this.comboTimer = 0;
        this.comboMultiplier = 1.0;
    }

    playerTookDamage() {
        this.resetCombo();
    }

    // ===== ACHIEVEMENT SYSTEM =====

    updateAchievements(deltaTime) {
        // Process achievement queue
        if (this.achievementQueue.length > 0) {
            const achievement = this.achievementQueue.shift();
            this.showAchievement(achievement);
        }
    }

    checkComboAchievements() {
        if (this.combo === 10 && !this.achievements.combo10) {
            this.unlockAchievement('combo10', 'COMBO MASTER', 'Achieve 10x combo');
        }
        if (this.combo === 25 && !this.achievements.combo25) {
            this.unlockAchievement('combo25', 'COMBO EXPERT', 'Achieve 25x combo');
        }
        if (this.combo === 50 && !this.achievements.combo50) {
            this.unlockAchievement('combo50', 'COMBO LEGEND', 'Achieve 50x combo');
        }
    }

    unlockAchievement(id, title, description) {
        if (!this.achievements[id]) {
            this.achievements[id] = true;
            this.achievementQueue.push({ id, title, description });
            console.log(`Achievement unlocked: ${title}`);
        }
    }

    showAchievement(achievement) {
        // Show achievement notification with enhanced UI
        uiAnimations.showAchievement(achievement.title, achievement.description);

        // Show achievement notification
        effectsManager.addFloatingText(
            400,
            200,
            `🏆 ${achievement.title}`,
            GAME_CONFIG.COLORS.PROOF_GOLD,
            24
        );

        effectsManager.addFloatingText(
            400,
            230,
            achievement.description,
            GAME_CONFIG.COLORS.NEXUS_GLOW,
            14
        );

        // Achievement particles
        for (let i = 0; i < 20; i++) {
            const angle = (Math.PI * 2 * i) / 20;
            const speed = 100;
            effectsManager.particleSystem.particles.push({
                x: 400,
                y: 215,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3,
                maxSize: 3,
                life: 1.5,
                maxLife: 1.5,
                color: GAME_CONFIG.COLORS.PROOF_GOLD,
                type: 'celebration',
                gravity: -20,
                friction: 0.95
            });
        }
    }
    

    
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (!enemy.active) {
                this.enemies.splice(i, 1);
                continue;
            }
            
            enemy.update(deltaTime, this.player?.x || 0, this.player?.y || 0);
            
            // Remove enemies that are off screen
            if (enemy.y > window.innerHeight + 100) {
                this.enemies.splice(i, 1);
            }
        }
    }
    
    updateBullets(deltaTime, canvasWidth, canvasHeight) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            if (!bullet.active) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            bullet.update(deltaTime);
            
            // Remove bullets that are off screen
            if (bullet.isOffScreen(canvasWidth, canvasHeight)) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updatePowerUps(deltaTime, canvasHeight) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (!powerUp.active) {
                this.powerUps.splice(i, 1);
                continue;
            }
            
            powerUp.update(deltaTime);
            
            // Remove power-ups that are off screen
            if (powerUp.y > canvasHeight + 50) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            if (!particle.active) {
                this.particles.splice(i, 1);
                continue;
            }
            
            particle.update(deltaTime);
        }
    }
    

    

    
    createPlayerBullet(x, y, bulletType = 'normal') {
        const bullet = new Bullet(x, y, 0, -GAME_CONFIG.BULLET.PLAYER_SPEED, 'player', bulletType);
        this.bullets.push(bullet);
    }

    createEnemyBullet(x, y, velocityX, velocityY, bulletType = 'normal') {
        const bullet = new Bullet(x, y, velocityX, velocityY, 'enemy', bulletType);
        this.bullets.push(bullet);
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            const velocityX = Utils.randomFloat(-100, 100);
            const velocityY = Utils.randomFloat(-100, 100);
            const particle = new Particle(x, y, velocityX, velocityY, 'explosion');
            this.particles.push(particle);
        }
    }
    
    pauseGame() {
        this.state = 'paused';
        // Show pause screen
        document.getElementById('pauseScreen').classList.remove('hidden');
    }

    resumeGame() {
        this.state = 'playing';
        // Hide pause screen
        document.getElementById('pauseScreen').classList.add('hidden');
    }
    
    gameOver() {
        this.state = 'gameOver';
    }
    
    showMainMenu() {
        this.state = 'menu';
    }

    // Delegate method for boss type determination (for UI compatibility)
    getBossTypeForWave(wave) {
        return this.bossSystem.getBossTypeForWave(wave);
    }

    // Boss defeat tracking for progressive rapid fire upgrades
    incrementBossDefeats() {
        this.bossesDefeated++;
        console.log(`Boss defeated! Total bosses defeated this session: ${this.bossesDefeated}`);
    }

    getBossesDefeated() {
        return this.bossesDefeated;
    }
    
    render(ctx) {
        // Render all game objects
        if (this.player) {
            this.player.render(ctx);
        }
        
        this.enemies.forEach(enemy => enemy.render(ctx));
        this.bullets.forEach(bullet => bullet.render(ctx));
        this.powerUps.forEach(powerUp => powerUp.render(ctx));
        this.particles.forEach(particle => particle.render(ctx));
    }
}
