// Nexus Blasters - Bullet Class

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
        this.updateEnhancedEffects(deltaTime);
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

    updateEnhancedEffects(deltaTime) {
        // Create enhanced trail effects using the new effects manager
        if (Math.random() < 0.8) { // 80% chance each frame
            effectsManager.bulletTrail(this.x, this.y, this.type === 'player' ? 'player' : 'enemy');
        }

        // Special effects for boss bullets
        if (this.subType === 'boss' || this.subType === 'laser') {
            if (Math.random() < 0.4) {
                effectsManager.createGlowParticle(this.x, this.y,
                    this.subType === 'laser' ? '#ffff44' : '#ff8844', 0.6, 0.2);
            }
        }
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
