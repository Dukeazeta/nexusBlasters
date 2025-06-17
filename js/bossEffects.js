// Nexus Protocol Defender - Boss Effects System
class BossEffects {
    constructor() {
        // Boss-specific effect tracking
        this.activeEffects = [];
    }

    // ===== BOSS WARNING EFFECTS =====

    bossWarning(bossType) {
        // Screen-wide warning effect
        if (typeof effectsManager !== 'undefined' && effectsManager.screenEffects) {
            effectsManager.screenEffects.addScreenShake(20, 2000);
            effectsManager.screenEffects.bossWarningFlash();
        }

        // Create warning particles across the screen
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            const particleCount = 100;

            for (let i = 0; i < particleCount && effectsManager.particleSystem.particles.length < effectsManager.particleSystem.maxParticles; i++) {
                const x = Utils.randomFloat(0, window.innerWidth);
                const y = Utils.randomFloat(0, window.innerHeight);
                const angle = Math.random() * Math.PI * 2;
                const speed = Utils.randomFloat(100, 200);
                const size = Utils.randomFloat(3, 8);
                const life = Utils.randomFloat(1.5, 3);

                effectsManager.particleSystem.particles.push({
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
        }

        // Add warning text
        if (typeof effectsManager !== 'undefined' && effectsManager.visualEffects) {
            const centerX = window.innerWidth / 2;
            const topY = window.innerHeight * 0.3;
            effectsManager.visualEffects.addFloatingText(centerX, topY, 'THREAT DETECTED!', GAME_CONFIG.COLORS.THREAT_RED, 32);
            effectsManager.visualEffects.addFloatingText(centerX, topY + 40, `${bossType.toUpperCase()} INCOMING`, GAME_CONFIG.COLORS.THREAT_RED, 20);
        }
    }

    // ===== BOSS ENTRANCE EFFECTS =====

    bossEntered(x, y, bossType) {
        // Epic entrance effect
        if (typeof effectsManager !== 'undefined' && effectsManager.screenEffects) {
            effectsManager.screenEffects.addScreenShake(15, 1500);
        }

        // Create dramatic entrance particles
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            const particleCount = 60;

            for (let i = 0; i < particleCount && effectsManager.particleSystem.particles.length < effectsManager.particleSystem.maxParticles; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const distance = Utils.randomFloat(50, 150);
                const speed = Utils.randomFloat(200, 400);
                const size = Utils.randomFloat(4, 10);
                const life = Utils.randomFloat(1, 2);

                effectsManager.particleSystem.particles.push({
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
        }

        // Add entrance text
        const bossNames = {
            protocolTitan: 'PROTOCOL BREACH TITAN',
            consensusDestroyer: 'CONSENSUS DESTROYER',
            networkOverlord: 'NETWORK OVERLORD'
        };

        if (typeof effectsManager !== 'undefined' && effectsManager.visualEffects) {
            const centerX = window.innerWidth / 2;
            const topY = window.innerHeight * 0.25;
            effectsManager.visualEffects.addFloatingText(centerX, topY, bossNames[bossType] || 'BOSS ENTITY', GAME_CONFIG.COLORS.THREAT_RED, 28);
        }
    }

    // ===== BOSS PHASE TRANSITION EFFECTS =====

    bossPhaseTransition(x, y, phase) {
        // Phase change effect
        if (typeof effectsManager !== 'undefined' && effectsManager.screenEffects) {
            effectsManager.screenEffects.addScreenShake(12, 800);
        }

        // Create phase transition particles
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            const particleCount = 40;

            for (let i = 0; i < particleCount && effectsManager.particleSystem.particles.length < effectsManager.particleSystem.maxParticles; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const distance = 80;
                const speed = Utils.randomFloat(150, 250);
                const size = Utils.randomFloat(3, 7);
                const life = Utils.randomFloat(0.8, 1.5);

                effectsManager.particleSystem.particles.push({
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
        }

        if (typeof effectsManager !== 'undefined' && effectsManager.visualEffects) {
            effectsManager.visualEffects.addFloatingText(x, y - 100, `PHASE ${phase}`, '#ffff44', 24);
        }
    }

    // ===== BOSS COMBAT EFFECTS =====

    bossHit(x, y) {

        // Create hit sparks
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            effectsManager.particleSystem.createSparkParticles(x, y, Math.PI, 1.5);
            effectsManager.particleSystem.createExplosionParticles(x, y, 0.8, '#ff8844');
        }
    }

    // ===== BOSS DEFEAT EFFECTS =====

    bossDefeated(x, y, bossType) {
        // Epic boss death effect
        if (typeof effectsManager !== 'undefined' && effectsManager.screenEffects) {
            effectsManager.screenEffects.addScreenShake(25, 2000);
            effectsManager.screenEffects.victoryFlash();
        }

        // Create massive explosion
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            effectsManager.particleSystem.createExplosionParticles(x, y, 3, GAME_CONFIG.COLORS.THREAT_RED);
            effectsManager.particleSystem.createExplosionParticles(x, y, 2.5, '#ff8844');
            effectsManager.particleSystem.createExplosionParticles(x, y, 2, '#ffff44');

            // Create debris
            effectsManager.particleSystem.createDebrisParticles(x, y, 3);

            // Create victory particles
            const particleCount = 80;

            for (let i = 0; i < particleCount && effectsManager.particleSystem.particles.length < effectsManager.particleSystem.maxParticles; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Utils.randomFloat(100, 300);
                const size = Utils.randomFloat(3, 8);
                const life = Utils.randomFloat(2, 4);

                effectsManager.particleSystem.particles.push({
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
        }

        // Add victory text with responsive positioning
        if (typeof effectsManager !== 'undefined' && effectsManager.visualEffects) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            effectsManager.visualEffects.addFloatingText(centerX, centerY - 50, 'BOSS DEFEATED!', GAME_CONFIG.COLORS.VERIFICATION_GREEN, 32);
            effectsManager.visualEffects.addFloatingText(centerX, centerY - 10, '+10000 NEX POINTS', GAME_CONFIG.COLORS.PROOF_GOLD, 20);
        }
    }

    // ===== SPECIAL BOSS ATTACKS =====

    bossLaserCharge(x, y) {
        // Charging effect for boss laser attacks
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            for (let i = 0; i < 10; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Utils.randomFloat(20, 60);
                const speed = Utils.randomFloat(50, 100);
                const size = Utils.randomFloat(2, 5);
                const life = Utils.randomFloat(0.5, 1.0);

                effectsManager.particleSystem.particles.push({
                    x: x + Math.cos(angle) * distance,
                    y: y + Math.sin(angle) * distance,
                    vx: -Math.cos(angle) * speed,
                    vy: -Math.sin(angle) * speed,
                    size: size,
                    maxSize: size,
                    life: life,
                    maxLife: life,
                    color: '#ffff44',
                    type: 'laserCharge',
                    gravity: 0,
                    friction: 0.98
                });
            }
        }
    }

    bossShieldActivate(x, y) {
        // Shield activation effect
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            const particleCount = 30;

            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const distance = 60;
                const size = Utils.randomFloat(2, 4);
                const life = Utils.randomFloat(1, 2);

                effectsManager.particleSystem.particles.push({
                    x: x + Math.cos(angle) * distance,
                    y: y + Math.sin(angle) * distance,
                    vx: 0,
                    vy: 0,
                    size: size,
                    maxSize: size,
                    life: life,
                    maxLife: life,
                    color: '#4488ff',
                    type: 'shield',
                    gravity: 0,
                    friction: 1.0
                });
            }
        }
    }

    // ===== UPDATE AND RENDER =====
    
    update(deltaTime) {
        // Update any boss-specific effect timers
        for (let i = this.activeEffects.length - 1; i >= 0; i--) {
            const effect = this.activeEffects[i];
            effect.timer -= deltaTime;
            
            if (effect.timer <= 0) {
                this.activeEffects.splice(i, 1);
            }
        }
    }

    render(ctx) {
        // Render any boss-specific overlay effects
        for (const effect of this.activeEffects) {
            // Custom rendering for boss effects if needed
        }
    }
}
