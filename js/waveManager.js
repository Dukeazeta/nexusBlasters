// Nexus Blasters - Wave Management System
class WaveManager {
    constructor(gameState) {
        this.gameState = gameState;
        
        // Wave progression timers
        this.waveTimer = 0;
        this.waveInterval = 30000; // 30 seconds per wave
        
        // Enemy spawning
        this.enemySpawnTimer = 0;
        this.enemySpawnRate = GAME_CONFIG.ENEMY.SPAWN_RATE;
        
        // Power-up spawning
        this.powerUpSpawnTimer = 0;
        this.powerUpSpawnRate = GAME_CONFIG.POWERUP.SPAWN_RATE;
    }

    update(deltaTime, canvasWidth) {
        // Update wave progression
        this.updateWaveProgression(deltaTime);
        
        // Handle enemy spawning (only if no boss active)
        if (!this.gameState.currentBoss && !this.gameState.showingBossWarning) {
            this.updateEnemySpawning(deltaTime, canvasWidth);
        }
        
        // Handle power-up spawning
        this.updatePowerUpSpawning(deltaTime, canvasWidth);
    }

    updateWaveProgression(deltaTime) {
        this.waveTimer += deltaTime;

        // New wave every 30 seconds (unless boss wave)
        if (this.waveTimer >= this.waveInterval && !this.shouldSpawnBoss()) {
            this.advanceWave();
        }
    }

    advanceWave() {
        audioManager.playSound('waveComplete');
        effectsManager.waveCompleted();
        uiAnimations.showWaveComplete(this.gameState.wave);
        uiAnimations.showWaveTransition(this.gameState.wave + 1);
        
        this.gameState.wave++;
        this.waveTimer = 0;

        // Update enemy fire rates for new wave
        this.updateEnemyFireRates();
        
        // Increase difficulty
        this.updateDifficulty();
        
        console.log(`Advanced to wave ${this.gameState.wave}`);
    }

    updateDifficulty() {
        // Increase spawn rate slightly each wave
        this.enemySpawnRate = Math.max(1000, GAME_CONFIG.ENEMY.SPAWN_RATE - (this.gameState.wave * 100));
        
        // Adjust power-up spawn rate (slightly less frequent as waves progress)
        this.powerUpSpawnRate = Math.min(20000, GAME_CONFIG.POWERUP.SPAWN_RATE + (this.gameState.wave * 500));
    }

    updateEnemySpawning(deltaTime, canvasWidth) {
        this.enemySpawnTimer += deltaTime;
        
        if (this.enemySpawnTimer >= this.enemySpawnRate) {
            this.spawnEnemy(canvasWidth);
            this.enemySpawnTimer = 0;
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
        
        // Determine enemy type based on wave progression
        const type = this.getEnemyTypeForWave();

        // Add spawn effect
        effectsManager.enemySpawned(x, y);

        const enemy = new Enemy(x, y, type);
        this.gameState.enemies.push(enemy);
    }

    getEnemyTypeForWave() {
        // Progressive enemy type distribution
        const wave = this.gameState.wave;
        const rand = Math.random();
        
        if (wave <= 3) {
            // Early waves: mostly scouts
            return rand < 0.9 ? 'scout' : 'fighter';
        } else if (wave <= 10) {
            // Mid waves: balanced mix
            return rand < 0.7 ? 'scout' : 'fighter';
        } else {
            // Late waves: more fighters
            return rand < 0.5 ? 'scout' : 'fighter';
        }
    }

    spawnPowerUp(canvasWidth) {
        const x = Utils.randomFloat(50, canvasWidth - 50);
        const y = -20;

        // Weighted power-up distribution based on wave
        const type = this.getPowerUpTypeForWave();

        const powerUp = new PowerUp(x, y, type);
        this.gameState.powerUps.push(powerUp);
    }

    getPowerUpTypeForWave() {
        const wave = this.gameState.wave;
        const rand = Math.random();
        
        // Adjust power-up distribution based on wave progression
        if (wave <= 5) {
            // Early waves: focus on health and basic upgrades
            if (rand < 0.5) return 'health';      // 50% chance
            if (rand < 0.75) return 'speed';      // 25% chance
            if (rand < 0.9) return 'rapidFire';   // 15% chance
            return 'shield';                      // 10% chance
        } else if (wave <= 15) {
            // Mid waves: balanced distribution
            if (rand < 0.4) return 'health';      // 40% chance
            if (rand < 0.65) return 'speed';      // 25% chance
            if (rand < 0.85) return 'rapidFire';  // 20% chance
            return 'shield';                      // 15% chance
        } else {
            // Late waves: more defensive power-ups
            if (rand < 0.35) return 'health';     // 35% chance
            if (rand < 0.55) return 'speed';      // 20% chance
            if (rand < 0.75) return 'rapidFire';  // 20% chance
            return 'shield';                      // 25% chance
        }
    }

    shouldSpawnBoss() {
        // Boss waves: every 5 waves consistently (5, 10, 15, 20, 25, etc.)
        return this.gameState.wave % 5 === 0 && this.gameState.wave >= 5;
    }

    updateEnemyFireRates() {
        // Update fire rates for all existing enemies
        this.gameState.enemies.forEach(enemy => {
            if (enemy.getFireRate) {
                enemy.shootCooldown = enemy.getFireRate();
            }
        });
    }

    // Reset timers when game starts
    reset() {
        this.waveTimer = 0;
        this.enemySpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.enemySpawnRate = GAME_CONFIG.ENEMY.SPAWN_RATE;
        this.powerUpSpawnRate = GAME_CONFIG.POWERUP.SPAWN_RATE;
    }

    // Get current wave statistics
    getWaveStats() {
        return {
            currentWave: this.gameState.wave,
            timeToNextWave: Math.max(0, this.waveInterval - this.waveTimer),
            enemySpawnRate: this.enemySpawnRate,
            powerUpSpawnRate: this.powerUpSpawnRate,
            isBossWave: this.shouldSpawnBoss()
        };
    }

    // Force advance to next wave (for testing or special events)
    forceAdvanceWave() {
        this.waveTimer = this.waveInterval;
        this.updateWaveProgression(0);
    }
}
