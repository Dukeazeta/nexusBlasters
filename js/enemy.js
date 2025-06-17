// Nexus Blasters - Enemy Class

// Enemy class
class Enemy extends GameObject {
    constructor(x, y, type = 'scout') {
        // Updated sizes: scout 36x36, fighter 48x42
        const width = type === 'scout' ? 36 : 48;
        const height = type === 'scout' ? 36 : 42;
        super(x, y, width, height);
        this.type = type;
        this.health = type === 'scout' ? 50 : 100;
        this.maxHealth = this.health;
        this.speed = type === 'scout' ? GAME_CONFIG.ENEMY.SCOUT_SPEED : GAME_CONFIG.ENEMY.FIGHTER_SPEED;
        this.shootTimer = 0;
        this.shootCooldown = this.getFireRate();
        this.points = type === 'scout' ? 100 : 250;
        
        // Movement pattern
        this.movePattern = type === 'scout' ? 'straight' : 'weave';
        this.moveTimer = 0;
        this.moveDirection = 1;

        // Firing animation
        this.muzzleFlashTimer = 0;
        this.muzzleFlashDuration = 80;
        this.isFiring = false;
    }

    getFireRate() {
        // Progressive firing speed: base 2000ms, decrease 100ms per wave, minimum 500ms
        const currentWave = window.gameState ? window.gameState.wave : 1;
        const baseRate = 2000;
        const rateDecrease = 100;
        const minimumRate = 500;

        return Math.max(minimumRate, baseRate - (currentWave - 1) * rateDecrease);
    }
    
    update(deltaTime, playerX, playerY) {
        this.updateMovement(deltaTime);
        this.updateShooting(deltaTime, playerX, playerY);
        this.updateFiringAnimation(deltaTime);
        this.updateEnemyEffects(deltaTime);
    }
    
    updateMovement(deltaTime) {
        const moveSpeed = this.speed * (deltaTime / 1000);

        if (this.movePattern === 'straight') {
            // Simple downward movement
            this.y += moveSpeed;
        } else if (this.movePattern === 'weave') {
            // Weaving movement
            this.y += moveSpeed * 0.7;
            this.moveTimer += deltaTime;

            if (this.moveTimer > 1000) {
                this.moveDirection *= -1;
                this.moveTimer = 0;
            }

            this.x += this.moveDirection * moveSpeed * 0.5;
        }
    }

    updateFiringAnimation(deltaTime) {
        // Update muzzle flash animation
        if (this.isFiring) {
            this.muzzleFlashTimer += deltaTime;

            if (this.muzzleFlashTimer >= this.muzzleFlashDuration) {
                this.isFiring = false;
                this.muzzleFlashTimer = 0;
            }
        }
    }
    
    updateShooting(deltaTime, playerX, playerY) {
        this.shootTimer += deltaTime;
        
        if (this.shootTimer >= this.shootCooldown) {
            this.shoot(playerX, playerY);
            this.shootTimer = 0;
        }
    }
    
    shoot(playerX, playerY) {
        // Trigger muzzle flash animation
        this.isFiring = true;
        this.muzzleFlashTimer = 0;

        // Play enemy weapon sound
        if (this.type === 'fighter') {
            audioManager.playSound('enemyHeavyShoot');
        } else {
            audioManager.playSound('enemyShoot');
        }

        // Shoot straight downward only (no homing/tracking)
        const bulletSpeed = GAME_CONFIG.BULLET.ENEMY_SPEED;
        const velocityX = 0; // No horizontal movement
        const velocityY = bulletSpeed; // Straight down

        // Create bullet - this will be handled by the game state
        if (window.gameState) {
            const bulletType = this.type === 'fighter' ? 'heavy' : 'normal';
            window.gameState.createEnemyBullet(this.x, this.y + this.height / 2, velocityX, velocityY, bulletType);

            // Add enhanced muzzle flash effect
            effectsManager.muzzleFlash(this.x, this.y + this.height / 2, 'enemy');
        }
    }

    updateEnemyEffects(deltaTime) {
        // Create engine trail particles for enemies
        if (Math.random() < 0.5) { // 50% chance each frame
            effectsManager.enemyEngineTrail(this.x, this.y, this.type);
        }
    }
    
    takeDamage(amount) {
        this.health -= amount;
        return this.health <= 0;
    }
    
    getHealthPercentage() {
        return this.health / this.maxHealth;
    }
    
    render(ctx) {
        const spriteName = this.type === 'scout' ? 'enemyScout' : 'enemyFighter';
        const sprite = assetManager.getSprite(spriteName);
        
        if (sprite) {
            ctx.drawImage(sprite, this.x - this.width / 2, this.y - this.height / 2);

            // Draw muzzle flash if firing
            if (this.isFiring) {
                this.renderMuzzleFlash(ctx);
            }

            // Draw health bar if damaged
            if (this.health < this.maxHealth) {
                this.renderHealthBar(ctx);
            }
        } else {
            // Fallback rendering
            ctx.fillStyle = this.type === 'scout' ? '#ff4444' : '#8844ff';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
    }
    
    renderHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 8;
        
        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(barX, barY, barWidth * this.getHealthPercentage(), barHeight);
    }

    renderMuzzleFlash(ctx) {
        const flashSprite = assetManager.getSprite('enemyMuzzleFlash');
        if (flashSprite) {
            // Position muzzle flash at the front of the enemy ship
            const flashX = this.x - flashSprite.width / 2;
            const flashY = this.y + this.height / 2 - flashSprite.height / 2;

            // Add slight random offset for more dynamic effect
            const offsetX = (Math.random() - 0.5) * 2;
            const offsetY = (Math.random() - 0.5) * 2;

            // Draw with slight transparency for glow effect
            ctx.globalAlpha = 0.8;
            ctx.drawImage(flashSprite, flashX + offsetX, flashY + offsetY);
            ctx.globalAlpha = 1.0;
        }
    }

    isBoss() {
        return false; // Regular enemies are not bosses
    }
}
