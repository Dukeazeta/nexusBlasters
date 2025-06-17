// Nexus Protocol Defender - Particle System
class ParticleSystem {
    constructor() {
        // Particle systems
        this.particles = [];
        this.maxParticles = 800; // Increased for more effects

        // Advanced particle systems
        this.trailParticles = [];
        this.glowParticles = [];
        this.maxTrailParticles = 200;
        this.maxGlowParticles = 100;

        // Performance tracking
        this.performanceMode = this.detectPerformanceMode();
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
    
    // ===== PARTICLE CREATION =====
    
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

    // ===== UPDATE METHODS =====
    
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

    // ===== RENDER METHODS =====

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

    // ===== UPDATE ALL =====

    update(deltaTime) {
        this.updateParticles(deltaTime);
        this.updateTrailParticles(deltaTime);
        this.updateGlowParticles(deltaTime);
    }

    render(ctx) {
        // Render in order: glows first (background), then particles, then trails
        this.renderGlowParticles(ctx);
        this.renderParticles(ctx);
        this.renderTrailParticles(ctx);
    }
}
