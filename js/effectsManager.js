// Nexus Protocol Defender - Visual Effects Management System
class EffectsManager {
    constructor() {
        // Screen shake system
        this.screenShake = {
            intensity: 0,
            duration: 0,
            maxDuration: 0,
            offsetX: 0,
            offsetY: 0,
            frequency: 30 // Shake frequency
        };
        
        // Particle systems
        this.particles = [];
        this.maxParticles = 800; // Increased for more effects

        // Advanced particle systems
        this.trailParticles = [];
        this.glowParticles = [];
        this.maxTrailParticles = 200;
        this.maxGlowParticles = 100;

        // Flash effects
        this.flashEffects = [];

        // Floating text effects
        this.floatingTexts = [];

        // Screen effects
        this.screenEffects = [];

        // Background effects
        this.backgroundEffects = {
            stars: [],
            debris: [],
            energy: []
        };

        // Advanced effects
        this.lightningEffects = [];
        this.rippleEffects = [];
        this.damageNumbers = [];
        this.comboEffects = [];

        // Performance tracking
        this.performanceMode = this.detectPerformanceMode();

        console.log('Effects Manager initialized with performance mode:', this.performanceMode);
    }

    // ===== PERFORMANCE DETECTION =====

    detectPerformanceMode() {
        // Detect device performance capabilities
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowEnd = window.innerWidth <= 768 || window.devicePixelRatio < 2;
        const hasLimitedMemory = navigator.deviceMemory && navigator.deviceMemory < 4;

        if (isMobile || isLowEnd || hasLimitedMemory) {
            return 'low'; // Reduced particle counts and effects
        } else if (window.innerWidth >= 1920 && window.devicePixelRatio >= 2) {
            return 'high'; // Full effects with enhanced visuals
        }
        return 'medium'; // Standard effects
    }

    getParticleMultiplier() {
        switch (this.performanceMode) {
            case 'low': return 0.5;
            case 'high': return 1.5;
            default: return 1.0;
        }
    }
    
    // ===== SCREEN SHAKE SYSTEM =====
    
    addScreenShake(intensity, duration) {
        // Only apply if new shake is stronger or current shake is ending
        if (intensity > this.screenShake.intensity || this.screenShake.duration < 100) {
            this.screenShake.intensity = intensity;
            this.screenShake.duration = duration;
            this.screenShake.maxDuration = duration;
        }
    }
    
    updateScreenShake(deltaTime) {
        if (this.screenShake.duration <= 0) {
            this.screenShake.offsetX = 0;
            this.screenShake.offsetY = 0;
            this.screenShake.intensity = 0;
            return;
        }
        
        this.screenShake.duration -= deltaTime;
        
        // Calculate shake intensity (decreases over time)
        const progress = this.screenShake.duration / this.screenShake.maxDuration;
        const currentIntensity = this.screenShake.intensity * progress;
        
        // Generate random shake offset
        const angle = Math.random() * Math.PI * 2;
        this.screenShake.offsetX = Math.cos(angle) * currentIntensity;
        this.screenShake.offsetY = Math.sin(angle) * currentIntensity;
    }
    
    applyScreenShake(ctx) {
        if (this.screenShake.intensity > 0) {
            ctx.save();
            ctx.translate(this.screenShake.offsetX, this.screenShake.offsetY);
        }
    }
    
    restoreScreenShake(ctx) {
        if (this.screenShake.intensity > 0) {
            ctx.restore();
        }
    }
    
    // ===== PARTICLE SYSTEM =====
    
