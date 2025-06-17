// Nexus Protocol Defender - Visual Effects Management System
class EffectsManager {
    constructor() {
        // Initialize subsystems
        this.particleSystem = new ParticleSystem();
        this.screenEffects = new ScreenEffects();
        this.visualEffects = new VisualEffects();
        this.bossEffects = new BossEffects();

        // Performance tracking
        this.performanceMode = this.detectPerformanceMode();

        // Settings
        this.particlesEnabled = true;
        this.screenShakeEnabled = true;

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

    // ===== DELEGATED METHODS - SCREEN EFFECTS =====

    addScreenShake(intensity, duration) {
        if (this.screenShakeEnabled) {
            this.screenEffects.addScreenShake(intensity, duration);
        }
    }

    applyScreenShake(ctx) {
        this.screenEffects.applyScreenShake(ctx);
    }

    restoreScreenShake(ctx) {
        this.screenEffects.restoreScreenShake(ctx);
    }

    // ===== DELEGATED METHODS - PARTICLE SYSTEM =====

    createExplosionParticles(x, y, intensity = 1, color = '#ff4444') {
        this.particleSystem.createExplosionParticles(x, y, intensity, color);
    }

    createSparkParticles(x, y, direction = 0, intensity = 1) {
        this.particleSystem.createSparkParticles(x, y, direction, intensity);
    }

    createDebrisParticles(x, y, intensity = 1) {
        this.particleSystem.createDebrisParticles(x, y, intensity);
    }

    createPowerUpParticles(x, y, color = '#00ff88') {
        this.particleSystem.createPowerUpParticles(x, y, color);
    }

    createTrailParticle(x, y, color = '#4a90e2', size = 2, life = 0.5) {
        this.particleSystem.createTrailParticle(x, y, color, size, life);
    }

    createGlowParticle(x, y, color = '#4a90e2', intensity = 1.0, life = 1.0) {
        this.particleSystem.createGlowParticle(x, y, color, intensity, life);
    }

    // ===== DELEGATED METHODS - VISUAL EFFECTS =====

    addFloatingText(x, y, text, color = '#ffffff', size = 16) {
        this.visualEffects.addFloatingText(x, y, text, color, size);
    }

    addDamageNumber(x, y, damage, isCritical = false) {
        this.visualEffects.addDamageNumber(x, y, damage, isCritical);
    }

    addComboEffect(x, y, comboCount) {
        this.visualEffects.addComboEffect(x, y, comboCount);
    }

    bulletTrail(x, y, bulletType = 'player') {
        this.visualEffects.bulletTrail(x, y, bulletType);
    }

    playerEngineTrail(x, y, speedBoost = false) {
        this.visualEffects.playerEngineTrail(x, y, speedBoost);
    }

    enemyEngineTrail(x, y, enemyType = 'scout') {
        this.visualEffects.enemyEngineTrail(x, y, enemyType);
    }

    muzzleFlash(x, y, bulletType = 'player') {
        this.visualEffects.muzzleFlash(x, y, bulletType);
    }

    // ===== DELEGATED METHODS - BOSS EFFECTS =====

    bossWarning(bossType) {
        this.bossEffects.bossWarning(bossType);
    }

    bossEntered(x, y, bossType) {
        this.bossEffects.bossEntered(x, y, bossType);
    }

    bossPhaseTransition(x, y, phase) {
        this.bossEffects.bossPhaseTransition(x, y, phase);
    }

    bossHit(x, y) {
        this.bossEffects.bossHit(x, y);
    }

    bossDefeated(x, y, bossType) {
        this.bossEffects.bossDefeated(x, y, bossType);
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
        // Create warp-in effect using particle system
        const particleCount = 20;

        for (let i = 0; i < particleCount && this.particleSystem.particles.length < this.particleSystem.maxParticles; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const distance = 30;
            const speed = 100;
            const size = Utils.randomFloat(1, 3);
            const life = 0.8;

            this.particleSystem.particles.push({
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

        for (let i = 0; i < particleCount && this.particleSystem.particles.length < this.particleSystem.maxParticles; i++) {
            const x = Utils.randomFloat(0, window.innerWidth);
            const y = Utils.randomFloat(0, window.innerHeight);
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.randomFloat(50, 150);
            const size = Utils.randomFloat(2, 5);
            const life = Utils.randomFloat(2, 4);

            this.particleSystem.particles.push({
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

    // ===== SETTINGS CONTROLS =====

    toggleParticles() {
        this.particlesEnabled = !this.particlesEnabled;
        console.log('Particles enabled:', this.particlesEnabled);
    }

    toggleScreenShake() {
        this.screenShakeEnabled = !this.screenShakeEnabled;
        console.log('Screen shake enabled:', this.screenShakeEnabled);
    }

    // ===== MAIN UPDATE AND RENDER =====

    update(deltaTime) {
        if (this.particlesEnabled) {
            this.particleSystem.update(deltaTime);
        }
        this.screenEffects.update(deltaTime);
        this.visualEffects.update(deltaTime);
        this.bossEffects.update(deltaTime);
    }

    render(ctx) {
        // Render in order: screen effects first, then particles, then visual effects
        this.screenEffects.render(ctx, ctx.canvas.width, ctx.canvas.height);
        if (this.particlesEnabled) {
            this.particleSystem.render(ctx);
        }
        this.visualEffects.render(ctx);
        this.bossEffects.render(ctx);
    }
}

// Global effects manager instance
const effectsManager = new EffectsManager();