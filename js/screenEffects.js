// Nexus Protocol Defender - Screen Effects System
class ScreenEffects {
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

        // Flash effects
        this.flashEffects = [];

        // Screen effects
        this.screenEffects = [];
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

    // ===== FLASH EFFECTS =====

    addFlashEffect(color = '#ffffff', intensity = 0.5, duration = 200) {
        this.flashEffects.push({
            color: color,
            intensity: intensity,
            maxIntensity: intensity,
            duration: duration,
            maxDuration: duration
        });
    }

    updateFlashEffects(deltaTime) {
        for (let i = this.flashEffects.length - 1; i >= 0; i--) {
            const flash = this.flashEffects[i];
            flash.duration -= deltaTime;
            
            // Fade out over time
            const progress = flash.duration / flash.maxDuration;
            flash.intensity = flash.maxIntensity * progress;
            
            if (flash.duration <= 0) {
                this.flashEffects.splice(i, 1);
            }
        }
    }

    renderFlashEffects(ctx, canvasWidth, canvasHeight) {
        for (const flash of this.flashEffects) {
            ctx.save();
            ctx.globalAlpha = flash.intensity;
            ctx.fillStyle = flash.color;
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.restore();
        }
    }

    // ===== SCREEN EFFECTS =====

    addScreenEffect(type, options = {}) {
        const effect = {
            type: type,
            life: options.life || 2.0,
            maxLife: options.life || 2.0,
            intensity: options.intensity || 1.0,
            color: options.color || '#ffffff',
            ...options
        };

        this.screenEffects.push(effect);
    }

    updateScreenEffects(deltaTime) {
        const dt = deltaTime / 1000;

        for (let i = this.screenEffects.length - 1; i >= 0; i--) {
            const effect = this.screenEffects[i];
            effect.life -= dt;

            if (effect.life <= 0) {
                this.screenEffects.splice(i, 1);
            }
        }
    }

    renderScreenEffects(ctx, canvasWidth, canvasHeight) {
        for (const effect of this.screenEffects) {
            const alpha = effect.life / effect.maxLife;
            
            ctx.save();
            ctx.globalAlpha = alpha * effect.intensity;

            switch (effect.type) {
                case 'vignette':
                    this.renderVignetteEffect(ctx, canvasWidth, canvasHeight, effect);
                    break;
                case 'scanlines':
                    this.renderScanlinesEffect(ctx, canvasWidth, canvasHeight, effect);
                    break;
                case 'chromatic':
                    this.renderChromaticAberration(ctx, canvasWidth, canvasHeight, effect);
                    break;
            }

            ctx.restore();
        }
    }

    renderVignetteEffect(ctx, canvasWidth, canvasHeight, effect) {
        const gradient = ctx.createRadialGradient(
            canvasWidth / 2, canvasHeight / 2, 0,
            canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight) / 2
        );
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(1, effect.color);

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    renderScanlinesEffect(ctx, canvasWidth, canvasHeight, effect) {
        ctx.strokeStyle = effect.color;
        ctx.lineWidth = 1;
        ctx.globalAlpha *= 0.3;

        for (let y = 0; y < canvasHeight; y += 4) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
            ctx.stroke();
        }
    }

    renderChromaticAberration(ctx, canvasWidth, canvasHeight, effect) {
        // Simple chromatic aberration simulation
        ctx.fillStyle = 'rgba(255, 0, 0, 0.1)';
        ctx.fillRect(-2, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = 'rgba(0, 0, 255, 0.1)';
        ctx.fillRect(2, 0, canvasWidth, canvasHeight);
    }

    // ===== CONVENIENCE METHODS =====

    damageFlash() {
        this.addFlashEffect('#ff0000', 0.3, 150);
    }

    healFlash() {
        this.addFlashEffect('#00ff00', 0.2, 200);
    }

    powerUpFlash() {
        this.addFlashEffect('#ffff00', 0.25, 250);
    }

    bossWarningFlash() {
        this.addFlashEffect('#ff4444', 0.4, 300);
        this.addScreenEffect('vignette', {
            color: 'rgba(255, 68, 68, 0.3)',
            life: 1.0,
            intensity: 0.8
        });
    }

    victoryFlash() {
        this.addFlashEffect('#00ff88', 0.3, 500);
        this.addScreenEffect('scanlines', {
            color: 'rgba(0, 255, 136, 0.2)',
            life: 2.0,
            intensity: 0.5
        });
    }

    // ===== UPDATE AND RENDER ALL =====
    
    update(deltaTime) {
        this.updateScreenShake(deltaTime);
        this.updateFlashEffects(deltaTime);
        this.updateScreenEffects(deltaTime);
    }

    render(ctx, canvasWidth, canvasHeight) {
        this.renderFlashEffects(ctx, canvasWidth, canvasHeight);
        this.renderScreenEffects(ctx, canvasWidth, canvasHeight);
    }
}