    createExplosionParticles(x, y, intensity = 1, color = '#ff4444') {
        const particleCount = Math.floor(15 * intensity);
        
        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
            const speed = Utils.randomFloat(50, 150) * intensity;
            const size = Utils.randomFloat(2, 6) * intensity;
            const life = Utils.randomFloat(0.5, 1.5);
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: color,
                type: 'explosion',
                gravity: 50,
                friction: 0.98
            });
        }
    }
    
    createSparkParticles(x, y, direction = 0, intensity = 1) {
        const particleCount = Math.floor(8 * intensity);
        
        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const spread = Math.PI / 3; // 60 degree spread
            const angle = direction + (Math.random() - 0.5) * spread;
            const speed = Utils.randomFloat(100, 200) * intensity;
            const size = Utils.randomFloat(1, 3);
            const life = Utils.randomFloat(0.3, 0.8);
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: '#ffff88',
                type: 'spark',
                gravity: 0,
                friction: 0.95
            });
        }
    }
    
    createDebrisParticles(x, y, intensity = 1) {
        const particleCount = Math.floor(10 * intensity);
        
        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.randomFloat(30, 100) * intensity;
            const size = Utils.randomFloat(1, 4);
            const life = Utils.randomFloat(1, 2);
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: '#888888',
                type: 'debris',
                gravity: 100,
                friction: 0.99,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 10
            });
        }
    }
    
    createPowerUpParticles(x, y, color = '#00ff88') {
        const particleCount = 12;
        
        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Utils.randomFloat(80, 120);
            const size = Utils.randomFloat(2, 4);
            const life = Utils.randomFloat(0.8, 1.2);
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: color,
                type: 'powerup',
                gravity: -20, // Float upward
                friction: 0.96
            });
        }
    }
    
    updateParticles(deltaTime) {
        const dt = deltaTime / 1000; // Convert to seconds
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // Update physics
            particle.vy += particle.gravity * dt;
            particle.vx *= particle.friction;
            particle.vy *= particle.friction;
            
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            
            // Update rotation for debris
            if (particle.rotationSpeed) {
                particle.rotation += particle.rotationSpeed * dt;
            }
            
            // Update life
            particle.life -= dt;
            
            // Update size based on life
            const lifeRatio = particle.life / particle.maxLife;
            particle.size = particle.maxSize * lifeRatio;
            
            // Remove dead particles
            if (particle.life <= 0 || particle.size <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    renderParticles(ctx) {
        for (const particle of this.particles) {
            const lifeRatio = particle.life / particle.maxLife;
            const alpha = Math.max(0, lifeRatio);
            
            ctx.save();
            ctx.globalAlpha = alpha;
            
            if (particle.rotation !== undefined) {
                ctx.translate(particle.x, particle.y);
                ctx.rotate(particle.rotation);
                ctx.translate(-particle.x, -particle.y);
            }
            
            // Render based on particle type
            switch (particle.type) {
                case 'explosion':
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                    
                case 'spark':
                    ctx.strokeStyle = particle.color;
                    ctx.lineWidth = particle.size;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particle.x - particle.vx * 0.01, particle.y - particle.vy * 0.01);
                    ctx.stroke();
                    break;
                    
                case 'debris':
                    ctx.fillStyle = particle.color;
                    ctx.fillRect(
                        particle.x - particle.size / 2,
                        particle.y - particle.size / 2,
                        particle.size,
                        particle.size
                    );
                    break;
                    
                case 'powerup':
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Add glow effect
                    ctx.shadowColor = particle.color;
                    ctx.shadowBlur = particle.size * 2;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    break;

                case 'warp':
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Add energy effect
                    ctx.strokeStyle = particle.color;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                    ctx.stroke();
                    break;

                case 'celebration':
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Add sparkle effect
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    const sparkleSize = particle.size * 1.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x - sparkleSize, particle.y);
                    ctx.lineTo(particle.x + sparkleSize, particle.y);
                    ctx.moveTo(particle.x, particle.y - sparkleSize);
                    ctx.lineTo(particle.x, particle.y + sparkleSize);
                    ctx.stroke();
                    break;

                case 'warning':
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Add pulsing warning effect
                    ctx.strokeStyle = particle.color;
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
                    ctx.stroke();
                    break;

                case 'bossEntrance':
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Add energy trail effect
                    ctx.strokeStyle = particle.color;
                    ctx.lineWidth = particle.size * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(particle.x - particle.vx * 0.02, particle.y - particle.vy * 0.02);
                    ctx.stroke();
                    break;

                case 'phaseTransition':
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Add electric effect
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
                    ctx.stroke();
                    break;

                case 'victory':
                    ctx.fillStyle = particle.color;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Add victory sparkle
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    const victorySize = particle.size * 2;
                    ctx.beginPath();
                    ctx.moveTo(particle.x - victorySize, particle.y);
                    ctx.lineTo(particle.x + victorySize, particle.y);
                    ctx.moveTo(particle.x, particle.y - victorySize);
                    ctx.lineTo(particle.x, particle.y + victorySize);
                    ctx.stroke();
                    break;

                case 'muzzleFlash':
                    ctx.fillStyle = particle.color;
                    ctx.shadowColor = particle.color;
                    ctx.shadowBlur = particle.size * 3;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                    break;

                case 'combo':
                    ctx.fillStyle = particle.color;
                    ctx.shadowColor = particle.color;
                    ctx.shadowBlur = particle.size * 2;
                    ctx.beginPath();
                    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                    ctx.fill();

                    // Add star effect for combo particles
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 1;
                    const starSize = particle.size * 1.2;
                    ctx.beginPath();
                    ctx.moveTo(particle.x - starSize, particle.y);
                    ctx.lineTo(particle.x + starSize, particle.y);
                    ctx.moveTo(particle.x, particle.y - starSize);
                    ctx.lineTo(particle.x, particle.y + starSize);
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    break;
            }
            
            ctx.restore();
        }
    }
    
    // ===== FLOATING TEXT SYSTEM =====
    
    addFloatingText(x, y, text, color = '#ffffff', size = 16) {
        // Make font size responsive to screen size
        const isMobile = window.innerWidth <= 768;
        const responsiveSize = isMobile ? Math.max(size * 0.7, 12) : size;

        this.floatingTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            size: responsiveSize,
            life: 2.0,
            maxLife: 2.0,
            vy: -50 // Float upward
        });
    }
    
    updateFloatingTexts(deltaTime) {
        const dt = deltaTime / 1000;
        
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const text = this.floatingTexts[i];
            
            text.y += text.vy * dt;
            text.life -= dt;
            
            if (text.life <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }
    
    renderFloatingTexts(ctx) {
        for (const text of this.floatingTexts) {
            const alpha = text.life / text.maxLife;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = text.color;
            ctx.font = `bold ${text.size}px 'Courier New', monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(text.text, text.x, text.y);
            ctx.restore();
        }
    }
    
    // ===== TRAIL PARTICLE SYSTEM =====

    createTrailParticle(x, y, color = '#4a90e2', size = 2, life = 0.5) {
        if (this.trailParticles.length >= this.maxTrailParticles) {
            this.trailParticles.shift(); // Remove oldest
        }

        this.trailParticles.push({
            x: x + (Math.random() - 0.5) * 4,
            y: y + (Math.random() - 0.5) * 4,
            size: size,
            maxSize: size,
            life: life,
            maxLife: life,
            color: color,
            alpha: 1.0,
            vx: (Math.random() - 0.5) * 20,
            vy: (Math.random() - 0.5) * 20
        });
    }

    updateTrailParticles(deltaTime) {
        const dt = deltaTime / 1000;

        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            const particle = this.trailParticles[i];

            // Update position
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;

            // Update life and alpha
            particle.life -= dt;
            particle.alpha = particle.life / particle.maxLife;
            particle.size = particle.maxSize * particle.alpha;

            // Remove dead particles
            if (particle.life <= 0) {
                this.trailParticles.splice(i, 1);
            }
        }
    }

    renderTrailParticles(ctx) {
        for (const particle of this.trailParticles) {
            ctx.save();
            ctx.globalAlpha = particle.alpha * 0.8;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // ===== GLOW PARTICLE SYSTEM =====

    createGlowParticle(x, y, color = '#4a90e2', intensity = 1.0, life = 1.0) {
        if (this.glowParticles.length >= this.maxGlowParticles) {
            this.glowParticles.shift(); // Remove oldest
        }

        this.glowParticles.push({
            x: x,
            y: y,
            intensity: intensity,
            maxIntensity: intensity,
            life: life,
            maxLife: life,
            color: color,
            radius: 10 * intensity,
            maxRadius: 10 * intensity
        });
    }

    updateGlowParticles(deltaTime) {
        const dt = deltaTime / 1000;

        for (let i = this.glowParticles.length - 1; i >= 0; i--) {
            const particle = this.glowParticles[i];

            // Update life and intensity
            particle.life -= dt;
            const lifeRatio = particle.life / particle.maxLife;
            particle.intensity = particle.maxIntensity * lifeRatio;
            particle.radius = particle.maxRadius * (0.5 + lifeRatio * 0.5);

            // Remove dead particles
            if (particle.life <= 0) {
                this.glowParticles.splice(i, 1);
            }
        }
    }

    renderGlowParticles(ctx) {
        for (const particle of this.glowParticles) {
            ctx.save();
            ctx.globalAlpha = particle.intensity * 0.3;

            // Create radial gradient for glow effect
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.radius
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // ===== DAMAGE NUMBERS SYSTEM =====

    addDamageNumber(x, y, damage, isCritical = false) {
        const color = isCritical ? '#ffff00' : '#ff6666';
        const size = isCritical ? 20 : 16;
        const isMobile = window.innerWidth <= 768;
        const responsiveSize = isMobile ? Math.max(size * 0.7, 12) : size;

        this.damageNumbers.push({
            x: x + (Math.random() - 0.5) * 20,
            y: y,
            damage: damage,
            color: color,
            size: responsiveSize,
            life: 1.5,
            maxLife: 1.5,
            vy: -80,
            vx: (Math.random() - 0.5) * 40,
            isCritical: isCritical
        });
    }

    updateDamageNumbers(deltaTime) {
        const dt = deltaTime / 1000;

        for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
            const number = this.damageNumbers[i];

            number.x += number.vx * dt;
            number.y += number.vy * dt;
            number.life -= dt;

            // Slow down over time
            number.vx *= 0.98;
            number.vy *= 0.98;

            if (number.life <= 0) {
                this.damageNumbers.splice(i, 1);
            }
        }
    }

    renderDamageNumbers(ctx) {
        for (const number of this.damageNumbers) {
            const alpha = number.life / number.maxLife;
            const scale = number.isCritical ? 1 + (1 - alpha) * 0.5 : 1;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = number.color;
            ctx.font = `bold ${number.size * scale}px 'Courier New', monospace`;
            ctx.textAlign = 'center';

            if (number.isCritical) {
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 2;
                ctx.strokeText(number.damage.toString(), number.x, number.y);
            }

            ctx.fillText(number.damage.toString(), number.x, number.y);
            ctx.restore();
        }
    }

    // ===== COMBO EFFECTS SYSTEM =====

    addComboEffect(x, y, comboCount) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight * 0.3;

        this.comboEffects.push({
            x: centerX,
            y: centerY,
            comboCount: comboCount,
            life: 2.0,
            maxLife: 2.0,
            scale: 0.5,
            maxScale: 1.5,
            color: this.getComboColor(comboCount)
        });

        // Add particles around the combo text
        this.createComboParticles(centerX, centerY, comboCount);
    }

    getComboColor(comboCount) {
        if (comboCount >= 50) return '#ff00ff'; // Purple for mega combos
        if (comboCount >= 25) return '#ffff00'; // Yellow for high combos
        if (comboCount >= 10) return '#ff8800'; // Orange for medium combos
        return '#00ff88'; // Green for basic combos
    }

    createComboParticles(x, y, comboCount) {
        const particleCount = Math.min(comboCount, 20) * this.getParticleMultiplier();
        const color = this.getComboColor(comboCount);

        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Utils.randomFloat(100, 200);
            const size = Utils.randomFloat(2, 5);
            const life = Utils.randomFloat(1, 2);

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: color,
                type: 'combo',
                gravity: -50,
                friction: 0.95
            });
        }
    }

    updateComboEffects(deltaTime) {
        const dt = deltaTime / 1000;

        for (let i = this.comboEffects.length - 1; i >= 0; i--) {
            const combo = this.comboEffects[i];

            combo.life -= dt;
            const lifeRatio = combo.life / combo.maxLife;
            combo.scale = combo.maxScale * (0.5 + lifeRatio * 0.5);

            if (combo.life <= 0) {
                this.comboEffects.splice(i, 1);
            }
        }
    }

    renderComboEffects(ctx) {
        for (const combo of this.comboEffects) {
            const alpha = combo.life / combo.maxLife;

            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = combo.color;
            ctx.font = `bold ${24 * combo.scale}px 'Courier New', monospace`;
            ctx.textAlign = 'center';

            // Add glow effect
            ctx.shadowColor = combo.color;
            ctx.shadowBlur = 10;

            ctx.fillText(`${combo.comboCount}x COMBO!`, combo.x, combo.y);
            ctx.restore();
        }
    }

    // ===== MAIN UPDATE AND RENDER =====

    update(deltaTime) {
        this.updateScreenShake(deltaTime);
        this.updateParticles(deltaTime);
        this.updateTrailParticles(deltaTime);
        this.updateGlowParticles(deltaTime);
        this.updateFloatingTexts(deltaTime);
        this.updateDamageNumbers(deltaTime);
        this.updateComboEffects(deltaTime);
    }
    
    render(ctx) {
        // Render in order: glows first (background), then particles, then trails, then text (foreground)
        this.renderGlowParticles(ctx);
        this.renderParticles(ctx);
        this.renderTrailParticles(ctx);
        this.renderFloatingTexts(ctx);
        this.renderDamageNumbers(ctx);
        this.renderComboEffects(ctx);
    }
    
    // ===== CONVENIENCE METHODS =====
    
    enemyDestroyed(x, y, enemyType = 'scout') {
        const intensity = enemyType === 'fighter' ? 1.5 : 1.0;
        const shakeIntensity = enemyType === 'fighter' ? 8 : 5;
        
        this.addScreenShake(shakeIntensity, 200);
        this.createExplosionParticles(x, y, intensity, GAME_CONFIG.COLORS.THREAT_RED);
        this.createDebrisParticles(x, y, intensity);
        this.createSparkParticles(x, y, Math.PI, intensity);
    }
    
    playerHit(x, y) {
        this.addScreenShake(12, 300);
        this.createExplosionParticles(x, y, 0.8, '#ff8888');
    }
    
    powerUpCollected(x, y, type) {
        const colors = {
            health: GAME_CONFIG.COLORS.VERIFICATION_GREEN,
            speed: GAME_CONFIG.COLORS.PROOF_GOLD,
            rapidFire: GAME_CONFIG.COLORS.NEXUS_GLOW,
            shield: GAME_CONFIG.COLORS.NEXUS_ACCENT
        };
        
        this.createPowerUpParticles(x, y, colors[type] || '#ffffff');
        this.addFloatingText(x, y - 20, `+${type.toUpperCase()}`, colors[type], 14);
    }
    
    scoreGained(x, y, points) {
        this.addFloatingText(x, y - 30, `+${points}`, GAME_CONFIG.COLORS.PROOF_GOLD, 12);
    }

    // ===== ENHANCED VISUAL EFFECTS =====

    bulletTrail(x, y, bulletType = 'player') {
        const colors = {
            player: GAME_CONFIG.COLORS.NEXUS_GLOW,
            enemy: GAME_CONFIG.COLORS.THREAT_RED,
            boss: '#ff8844',
            laser: '#ffff44'
        };

        this.createTrailParticle(x, y, colors[bulletType] || colors.player, 1.5, 0.3);

        // Add glow for special bullets
        if (bulletType === 'boss' || bulletType === 'laser') {
            this.createGlowParticle(x, y, colors[bulletType], 0.8, 0.2);
        }
    }

    playerEngineTrail(x, y, speedBoost = false) {
        const color = speedBoost ? GAME_CONFIG.COLORS.PROOF_GOLD : GAME_CONFIG.COLORS.NEXUS_GLOW;
        const intensity = speedBoost ? 1.5 : 1.0;

        // Create multiple trail particles for engine effect
        for (let i = 0; i < 3; i++) {
            this.createTrailParticle(
                x + (Math.random() - 0.5) * 8,
                y + 10 + i * 3,
                color,
                2 + Math.random(),
                0.4 + Math.random() * 0.2
            );
        }

        // Add glow for speed boost
        if (speedBoost) {
            this.createGlowParticle(x, y + 15, color, 1.2, 0.3);
        }
    }

    enemyEngineTrail(x, y, enemyType = 'scout') {
        const color = enemyType === 'boss' ? '#ff8844' : GAME_CONFIG.COLORS.THREAT_RED;
        const intensity = enemyType === 'boss' ? 2.0 : 1.0;

        this.createTrailParticle(x, y + 10, color, 1.5 * intensity, 0.3);

        if (enemyType === 'boss') {
            this.createGlowParticle(x, y + 15, color, 1.0, 0.2);
        }
    }

    muzzleFlash(x, y, bulletType = 'player') {
        const colors = {
            player: '#ffffff',
            enemy: GAME_CONFIG.COLORS.THREAT_RED,
            boss: '#ff8844',
            laser: '#ffff44'
        };

        // Create bright flash particles
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.randomFloat(50, 100);
            const size = Utils.randomFloat(1, 3);

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: 0.1,
                maxLife: 0.1,
                color: colors[bulletType] || colors.player,
                type: 'muzzleFlash',
                gravity: 0,
                friction: 0.9
            });
        }

        // Add glow effect
        this.createGlowParticle(x, y, colors[bulletType] || colors.player, 1.5, 0.15);
    }

    enemySpawned(x, y) {
        // Create warp-in effect
        const particleCount = 20;

        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 30;
            const speed = 100;
            const size = Utils.randomFloat(1, 3);
            const life = 0.8;

            this.particles.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                vx: -Math.cos(angle) * speed,
                vy: -Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: GAME_CONFIG.COLORS.THREAT_RED,
                type: 'warp',
                gravity: 0,
                friction: 0.98
            });
        }
    }

    waveCompleted() {
        // Create celebration particles across the screen
        const particleCount = 50;

        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const x = Utils.randomFloat(0, window.innerWidth);
            const y = Utils.randomFloat(0, window.innerHeight);
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.randomFloat(50, 150);
            const size = Utils.randomFloat(2, 5);
            const life = Utils.randomFloat(2, 4);

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: GAME_CONFIG.COLORS.VERIFICATION_GREEN,
                type: 'celebration',
                gravity: -20,
                friction: 0.99
            });
        }

        // Use responsive positioning for floating text
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        this.addFloatingText(centerX, centerY, 'PROTOCOL SECURED!', GAME_CONFIG.COLORS.VERIFICATION_GREEN, 24);
    }

    // ===== BOSS-SPECIFIC EFFECTS =====

    bossWarning(bossType) {
        // Screen-wide warning effect
        this.addScreenShake(20, 2000);

        // Create warning particles across the screen
        const particleCount = 100;

        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const x = Utils.randomFloat(0, window.innerWidth);
            const y = Utils.randomFloat(0, window.innerHeight);
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.randomFloat(100, 200);
            const size = Utils.randomFloat(3, 8);
            const life = Utils.randomFloat(1.5, 3);

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: GAME_CONFIG.COLORS.THREAT_RED,
                type: 'warning',
                gravity: 0,
                friction: 0.95
            });
        }

        // Add warning text
        // Use responsive positioning for warning text
        const centerX = window.innerWidth / 2;
        const topY = window.innerHeight * 0.3;
        this.addFloatingText(centerX, topY, 'THREAT DETECTED!', GAME_CONFIG.COLORS.THREAT_RED, 32);
        this.addFloatingText(centerX, topY + 40, `${bossType.toUpperCase()} INCOMING`, GAME_CONFIG.COLORS.THREAT_RED, 20);
    }

    bossEntered(x, y, bossType) {
        // Epic entrance effect
        this.addScreenShake(15, 1500);

        // Create dramatic entrance particles
        const particleCount = 60;

        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = Utils.randomFloat(50, 150);
            const speed = Utils.randomFloat(200, 400);
            const size = Utils.randomFloat(4, 10);
            const life = Utils.randomFloat(1, 2);

            this.particles.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                vx: -Math.cos(angle) * speed,
                vy: -Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: GAME_CONFIG.COLORS.THREAT_RED,
                type: 'bossEntrance',
                gravity: 0,
                friction: 0.92
            });
        }

        // Add entrance text
        const bossNames = {
            protocolTitan: 'PROTOCOL BREACH TITAN',
            consensusDestroyer: 'CONSENSUS DESTROYER',
            networkOverlord: 'NETWORK OVERLORD'
        };

        // Use responsive positioning for boss entrance text
        const centerX = window.innerWidth / 2;
        const topY = window.innerHeight * 0.25;
        this.addFloatingText(centerX, topY, bossNames[bossType] || 'BOSS ENTITY', GAME_CONFIG.COLORS.THREAT_RED, 28);
    }

    bossPhaseTransition(x, y, phase) {
        // Phase change effect
        this.addScreenShake(12, 800);

        // Create phase transition particles
        const particleCount = 40;

        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 80;
            const speed = Utils.randomFloat(150, 250);
            const size = Utils.randomFloat(3, 7);
            const life = Utils.randomFloat(0.8, 1.5);

            this.particles.push({
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: '#ffff44',
                type: 'phaseTransition',
                gravity: 0,
                friction: 0.94
            });
        }

        this.addFloatingText(x, y - 100, `PHASE ${phase}`, '#ffff44', 24);
    }

    bossHit(x, y) {
        // Boss taking damage effect
        this.addScreenShake(6, 150);

        // Create hit sparks
        this.createSparkParticles(x, y, Math.PI, 1.5);

        // Add some explosion particles
        this.createExplosionParticles(x, y, 0.8, '#ff8844');
    }

    bossDefeated(x, y, bossType) {
        // Epic boss death effect
        this.addScreenShake(25, 2000);

        // Create massive explosion
        this.createExplosionParticles(x, y, 3, GAME_CONFIG.COLORS.THREAT_RED);
        this.createExplosionParticles(x, y, 2.5, '#ff8844');
        this.createExplosionParticles(x, y, 2, '#ffff44');

        // Create debris
        this.createDebrisParticles(x, y, 3);

        // Create victory particles
        const particleCount = 80;

        for (let i = 0; i < particleCount && this.particles.length < this.maxParticles; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.randomFloat(100, 300);
            const size = Utils.randomFloat(3, 8);
            const life = Utils.randomFloat(2, 4);

            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: size,
                maxSize: size,
                life: life,
                maxLife: life,
                color: GAME_CONFIG.COLORS.VERIFICATION_GREEN,
                type: 'victory',
                gravity: -30,
                friction: 0.96
            });
        }

        // Add victory text with responsive positioning
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        this.addFloatingText(centerX, centerY - 50, 'BOSS DEFEATED!', GAME_CONFIG.COLORS.VERIFICATION_GREEN, 32);
        this.addFloatingText(centerX, centerY - 10, '+10000 NEX POINTS', GAME_CONFIG.COLORS.PROOF_GOLD, 20);
    }
}

// Global effects manager instance
const effectsManager = new EffectsManager();
