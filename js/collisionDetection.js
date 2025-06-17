// Nexus Blasters - Collision Detection System
class CollisionDetection {
    constructor(gameState) {
        this.gameState = gameState;
    }

    checkAllCollisions() {
        if (!this.gameState.player) return;
        
        const playerBounds = this.gameState.player.getBounds();
        
        // Check all collision types
        this.checkPlayerVsEnemies(playerBounds);
        this.checkPlayerVsEnemyBullets(playerBounds);
        this.checkPlayerBulletsVsEnemies();
        this.checkPlayerVsPowerUps(playerBounds);
    }

    checkPlayerVsEnemies(playerBounds) {
        for (let i = this.gameState.enemies.length - 1; i >= 0; i--) {
            const enemy = this.gameState.enemies[i];
            const enemyBounds = enemy.getBounds();

            if (Utils.rectCollision(playerBounds, enemyBounds)) {
                const damageTaken = this.gameState.player.takeDamage(1); // Take 1 heart of damage
                if (damageTaken) {
                    this.gameState.playerTookDamage(); // Reset combo
                    audioManager.playSound('playerHit');
                    effectsManager.playerHit(this.gameState.player.x, this.gameState.player.y);
                }
                audioManager.playSound('enemyDestroy');
                effectsManager.enemyDestroyed(enemy.x, enemy.y, enemy.type);
                this.gameState.createExplosion(enemy.x, enemy.y);
                this.gameState.enemies.splice(i, 1);
                break;
            }
        }
    }

    checkPlayerVsEnemyBullets(playerBounds) {
        for (let i = this.gameState.bullets.length - 1; i >= 0; i--) {
            const bullet = this.gameState.bullets[i];
            if (bullet.type !== 'enemy') continue;

            const bulletBounds = bullet.getBounds();

            if (Utils.rectCollision(playerBounds, bulletBounds)) {
                const damageTaken = this.gameState.player.takeDamage(1); // Take 1 heart of damage
                if (damageTaken) {
                    this.gameState.playerTookDamage(); // Reset combo
                    audioManager.playSound('playerHit');
                    effectsManager.playerHit(this.gameState.player.x, this.gameState.player.y);
                }
                this.gameState.createExplosion(bullet.x, bullet.y);
                this.gameState.bullets.splice(i, 1);
                break;
            }
        }
    }

    checkPlayerBulletsVsEnemies() {
        for (let i = this.gameState.bullets.length - 1; i >= 0; i--) {
            const bullet = this.gameState.bullets[i];
            if (bullet.type !== 'player') continue;
            
            const bulletBounds = bullet.getBounds();
            
            for (let j = this.gameState.enemies.length - 1; j >= 0; j--) {
                const enemy = this.gameState.enemies[j];
                const enemyBounds = enemy.getBounds();
                
                if (Utils.rectCollision(bulletBounds, enemyBounds)) {
                    // Handle bullet hit enemy
                    this.handleBulletHitEnemy(bullet, enemy, i, j);
                    break;
                }
            }
        }
    }

    handleBulletHitEnemy(bullet, enemy, bulletIndex, enemyIndex) {
        // Reduce damage against bosses for balanced encounters
        let actualDamage = bullet.damage;
        if (enemy.isBoss && enemy.isBoss()) {
            actualDamage = Math.floor(bullet.damage * 0.4); // 60% damage reduction against bosses
        }

        if (enemy.takeDamage(actualDamage)) {
            // Enemy was killed
            this.handleEnemyKilled(enemy, actualDamage);
            this.gameState.enemies.splice(enemyIndex, 1);
        } else {
            // Enemy was damaged but not killed
            effectsManager.addDamageNumber(enemy.x, enemy.y, actualDamage, false);
            
            // Special effects for boss hits
            if (enemy.isBoss && enemy.isBoss()) {
                effectsManager.bossHit(enemy.x, enemy.y);
            }
        }
        
        this.gameState.bullets.splice(bulletIndex, 1);
    }

    handleEnemyKilled(enemy, damage) {
        // Award points with combo multiplier
        const basePoints = enemy.points;
        const bonusPoints = Math.floor(basePoints * (this.gameState.comboMultiplier - 1));
        const totalPoints = basePoints + bonusPoints;
        this.gameState.score += totalPoints;
        this.gameState.kills++;

        // Add combo and show damage number
        this.gameState.addCombo();
        effectsManager.addDamageNumber(enemy.x, enemy.y, damage, false);

        // Check achievements
        if (!this.gameState.achievements.firstKill) {
            this.gameState.unlockAchievement('firstKill', 'FIRST BLOOD', 'Destroy your first enemy');
        }
        if (enemy.isBoss && enemy.isBoss()) {
            this.gameState.unlockAchievement('bossKiller', 'BOSS SLAYER', 'Defeat a boss enemy');
            // Handle boss defeat immediately to prevent crashes
            this.gameState.bossSystem.handleBossDefeated();
        }

        // Effects and audio
        audioManager.playSound('enemyDestroy');
        effectsManager.enemyDestroyed(enemy.x, enemy.y, enemy.type);
        effectsManager.scoreGained(enemy.x, enemy.y, totalPoints);
        this.gameState.createExplosion(enemy.x, enemy.y);
    }

    checkPlayerVsPowerUps(playerBounds) {
        for (let i = this.gameState.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.gameState.powerUps[i];
            const powerUpBounds = powerUp.getBounds();
            
            if (Utils.rectCollision(playerBounds, powerUpBounds)) {
                effectsManager.powerUpCollected(powerUp.x, powerUp.y, powerUp.type);
                uiAnimations.showPowerUpCollected(powerUp.type);
                powerUp.applyEffect(this.gameState.player);
                this.gameState.powerUps.splice(i, 1);
            }
        }
    }
}
