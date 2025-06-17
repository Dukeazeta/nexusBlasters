// Nexus Protocol Defender - Visual Effects System
class VisualEffects {
    constructor() {
        // Floating text effects
        this.floatingTexts = [];

        // Damage numbers
        this.damageNumbers = [];

        // Combo effects
        this.comboEffects = [];

        // Background effects
        this.backgroundEffects = {
            stars: [],
            debris: [],
            energy: []
        };

        // Advanced effects
        this.lightningEffects = [];
        this.rippleEffects = [];
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
    }

    getComboColor(comboCount) {
        if (comboCount >= 50) return '#ff00ff'; // Purple for mega combos
        if (comboCount >= 25) return '#ffff00'; // Yellow for high combos
        if (comboCount >= 10) return '#ff8800'; // Orange for medium combos
        return '#00ff88'; // Green for basic combos
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

    // ===== ENHANCED VISUAL EFFECTS =====

    bulletTrail(x, y, bulletType = 'player') {
        const colors = {
            player: GAME_CONFIG.COLORS.NEXUS_GLOW,
            enemy: GAME_CONFIG.COLORS.THREAT_RED,
            boss: '#ff8844',
            laser: '#ffff44'
        };

        // This will be handled by the particle system
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            effectsManager.particleSystem.createTrailParticle(x, y, colors[bulletType] || colors.player, 1.5, 0.3);

            // Add glow for special bullets
            if (bulletType === 'boss' || bulletType === 'laser') {
                effectsManager.particleSystem.createGlowParticle(x, y, colors[bulletType], 0.8, 0.2);
            }
        }
    }

    playerEngineTrail(x, y, speedBoost = false) {
        const color = speedBoost ? GAME_CONFIG.COLORS.PROOF_GOLD : GAME_CONFIG.COLORS.NEXUS_GLOW;
        const intensity = speedBoost ? 1.5 : 1.0;

        // Create multiple trail particles for engine effect
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            for (let i = 0; i < 3; i++) {
                effectsManager.particleSystem.createTrailParticle(
                    x + (Math.random() - 0.5) * 8,
                    y + 10 + i * 3,
                    color,
                    2 + Math.random(),
                    0.4 + Math.random() * 0.2
                );
            }

            // Add glow for speed boost
            if (speedBoost) {
                effectsManager.particleSystem.createGlowParticle(x, y + 15, color, 1.2, 0.3);
            }
        }
    }

    enemyEngineTrail(x, y, enemyType = 'scout') {
        const color = enemyType === 'boss' ? '#ff8844' : GAME_CONFIG.COLORS.THREAT_RED;
        const intensity = enemyType === 'boss' ? 2.0 : 1.0;

        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            effectsManager.particleSystem.createTrailParticle(x, y + 10, color, 1.5 * intensity, 0.3);

            if (enemyType === 'boss') {
                effectsManager.particleSystem.createGlowParticle(x, y + 15, color, 1.0, 0.2);
            }
        }
    }

    muzzleFlash(x, y, bulletType = 'player') {
        const colors = {
            player: '#ffffff',
            enemy: GAME_CONFIG.COLORS.THREAT_RED,
            boss: '#ff8844',
            laser: '#ffff44'
        };

        // Create bright flash particles using particle system
        if (typeof effectsManager !== 'undefined' && effectsManager.particleSystem) {
            for (let i = 0; i < 5; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Utils.randomFloat(50, 100);
                const size = Utils.randomFloat(1, 3);

                effectsManager.particleSystem.particles.push({
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
            effectsManager.particleSystem.createGlowParticle(x, y, colors[bulletType] || colors.player, 1.5, 0.15);
        }
    }

    // ===== UPDATE AND RENDER ALL =====
    
    update(deltaTime) {
        this.updateFloatingTexts(deltaTime);
        this.updateDamageNumbers(deltaTime);
        this.updateComboEffects(deltaTime);
    }

    render(ctx) {
        this.renderFloatingTexts(ctx);
        this.renderDamageNumbers(ctx);
        this.renderComboEffects(ctx);
    }
}
