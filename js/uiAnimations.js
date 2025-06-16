// Nexus Blasters - UI Animations and Notifications System
class UIAnimations {
    constructor() {
        this.notifications = [];
        this.waveTransitions = [];
        this.pulseElements = new Map();
        this.slideElements = new Map();
        
        // Performance settings
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        console.log('UI Animations initialized');
    }

    // ===== NOTIFICATION SYSTEM =====
    
    showNotification(text, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now() + Math.random(),
            text: text,
            type: type, // 'info', 'success', 'warning', 'error', 'achievement'
            duration: duration,
            life: duration,
            maxLife: duration,
            y: -100, // Start above screen
            targetY: 20,
            alpha: 0
        };

        this.notifications.push(notification);
        this.createNotificationElement(notification);
    }

    createNotificationElement(notification) {
        const notificationEl = document.createElement('div');
        notificationEl.className = `game-notification notification-${notification.type}`;
        notificationEl.id = `notification-${notification.id}`;
        notificationEl.textContent = notification.text;
        
        // Apply mobile-responsive styling
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            notificationEl.classList.add('mobile-notification');
        }

        document.body.appendChild(notificationEl);
        
        // Trigger animation
        requestAnimationFrame(() => {
            notificationEl.classList.add('notification-enter');
        });
    }

    updateNotifications(deltaTime) {
        for (let i = this.notifications.length - 1; i >= 0; i--) {
            const notification = this.notifications[i];
            notification.life -= deltaTime;

            // Update position and alpha
            const progress = 1 - (notification.life / notification.maxLife);
            if (progress < 0.2) {
                // Fade in
                notification.alpha = progress / 0.2;
                notification.y = notification.targetY + (1 - notification.alpha) * 50;
            } else if (progress > 0.8) {
                // Fade out
                notification.alpha = (1 - progress) / 0.2;
            } else {
                notification.alpha = 1;
                notification.y = notification.targetY;
            }

            // Update DOM element
            const element = document.getElementById(`notification-${notification.id}`);
            if (element) {
                element.style.transform = `translateY(${notification.y}px)`;
                element.style.opacity = notification.alpha;
            }

            // Remove expired notifications
            if (notification.life <= 0) {
                if (element) {
                    element.remove();
                }
                this.notifications.splice(i, 1);
            }
        }
    }

    // ===== WAVE TRANSITION ANIMATIONS =====
    
    showWaveTransition(waveNumber) {
        const transition = {
            waveNumber: waveNumber,
            life: 3000,
            maxLife: 3000,
            scale: 0.5,
            alpha: 0
        };

        this.waveTransitions.push(transition);
        this.createWaveTransitionElement(transition);
    }

    createWaveTransitionElement(transition) {
        const transitionEl = document.createElement('div');
        transitionEl.className = 'wave-transition';
        transitionEl.innerHTML = `
            <div class="wave-number">PROTOCOL ${transition.waveNumber}</div>
            <div class="wave-subtitle">INITIATING DEFENSE SEQUENCE</div>
        `;

        document.body.appendChild(transitionEl);
        
        // Trigger animation
        requestAnimationFrame(() => {
            transitionEl.classList.add('wave-transition-enter');
        });

        // Auto-remove after animation
        setTimeout(() => {
            if (transitionEl.parentNode) {
                transitionEl.remove();
            }
        }, transition.maxLife);
    }

    // ===== ELEMENT ANIMATIONS =====
    
    pulseElement(elementId, intensity = 1.0, duration = 1000) {
        if (this.reducedMotion) return;

        const element = document.getElementById(elementId);
        if (!element) return;

        this.pulseElements.set(elementId, {
            element: element,
            intensity: intensity,
            duration: duration,
            elapsed: 0,
            originalTransform: element.style.transform || ''
        });
    }

    slideElement(elementId, fromX, toX, duration = 500) {
        if (this.reducedMotion) return;

        const element = document.getElementById(elementId);
        if (!element) return;

        this.slideElements.set(elementId, {
            element: element,
            fromX: fromX,
            toX: toX,
            duration: duration,
            elapsed: 0
        });
    }

    updateElementAnimations(deltaTime) {
        // Update pulse animations
        for (const [id, pulse] of this.pulseElements) {
            pulse.elapsed += deltaTime;
            const progress = pulse.elapsed / pulse.duration;
            
            if (progress >= 1) {
                pulse.element.style.transform = pulse.originalTransform;
                this.pulseElements.delete(id);
            } else {
                const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.1 * pulse.intensity;
                pulse.element.style.transform = `${pulse.originalTransform} scale(${scale})`;
            }
        }

        // Update slide animations
        for (const [id, slide] of this.slideElements) {
            slide.elapsed += deltaTime;
            const progress = Math.min(slide.elapsed / slide.duration, 1);
            
            if (progress >= 1) {
                slide.element.style.transform = `translateX(${slide.toX}px)`;
                this.slideElements.delete(id);
            } else {
                const easeProgress = this.easeOutCubic(progress);
                const currentX = slide.fromX + (slide.toX - slide.fromX) * easeProgress;
                slide.element.style.transform = `translateX(${currentX}px)`;
            }
        }
    }

    easeOutCubic(t) {
        return 1 - Math.pow(1 - t, 3);
    }

    // ===== SCREEN EFFECTS =====
    
    flashScreen(color = '#ffffff', intensity = 0.3, duration = 200) {
        if (this.reducedMotion) return;

        const flash = document.createElement('div');
        flash.className = 'screen-flash';
        flash.style.backgroundColor = color;
        flash.style.opacity = intensity;
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 200);
        }, duration);
    }

    shakeUI(intensity = 5, duration = 300) {
        if (this.reducedMotion) return;

        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;

        const originalTransform = gameContainer.style.transform || '';
        const startTime = Date.now();
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                gameContainer.style.transform = originalTransform;
                return;
            }
            
            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress);
            const x = (Math.random() - 0.5) * currentIntensity;
            const y = (Math.random() - 0.5) * currentIntensity;
            
            gameContainer.style.transform = `${originalTransform} translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        };
        
        shake();
    }

    // ===== MAIN UPDATE =====
    
    update(deltaTime) {
        this.updateNotifications(deltaTime);
        this.updateElementAnimations(deltaTime);
    }

    // ===== CONVENIENCE METHODS =====
    
    showAchievement(title, description) {
        this.showNotification(`🏆 ${title}`, 'achievement', 4000);
        this.pulseElement('scoreDisplay', 1.5, 1000);
        this.flashScreen('#ffd700', 0.2, 300);
    }

    showPowerUpCollected(powerUpType) {
        const messages = {
            health: '❤️ NODE INTEGRITY RESTORED',
            speed: '⚡ VELOCITY BOOST ACTIVE',
            rapidFire: '🔥 PROOF BURST ENABLED',
            shield: '🛡️ CONSENSUS SHIELD ACTIVE'
        };
        
        this.showNotification(messages[powerUpType] || '⭐ POWER-UP COLLECTED', 'success', 2000);
    }

    showWaveComplete(waveNumber) {
        this.showNotification(`PROTOCOL ${waveNumber} SECURED`, 'success', 2500);
        this.pulseElement('waveDisplay', 2.0, 1500);
    }

    showBossWarning() {
        this.showNotification('⚠️ THREAT DETECTED', 'warning', 3000);
        this.shakeUI(8, 500);
        this.flashScreen('#ff4444', 0.4, 400);
    }
}

// Global UI animations instance
const uiAnimations = new UIAnimations();
