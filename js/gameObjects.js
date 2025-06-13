// Nexus Blasters - Game Objects (Bullets, Enemies, Power-ups, Particles)

// Base GameObject class
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
    }
    
    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
    
    isOffScreen(canvasWidth, canvasHeight) {
        return this.x < -this.width || 
               this.x > canvasWidth + this.width || 
               this.y < -this.height || 
               this.y > canvasHeight + this.height;
    }
    
    destroy() {
        this.active = false;
    }
}

// Bullet class
class Bullet extends GameObject {
    constructor(x, y, velocityX, velocityY, type = 'player', subType = 'normal') {
        const size = Bullet.getBulletSize(type, subType);
        super(x, y, size.width, size.height);
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.type = type;
        this.subType = subType;
        this.damage = Bullet.getBulletDamage(type, subType);

        // Visual effects
        this.trailParticles = [];
        this.glowIntensity = 1.0;
    }

    static getBulletSize(type, subType) {
        if (type === 'player') {
            return subType === 'rapid' ? { width: 4, height: 8 } : { width: 6, height: 12 };
        } else {
            return subType === 'heavy' ? { width: 6, height: 10 } : { width: 4, height: 8 };
        }
    }

    static getBulletDamage(type, subType) {
        if (type === 'player') {
            return subType === 'rapid' ? 15 : 30;
        } else {
            return subType === 'heavy' ? 20 : 10;
        }
    }
    
    update(deltaTime) {
        this.x += this.velocityX * (deltaTime / 1000);
        this.y += this.velocityY * (deltaTime / 1000);

        // Update visual effects
        this.updateTrailEffect(deltaTime);
        this.updateGlowEffect(deltaTime);
    }

    updateTrailEffect(deltaTime) {
        // Create trail particles for player bullets
        if (this.type === 'player' && Math.random() < 0.3) {
            this.trailParticles.push({
                x: this.x + (Math.random() - 0.5) * 2,
                y: this.y + this.height / 2,
                life: 0.5,
                alpha: 0.8
            });
        }

        // Update existing trail particles
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            const particle = this.trailParticles[i];
            particle.life -= deltaTime / 1000;
            particle.alpha = particle.life * 1.6;

            if (particle.life <= 0) {
                this.trailParticles.splice(i, 1);
            }
        }
    }

    updateGlowEffect(deltaTime) {
        // Pulsing glow effect
        this.glowIntensity = 0.8 + 0.2 * Math.sin(Date.now() * 0.01);
    }
    
    render(ctx) {
        // Render trail particles first (behind bullet)
        this.renderTrail(ctx);

        // Get appropriate sprite
        let spriteName;
        if (this.type === 'player') {
            spriteName = this.subType === 'rapid' ? 'playerRapidBullet' : 'playerBullet';
        } else {
            spriteName = this.subType === 'heavy' ? 'enemyHeavyBullet' : 'enemyBullet';
        }

        const sprite = assetManager.getSprite(spriteName);
        if (sprite) {
            // Add glow effect
            ctx.globalAlpha = this.glowIntensity;
            ctx.drawImage(sprite, this.x - this.width / 2, this.y - this.height / 2);
            ctx.globalAlpha = 1.0;
        } else {
            // Fallback rendering
            ctx.fillStyle = this.type === 'player' ? '#00ffff' : '#ff4444';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
    }

    renderTrail(ctx) {
        // Render trail particles
        this.trailParticles.forEach(particle => {
            ctx.globalAlpha = particle.alpha;
            ctx.fillStyle = this.type === 'player' ? '#88ffff' : '#ffaa44';
            ctx.fillRect(particle.x - 1, particle.y - 1, 2, 2);
        });
        ctx.globalAlpha = 1.0;
    }
}

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

        // Shoot straight downward only (no homing/tracking)
        const bulletSpeed = GAME_CONFIG.BULLET.ENEMY_SPEED;
        const velocityX = 0; // No horizontal movement
        const velocityY = bulletSpeed; // Straight down

        // Create bullet - this will be handled by the game state
        if (window.gameState) {
            const bulletType = this.type === 'fighter' ? 'heavy' : 'normal';
            window.gameState.createEnemyBullet(this.x, this.y + this.height / 2, velocityX, velocityY, bulletType);
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
}

