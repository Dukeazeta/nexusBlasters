// Nexus Blasters - PowerUp Class

// PowerUp class
class PowerUp extends GameObject {
    constructor(x, y, type = 'health') {
        super(x, y, 32, 32);
        this.type = type;
        this.speed = 100; // Slow downward movement
        this.life = 1.0;
        this.maxLife = 1.0;
        this.scale = 1.0;
        this.pulseTimer = 0;
        
        // Visual effects
        this.glowIntensity = 1.0;
        this.rotationSpeed = 2.0; // Rotation speed in radians per second
        this.rotation = 0;
        
        // Floating animation
        this.floatOffset = 0;
        this.floatSpeed = 3.0;
        this.floatAmplitude = 5;
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        
        // Move downward slowly
        this.y += this.speed * dt;
        
        // Update visual effects
        this.updateVisualEffects(dt);
        
        // Create particle trail
        this.createParticleTrail();
        
        // Update life (power-ups expire after some time)
        this.life -= dt * 0.1; // Slow decay
        
        // Update scale based on life
        this.scale = 0.8 + 0.2 * this.life;
    }
    
    updateVisualEffects(dt) {
        // Rotation
        this.rotation += this.rotationSpeed * dt;
        
        // Pulsing glow
        this.pulseTimer += dt * 4;
        this.glowIntensity = 0.7 + 0.3 * Math.sin(this.pulseTimer);
        
        // Floating animation
        this.floatOffset = Math.sin(this.pulseTimer * this.floatSpeed) * this.floatAmplitude;
    }
    
    createParticleTrail() {
        // Create trailing particles occasionally
        if (Math.random() < 0.3) {
            const colors = {
                health: GAME_CONFIG.COLORS.VERIFICATION_GREEN,
                speed: GAME_CONFIG.COLORS.PROOF_GOLD,
                rapidFire: GAME_CONFIG.COLORS.NEXUS_GLOW,
                shield: GAME_CONFIG.COLORS.NEXUS_ACCENT
            };
            
            effectsManager.createTrailParticle(
                this.x + (Math.random() - 0.5) * this.width,
                this.y + (Math.random() - 0.5) * this.height,
                colors[this.type] || '#ffffff',
                2,
                0.8
            );
        }
    }
    
    render(ctx) {
        const spriteName = this.getSpriteName();
        const sprite = assetManager.getSprite(spriteName);
        
        ctx.save();
        
        // Apply floating offset
        const renderY = this.y + this.floatOffset;
        
        // Apply glow effect
        ctx.globalAlpha = this.glowIntensity;
        
        // Apply rotation and scale
        ctx.translate(this.x, renderY);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        if (sprite) {
            const size = this.width * this.scale;
            ctx.drawImage(sprite, 
                -size / 2, 
                -size / 2, 
                size, size);
        } else {
            // Fallback rendering
            ctx.fillStyle = this.getFallbackColor();
            ctx.fillRect(-this.width / 2, -this.height / 2, 
                        this.width, this.height);
        }
        
        ctx.restore();
        
        // Render glow effect
        this.renderGlow(ctx, renderY);
    }
    
    getSpriteName() {
        const spriteMap = {
            health: 'powerUpHealth',
            speed: 'powerUpSpeed',
            rapidFire: 'powerUpRapidFire',
            shield: 'powerUpShield'
        };
        return spriteMap[this.type] || 'powerUpHealth';
    }
    
    getFallbackColor() {
        const colorMap = {
            health: '#00ff88',
            speed: '#ffaa00',
            rapidFire: '#00aaff',
            shield: '#aa88ff'
        };
        return colorMap[this.type] || '#ffffff';
    }
    
    renderGlow(ctx, renderY) {
        // Create a subtle glow effect around the power-up
        ctx.save();
        ctx.globalAlpha = this.glowIntensity * 0.3;
        
        const glowSize = this.width * this.scale * 1.5;
        const gradient = ctx.createRadialGradient(
            this.x, renderY, 0,
            this.x, renderY, glowSize / 2
        );
        
        const glowColor = this.getFallbackColor();
        gradient.addColorStop(0, glowColor);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, renderY, glowSize / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    // Check if power-up is expired
    isExpired() {
        return this.life <= 0;
    }
    
    // Get the effect description for UI
    getDescription() {
        const descriptions = {
            health: 'Restores 1 heart',
            speed: 'Temporary speed boost',
            rapidFire: 'Permanent rapid fire',
            shield: 'Temporary shield'
        };
        return descriptions[this.type] || 'Unknown power-up';
    }
    
    // Get the duration for timed power-ups
    getDuration() {
        const durations = {
            health: 0, // Instant
            speed: 10000, // 10 seconds
            rapidFire: 0, // Permanent until damage
            shield: 8000 // 8 seconds
        };
        return durations[this.type] || 0;
    }
    
    // Check if this is a timed power-up
    isTimed() {
        return this.getDuration() > 0;
    }

    // Apply the power-up effect to the player
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
            case 'multiShot':
                player.applyMultiShot(); // 10 seconds of 3-way shooting
                audioManager.playSound('powerUpPickup');
                break;
            case 'homingMissiles':
                player.applyHomingMissiles(); // 10 seconds of homing shots
                audioManager.playSound('powerUpPickup');
                break;
            case 'invincibility':
                player.applyInvincibility(); // 5 seconds of complete invincibility
                audioManager.playSound('powerUpPickup');
                break;
            case 'superWeapon':
                player.applySuperWeapon(); // 15 seconds of devastating firepower
                audioManager.playSound('powerUpPickup');
                break;
        }
    }
}
