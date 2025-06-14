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

// Boss class - Epic boss encounters
class Boss extends Enemy {
    constructor(x, y, type = 'protocolTitan') {
        // Boss sizes are much larger than regular enemies
        const bossConfig = {
            protocolTitan: { width: 120, height: 100, health: 1000, speed: 80 },
            consensusDestroyer: { width: 140, height: 120, health: 1500, speed: 60 },
            networkOverlord: { width: 160, height: 140, health: 2500, speed: 40 }
        };

        const config = bossConfig[type] || bossConfig.protocolTitan;
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

        // Override firing properties
        this.shootCooldown = 500; // Faster firing than regular enemies

        console.log(`Boss spawned: ${type} with ${this.health} HP`);
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
                this.basicAttack(playerX, playerY);
                break;
            case 'spread':
                this.spreadAttack(playerX, playerY);
                break;
            case 'burst':
                this.burstAttack(playerX, playerY);
                break;
            case 'laser':
                this.laserAttack(playerX, playerY);
                break;
        }
    }

    basicAttack(playerX, playerY) {
        // Single shot toward player
        const angle = Math.atan2(playerY - this.y, playerX - this.x);
        const speed = GAME_CONFIG.BULLET.ENEMY_SPEED;

        gameState.createEnemyBullet(
            this.x,
            this.y + this.height / 2,
            Math.cos(angle) * speed,
            Math.sin(angle) * speed,
            'boss'
        );

        this.triggerMuzzleFlash();
    }

    spreadAttack(playerX, playerY) {
        // 5-shot spread
        const baseAngle = Math.atan2(playerY - this.y, playerX - this.x);
        const spread = Math.PI / 6; // 30 degrees
        const speed = GAME_CONFIG.BULLET.ENEMY_SPEED;

        for (let i = -2; i <= 2; i++) {
            const angle = baseAngle + (i * spread / 4);
            gameState.createEnemyBullet(
                this.x,
                this.y + this.height / 2,
                Math.cos(angle) * speed,
                Math.sin(angle) * speed,
                'boss'
            );
        }

        this.triggerMuzzleFlash();
    }

    burstAttack(playerX, playerY) {
        // Rapid burst of 3 shots
        if (this.burstCount < this.maxBursts) {
            this.basicAttack(playerX, playerY);
            this.burstCount++;
            this.attackCooldown = 200; // Quick follow-up
        } else {
            this.burstCount = 0;
            this.attackCooldown = 1500; // Longer pause after burst
        }
    }

    laserAttack(playerX, playerY) {
        // Straight down laser beam (placeholder for now)
        for (let i = 0; i < 5; i++) {
            gameState.createEnemyBullet(
                this.x,
                this.y + this.height / 2,
                0,
                GAME_CONFIG.BULLET.ENEMY_SPEED * 1.5,
                'laser'
            );
        }

        this.triggerMuzzleFlash();
        this.attackCooldown = 2000; // Longer cooldown for powerful attack
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
                this.attackPattern = 'spread';
                this.attackCooldown = 800;
                this.movePattern = 'hover';
                break;
            case 3:
                this.attackPattern = 'burst';
                this.attackCooldown = 600;
                this.movePattern = 'aggressive';
                break;
        }
    }

    updateBossEffects(deltaTime) {
        // Pulsing glow effect
        this.glowIntensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;

        // Warning flash during transitions
        if (this.isTransitioning || !this.hasEntered) {
            this.warningTimer += deltaTime;
        }
    }

    takeDamage(amount) {
        const killed = super.takeDamage(amount);

        if (killed) {
            // Boss death effects
            effectsManager.bossDefeated(this.x, this.y, this.bossType);
            audioManager.playSound('bossDefeat');

            // Spawn special power-ups
            this.spawnBossRewards();
        } else {
            // Boss hit effects
            effectsManager.bossHit(this.x, this.y);
            effectsManager.addScreenShake(8, 200);
        }

        return killed;
    }

    spawnBossRewards() {
        // Spawn multiple power-ups as rewards
        const rewards = ['health', 'rapidFire', 'shield', 'speed'];

        for (let i = 0; i < rewards.length; i++) {
            const angle = (Math.PI * 2 * i) / rewards.length;
            const distance = 60;
            const x = this.x + Math.cos(angle) * distance;
            const y = this.y + Math.sin(angle) * distance;

            gameState.powerUps.push(new PowerUp(x, y, rewards[i]));
        }
    }

    render(ctx) {
        // Warning flash during entrance or transitions
        if (this.warningFlash) {
            ctx.save();
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = GAME_CONFIG.COLORS.THREAT_RED;
            ctx.fillRect(this.x - this.width / 2 - 10, this.y - this.height / 2 - 10,
                        this.width + 20, this.height + 20);
            ctx.restore();
        }

        // Boss glow effect
        ctx.save();
        ctx.shadowColor = GAME_CONFIG.COLORS.THREAT_RED;
        ctx.shadowBlur = 20 * this.glowIntensity;

        // Try to render boss sprite, fallback to colored rectangle
        const spriteName = `boss${this.bossType.charAt(0).toUpperCase() + this.bossType.slice(1)}`;
        const sprite = assetManager.getSprite(spriteName);

        if (sprite) {
            ctx.drawImage(sprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        } else {
            // Fallback rendering with boss-specific colors
            const bossColors = {
                protocolTitan: '#ff4444',
                consensusDestroyer: '#8844ff',
                networkOverlord: '#ff8844'
            };

            ctx.fillStyle = bossColors[this.bossType] || '#ff4444';
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);

            // Add some detail to distinguish from regular enemies
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(this.x - 10, this.y - 5, 20, 10);
        }

        ctx.restore();

        // Draw muzzle flash if firing
        if (this.isFiring) {
            this.renderMuzzleFlash(ctx);
        }

        // Always show boss health bar
        this.renderBossHealthBar(ctx);

        // Show phase indicator
        this.renderPhaseIndicator(ctx);
    }

    renderBossHealthBar(ctx) {
        const barWidth = this.width + 40;
        const barHeight = 8;
        const barX = this.x - barWidth / 2;
        const barY = this.y - this.height / 2 - 20;

        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);

        // Health bar with phase colors
        const healthPercent = this.health / this.maxHealth;
        const phaseColors = ['#ff4444', '#ff8844', '#ffff44'];
        ctx.fillStyle = phaseColors[this.phase - 1] || '#ff4444';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

        // Border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barWidth, barHeight);
    }

    renderPhaseIndicator(ctx) {
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`PHASE ${this.phase}`, this.x, this.y - this.height / 2 - 35);
        ctx.restore();
    }

    isBoss() {
        return true;
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
                audioManager.playSound('healthPickup');
                break;
            case 'speed':
                player.applySpeedBoost(); // 10 seconds with visual effects
                audioManager.playSound('speedPickup');
                break;
            case 'rapidFire':
                player.applyRapidFire(); // Permanent until damage
                audioManager.playSound('rapidFirePickup');
                break;
            case 'shield':
                player.applyShield(); // 10 seconds of invincibility
                audioManager.playSound('shieldPickup');
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