// PowerUp class
class PowerUp extends GameObject {
    constructor(x, y, type = 'health') {
        super(x, y, 16, 16);
        this.type = type;
        this.speed = 100;
        this.bobTimer = 0;
        this.bobOffset = 0;
    }
    
    update(deltaTime) {
        // Move downward
        this.y += this.speed * (deltaTime / 1000);
        
        // Bobbing animation
        this.bobTimer += deltaTime;
        this.bobOffset = Math.sin(this.bobTimer * 0.005) * 2;
    }
    
    applyEffect(player) {
        switch (this.type) {
            case 'health':
                player.heal(1); // Restore exactly one heart
                break;
            case 'speed':
                player.applySpeedBoost(); // 10 seconds with visual effects
                break;
            case 'rapidFire':
                player.applyRapidFire(); // Permanent until damage
                break;
            case 'shield':
                player.applyShield(); // 10 seconds of invincibility
                break;
        }
    }
    
    render(ctx) {
        let spriteName;
        switch (this.type) {
            case 'health':
                spriteName = 'healthPowerUp';
                break;
            case 'speed':
                spriteName = 'speedPowerUp';
                break;
            case 'rapidFire':
                spriteName = 'rapidFirePowerUp';
                break;
            case 'shield':
                spriteName = 'shieldPowerUp';
                break;
            default:
                spriteName = 'healthPowerUp';
        }

        const sprite = assetManager.getSprite(spriteName);

        if (sprite) {
            // Add pulsing glow effect
            const glowAlpha = 0.3 + 0.2 * Math.sin(Date.now() * 0.005);
            ctx.globalAlpha = glowAlpha;
            ctx.drawImage(sprite,
                this.x - this.width / 2 - 2,
                this.y - this.height / 2 + this.bobOffset - 2,
                this.width + 4,
                this.height + 4);

            // Draw main sprite
            ctx.globalAlpha = 1.0;
            ctx.drawImage(sprite,
                this.x - this.width / 2,
                this.y - this.height / 2 + this.bobOffset);
        } else {
            // Fallback rendering
            const colors = {
                health: '#ff4444',
                speed: '#ffff00',
                rapidFire: '#00ffff',
                shield: '#00aaff'
            };
            ctx.fillStyle = colors[this.type] || '#44ff44';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2 + this.bobOffset,
                        this.width, this.height);
        }
    }
}

// Particle class for explosions and effects
class Particle extends GameObject {
    constructor(x, y, velocityX, velocityY, type = 'explosion') {
        super(x, y, 8, 8);
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.type = type;
        this.life = 1.0;
        this.decay = Utils.randomFloat(0.5, 2.0);
        this.scale = Utils.randomFloat(0.5, 1.5);
    }
    
    update(deltaTime) {
        this.x += this.velocityX * (deltaTime / 1000);
        this.y += this.velocityY * (deltaTime / 1000);
        
        this.life -= this.decay * (deltaTime / 1000);
        
        if (this.life <= 0) {
            this.destroy();
        }
    }
    
    render(ctx) {
        if (this.life <= 0) return;
        
        const sprite = assetManager.getSprite('explosionParticle');
        
        ctx.globalAlpha = this.life;
        
        if (sprite) {
            const size = this.width * this.scale;
            ctx.drawImage(sprite, 
                this.x - size / 2, 
                this.y - size / 2, 
                size, size);
        } else {
            // Fallback rendering
            ctx.fillStyle = '#ffaa00';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, 
                        this.width * this.scale, this.height * this.scale);
        }
        
        ctx.globalAlpha = 1.0;
    }
}
