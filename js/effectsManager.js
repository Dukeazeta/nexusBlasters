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
        this.maxParticles = 500;
        
        // Flash effects
        this.flashEffects = [];
        
        // Floating text effects
        this.floatingTexts = [];
        
        // Glow effects
        this.glowEffects = [];
        
        console.log('Effects Manager initialized');
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
    
    // ===== MAIN UPDATE AND RENDER =====
    
    update(deltaTime) {
        this.updateScreenShake(deltaTime);
        this.updateParticles(deltaTime);
        this.updateFloatingTexts(deltaTime);
    }
    
    render(ctx) {
        this.renderParticles(ctx);
        this.renderFloatingTexts(ctx);
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
