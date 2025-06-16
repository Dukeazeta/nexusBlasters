// Nexus Blasters - Game State Management
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
        
        // Timers
        this.enemySpawnTimer = 0;
        this.enemySpawnRate = GAME_CONFIG.ENEMY.SPAWN_RATE;
        this.waveTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.powerUpSpawnRate = GAME_CONFIG.POWERUP.SPAWN_RATE;

        // Boss system
        this.currentBoss = null;
        this.bossWarningTimer = 0;
        this.bossWarningDuration = 3000; // 3 second warning
        this.showingBossWarning = false;

        // Combo system
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.comboTimeout = 3000; // 3 seconds to maintain combo
        this.comboMultiplier = 1.0;

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
        
        // Reset timers
        this.enemySpawnTimer = 0;
        this.waveTimer = 0;
        this.powerUpSpawnTimer = 0;

        // Reset boss system
        this.currentBoss = null;
        this.bossWarningTimer = 0;
        this.showingBossWarning = false;
    }
    
    update(deltaTime, inputManager, canvasWidth, canvasHeight) {
        if (this.state !== 'playing') return;
        
        // Handle pause input
        if (inputManager.isPausePressed()) {
            this.pauseGame();
            return;
        }
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime, inputManager, canvasWidth, canvasHeight);
            
            // Check if player is dead
            if (this.player.isDead()) {
                this.gameOver();
                return;
            }
        }
        
        // Handle boss system
        this.updateBossSystem(deltaTime, canvasWidth);

        // Spawn enemies (only if no boss active)
        if (!this.currentBoss && !this.showingBossWarning) {
            this.updateEnemySpawning(deltaTime, canvasWidth);
        }

        // Spawn power-ups
        this.updatePowerUpSpawning(deltaTime, canvasWidth);
        
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
        this.checkCollisions();

        // Update wave progression
        this.updateWaveProgression(deltaTime);
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

        // Show combo effect with enhanced visuals
        if (this.combo >= 5) {
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
            effectsManager.particles.push({
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
    
    updateEnemySpawning(deltaTime, canvasWidth) {
        this.enemySpawnTimer += deltaTime;
        
        if (this.enemySpawnTimer >= this.enemySpawnRate) {
            this.spawnEnemy(canvasWidth);
            this.enemySpawnTimer = 0;
            
            // Increase spawn rate slightly each wave
            this.enemySpawnRate = Math.max(1000, GAME_CONFIG.ENEMY.SPAWN_RATE - (this.wave * 100));
        }
    }
    
    updatePowerUpSpawning(deltaTime, canvasWidth) {
        this.powerUpSpawnTimer += deltaTime;
        
        if (this.powerUpSpawnTimer >= this.powerUpSpawnRate) {
            this.spawnPowerUp(canvasWidth);
            this.powerUpSpawnTimer = 0;
        }
    }
    
    spawnEnemy(canvasWidth) {
        const x = Utils.randomFloat(50, canvasWidth - 50);
        const y = -50;
        const type = Math.random() < 0.7 ? 'scout' : 'fighter';

        // Add spawn effect
        effectsManager.enemySpawned(x, y);

        this.enemies.push(new Enemy(x, y, type));
    }
    
    spawnPowerUp(canvasWidth) {
        const x = Utils.randomFloat(50, canvasWidth - 50);
        const y = -20;

        // Weighted power-up distribution
        const rand = Math.random();
        let type;
        if (rand < 0.4) {
            type = 'health';      // 40% chance
        } else if (rand < 0.65) {
            type = 'speed';       // 25% chance
        } else if (rand < 0.85) {
            type = 'rapidFire';   // 20% chance
        } else {
            type = 'shield';      // 15% chance
        }

        this.powerUps.push(new PowerUp(x, y, type));
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
    
    checkCollisions() {
        if (!this.player) return;
        
        const playerBounds = this.player.getBounds();
        
        // Player vs Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const enemyBounds = enemy.getBounds();

            if (Utils.rectCollision(playerBounds, enemyBounds)) {
                const damageTaken = this.player.takeDamage(1); // Take 1 heart of damage
                if (damageTaken) {
                    this.playerTookDamage(); // Reset combo
                    audioManager.playSound('playerHit');
                    effectsManager.playerHit(this.player.x, this.player.y);
                }
                audioManager.playSound('enemyDestroy');
                effectsManager.enemyDestroyed(enemy.x, enemy.y, enemy.type);
                this.createExplosion(enemy.x, enemy.y);
                this.enemies.splice(i, 1);
                break;
            }
        }

        // Player vs Enemy Bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.type !== 'enemy') continue;

            const bulletBounds = bullet.getBounds();

            if (Utils.rectCollision(playerBounds, bulletBounds)) {
                const damageTaken = this.player.takeDamage(1); // Take 1 heart of damage
                if (damageTaken) {
                    this.playerTookDamage(); // Reset combo
                    audioManager.playSound('playerHit');
                    effectsManager.playerHit(this.player.x, this.player.y);
                }
                this.createExplosion(bullet.x, bullet.y);
                this.bullets.splice(i, 1);
                break;
            }
        }
        
        // Player Bullets vs Enemies
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.type !== 'player') continue;
            
            const bulletBounds = bullet.getBounds();
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const enemyBounds = enemy.getBounds();
                
                if (Utils.rectCollision(bulletBounds, enemyBounds)) {
                    // Reduce damage against bosses for balanced encounters
                    let actualDamage = bullet.damage;
                    if (enemy.isBoss && enemy.isBoss()) {
                        actualDamage = Math.floor(bullet.damage * 0.4); // 60% damage reduction against bosses
                    }

                    if (enemy.takeDamage(actualDamage)) {
                        // Award points with combo multiplier
                        const basePoints = enemy.points;
                        const bonusPoints = Math.floor(basePoints * (this.comboMultiplier - 1));
                        const totalPoints = basePoints + bonusPoints;
                        this.score += totalPoints;
                        this.kills++;

                        // Add combo and show damage number
                        this.addCombo();
                        effectsManager.addDamageNumber(enemy.x, enemy.y, actualDamage, false);

                        // Check achievements
                        if (!this.achievements.firstKill) {
                            this.unlockAchievement('firstKill', 'FIRST BLOOD', 'Destroy your first enemy');
                        }
                        if (enemy.isBoss && enemy.isBoss()) {
                            this.unlockAchievement('bossKiller', 'BOSS SLAYER', 'Defeat a boss enemy');
                            // Handle boss defeat immediately to prevent crashes
                            this.handleBossDefeated();
                        }

                        audioManager.playSound('enemyDestroy');
                        effectsManager.enemyDestroyed(enemy.x, enemy.y, enemy.type);
                        effectsManager.scoreGained(enemy.x, enemy.y, totalPoints);
                        this.createExplosion(enemy.x, enemy.y);
                        this.enemies.splice(j, 1);
                    }
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }
        
        // Player vs Power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            const powerUpBounds = powerUp.getBounds();
            
            if (Utils.rectCollision(playerBounds, powerUpBounds)) {
                effectsManager.powerUpCollected(powerUp.x, powerUp.y, powerUp.type);
                uiAnimations.showPowerUpCollected(powerUp.type);
                powerUp.applyEffect(this.player);
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    updateBossSystem(deltaTime, canvasWidth) {
        // Check if it's time for a boss wave
        if (this.shouldSpawnBoss() && !this.currentBoss && !this.showingBossWarning) {
            this.startBossWarning();
        }

        // Handle boss warning countdown
        if (this.showingBossWarning) {
            this.bossWarningTimer += deltaTime;

            if (this.bossWarningTimer >= this.bossWarningDuration) {
                this.spawnBoss(canvasWidth);
                this.showingBossWarning = false;
                this.bossWarningTimer = 0;
            }
        }

        // Update current boss (check if boss still exists in enemies array)
        if (this.currentBoss) {
            // Check if boss is still in the enemies array
            const bossStillExists = this.enemies.includes(this.currentBoss);
            if (!bossStillExists || !this.currentBoss.active) {
                // Only handle defeat if not already handled
                if (bossStillExists) {
                    this.handleBossDefeated();
                }
            }
        }
    }

    shouldSpawnBoss() {
        // Boss waves: every 5 waves consistently (5, 10, 15, 20, 25, etc.)
        return this.wave % 5 === 0 && this.wave >= 5;
    }

    startBossWarning() {
        this.showingBossWarning = true;
        this.bossWarningTimer = 0;

        // Determine boss type based on wave
        const bossType = this.getBossTypeForWave(this.wave);

        // Clear existing enemies to make room for boss
        this.enemies = [];

        // Show warning effects
        effectsManager.bossWarning(bossType);
        uiAnimations.showBossWarning();
        audioManager.playSound('bossWarning');

        console.log(`Boss warning started for wave ${this.wave}: ${bossType}`);
    }

    getBossTypeForWave(wave) {
        if (wave >= 25) return 'networkOverlord';
        if (wave >= 15) return 'consensusDestroyer';
        return 'protocolTitan';
    }

    spawnBoss(canvasWidth) {
        const bossType = this.getBossTypeForWave(this.wave);
        const x = canvasWidth / 2;
        const y = -100; // Start above screen

        // Pass wave number for difficulty scaling
        this.currentBoss = new Boss(x, y, bossType, this.wave);
        this.enemies.push(this.currentBoss);

        // Stop regular enemy spawning during boss fight
        this.enemySpawnTimer = 0;

        console.log(`Boss spawned: ${bossType} for wave ${this.wave} with ${this.currentBoss.health} HP`);
    }

    handleBossDefeated() {
        if (this.currentBoss) {
            // Award massive points based on boss type
            const bossPoints = {
                protocolTitan: 10000,
                consensusDestroyer: 15000,
                networkOverlord: 25000
            };
            const points = bossPoints[this.currentBoss.bossType] || 10000;
            this.score += points;

            console.log(`Boss defeated: ${this.currentBoss.bossType}! Awarded ${points} points.`);

            // Clear boss reference
            this.currentBoss = null;

            // Advance to next wave immediately and reset timer
            this.wave++;
            this.waveTimer = 0;

            // Resume normal enemy spawning
            this.enemySpawnTimer = 0;

            // Update enemy fire rates for new wave
            this.updateEnemyFireRates();

            // Show wave completion effect
            effectsManager.waveCompleted();
            audioManager.playSound('waveComplete');

            console.log(`Advanced to wave ${this.wave} - Normal gameplay resumed`);
        }
    }

    updateWaveProgression(deltaTime) {
        this.waveTimer += deltaTime;

        // New wave every 30 seconds (unless boss wave)
        if (this.waveTimer >= 30000 && !this.shouldSpawnBoss()) {
            audioManager.playSound('waveComplete');
            effectsManager.waveCompleted();
            uiAnimations.showWaveComplete(this.wave);
            uiAnimations.showWaveTransition(this.wave + 1);
            this.wave++;
            this.waveTimer = 0;

            // Update enemy fire rates for new wave
            this.updateEnemyFireRates();
        }
    }

    updateEnemyFireRates() {
        // Update fire rates for all existing enemies
        this.enemies.forEach(enemy => {
            enemy.shootCooldown = enemy.getFireRate();
        });
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
    }
    
    resumeGame() {
        this.state = 'playing';
    }
    
    gameOver() {
        this.state = 'gameOver';
    }
    
    showMainMenu() {
        this.state = 'menu';
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
