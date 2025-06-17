// Nexus Blasters - Boss Management System
class BossSystem {
    constructor(gameState) {
        this.gameState = gameState;
        
        // Boss state tracking
        this.currentBoss = null;
        this.bossWarningTimer = 0;
        this.bossWarningDuration = 3000; // 3 second warning
        this.showingBossWarning = false;
    }

    update(deltaTime, canvasWidth) {
        // Check if it's time for a boss wave
        if (this.shouldSpawnBoss() && !this.currentBoss && !this.showingBossWarning) {
            this.startBossWarning();
        }

        // Handle boss warning countdown
        if (this.showingBossWarning) {
            this.updateBossWarning(deltaTime, canvasWidth);
        }

        // Update current boss status
        if (this.currentBoss) {
            this.updateCurrentBoss();
        }
    }

    shouldSpawnBoss() {
        // Boss waves: every 5 waves consistently (5, 10, 15, 20, 25, etc.)
        return this.gameState.wave % 5 === 0 && this.gameState.wave >= 5;
    }

    startBossWarning() {
        this.showingBossWarning = true;
        this.bossWarningTimer = 0;

        // Determine boss type based on wave
        const bossType = this.getBossTypeForWave(this.gameState.wave);

        // Clear existing enemies to make room for boss
        this.gameState.enemies = [];

        // Show warning effects
        effectsManager.bossWarning(bossType);
        uiAnimations.showBossWarning();
        audioManager.playSound('bossWarning');

        console.log(`Boss warning started for wave ${this.gameState.wave}: ${bossType}`);
    }

    updateBossWarning(deltaTime, canvasWidth) {
        this.bossWarningTimer += deltaTime;

        if (this.bossWarningTimer >= this.bossWarningDuration) {
            this.spawnBoss(canvasWidth);
            this.showingBossWarning = false;
            this.bossWarningTimer = 0;
        }
    }

    getBossTypeForWave(wave) {
        if (wave >= 25) return 'networkOverlord';
        if (wave >= 15) return 'consensusDestroyer';
        return 'protocolTitan';
    }

    spawnBoss(canvasWidth) {
        const bossType = this.getBossTypeForWave(this.gameState.wave);
        const x = canvasWidth / 2;
        const y = -100; // Start above screen

        // Pass wave number for difficulty scaling
        this.currentBoss = new Boss(x, y, bossType, this.gameState.wave);
        this.gameState.enemies.push(this.currentBoss);

        // Update gameState reference for compatibility
        this.gameState.currentBoss = this.currentBoss;

        // Stop regular enemy spawning during boss fight
        if (this.gameState.waveManager) {
            this.gameState.waveManager.enemySpawnTimer = 0;
        }

        console.log(`Boss spawned: ${bossType} for wave ${this.gameState.wave} with ${this.currentBoss.health} HP`);
    }

    updateCurrentBoss() {
        // Check if boss is still in the enemies array
        const bossStillExists = this.gameState.enemies.includes(this.currentBoss);
        if (!bossStillExists || !this.currentBoss.active) {
            // Only handle defeat if not already handled
            if (bossStillExists) {
                this.handleBossDefeated();
            }
        }
    }

    handleBossDefeated() {
        if (this.currentBoss) {
            // Award massive points based on boss type
            const bossPoints = this.getBossPoints(this.currentBoss.bossType);
            this.gameState.score += bossPoints;

            console.log(`Boss defeated: ${this.currentBoss.bossType}! Awarded ${bossPoints} points.`);

            // Spawn boss rewards
            this.spawnBossRewards();

            // Clear boss reference
            this.currentBoss = null;
            this.gameState.currentBoss = null;

            // Advance to next wave immediately and reset timer
            this.gameState.wave++;
            if (this.gameState.waveManager) {
                this.gameState.waveManager.waveTimer = 0;
                this.gameState.waveManager.enemySpawnTimer = 0;
                this.gameState.waveManager.updateEnemyFireRates();
            }

            // Show wave completion effect
            effectsManager.waveCompleted();
            audioManager.playSound('waveComplete');

            console.log(`Advanced to wave ${this.gameState.wave} - Normal gameplay resumed`);
        }
    }

    getBossPoints(bossType) {
        const bossPoints = {
            protocolTitan: 10000,
            consensusDestroyer: 15000,
            networkOverlord: 25000
        };
        return bossPoints[bossType] || 10000;
    }

    spawnBossRewards() {
        if (!this.currentBoss) return;

        // Spawn multiple power-ups as rewards
        const rewards = ['health', 'rapidFire', 'shield', 'speed'];

        for (let i = 0; i < rewards.length; i++) {
            const angle = (Math.PI * 2 * i) / rewards.length;
            const distance = 60;
            const x = this.currentBoss.x + Math.cos(angle) * distance;
            const y = this.currentBoss.y + Math.sin(angle) * distance;

            const powerUp = new PowerUp(x, y, rewards[i]);
            this.gameState.powerUps.push(powerUp);
        }
    }

    // Get current boss status
    getBossStatus() {
        if (!this.currentBoss) {
            return {
                active: false,
                warning: this.showingBossWarning,
                warningProgress: this.showingBossWarning ? this.bossWarningTimer / this.bossWarningDuration : 0
            };
        }

        return {
            active: true,
            type: this.currentBoss.bossType,
            health: this.currentBoss.health,
            maxHealth: this.currentBoss.maxHealth,
            healthPercent: this.currentBoss.getHealthPercentage(),
            phase: this.currentBoss.phase,
            maxPhases: this.currentBoss.maxPhases,
            warning: false,
            warningProgress: 0
        };
    }

    // Check if boss fight is active
    isBossFightActive() {
        return this.currentBoss !== null || this.showingBossWarning;
    }

    // Force spawn boss (for testing)
    forceSpawnBoss(canvasWidth, bossType = null) {
        if (this.currentBoss || this.showingBossWarning) return false;

        const type = bossType || this.getBossTypeForWave(this.gameState.wave);
        const x = canvasWidth / 2;
        const y = -100;

        this.currentBoss = new Boss(x, y, type, this.gameState.wave);
        this.gameState.enemies.push(this.currentBoss);
        this.gameState.currentBoss = this.currentBoss;

        console.log(`Force spawned boss: ${type}`);
        return true;
    }

    // Reset boss system
    reset() {
        this.currentBoss = null;
        this.bossWarningTimer = 0;
        this.showingBossWarning = false;
        this.gameState.currentBoss = null;
    }
}
