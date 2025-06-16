// Nexus Blasters - Mobile Optimization System
class MobileOptimization {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isLandscape = window.innerWidth > window.innerHeight;
        this.devicePixelRatio = window.devicePixelRatio || 1;
        this.touchSupported = 'ontouchstart' in window;
        
        // Performance settings
        this.performanceLevel = this.detectPerformanceLevel();
        this.frameRateTarget = this.getTargetFrameRate();
        
        // Touch controls
        this.touchControls = {
            moveArea: null,
            fireButton: null,
            pauseButton: null
        };
        
        // Viewport management
        this.viewportMeta = document.querySelector('meta[name="viewport"]');
        
        this.init();
        console.log('Mobile Optimization initialized:', {
            isMobile: this.isMobile,
            performanceLevel: this.performanceLevel,
            frameRateTarget: this.frameRateTarget
        });
    }

    detectMobile() {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobileKeywords = ['android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'];
        return mobileKeywords.some(keyword => userAgent.includes(keyword)) || 
               window.innerWidth <= 768 || 
               this.touchSupported;
    }

    detectPerformanceLevel() {
        // Detect device performance capabilities
        const memory = navigator.deviceMemory || 4; // Default to 4GB if unknown
        const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores
        const screenSize = window.innerWidth * window.innerHeight;
        
        if (memory >= 8 && cores >= 8 && screenSize >= 1920 * 1080) {
            return 'high';
        } else if (memory >= 4 && cores >= 4 && screenSize >= 1280 * 720) {
            return 'medium';
        } else {
            return 'low';
        }
    }

    getTargetFrameRate() {
        switch (this.performanceLevel) {
            case 'high': return 60;
            case 'medium': return 45;
            case 'low': return 30;
            default: return 60;
        }
    }

    init() {
        this.setupViewport();
        this.setupTouchControls();
        this.setupOrientationHandling();
        this.setupPerformanceOptimizations();
        this.setupAccessibility();
    }

    setupViewport() {
        if (!this.viewportMeta) {
            this.viewportMeta = document.createElement('meta');
            this.viewportMeta.name = 'viewport';
            document.head.appendChild(this.viewportMeta);
        }
        
        // Optimize viewport for mobile gaming
        this.viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
        
        // Prevent zoom on double tap
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }

    setupTouchControls() {
        if (!this.isMobile) return;
        
        // Create touch control overlay
        const touchOverlay = document.createElement('div');
        touchOverlay.id = 'touchControls';
        touchOverlay.className = 'touch-controls';
        
        // Movement area (left side)
        const moveArea = document.createElement('div');
        moveArea.className = 'touch-move-area';
        moveArea.innerHTML = '<div class="touch-indicator">MOVE</div>';
        
        // Fire button (right side)
        const fireButton = document.createElement('div');
        fireButton.className = 'touch-fire-button';
        fireButton.innerHTML = '<div class="fire-icon">🔥</div>';
        
        // Pause button (top right)
        const pauseButton = document.createElement('div');
        pauseButton.className = 'touch-pause-button';
        pauseButton.innerHTML = '⏸️';
        
        touchOverlay.appendChild(moveArea);
        touchOverlay.appendChild(fireButton);
        touchOverlay.appendChild(pauseButton);
        document.body.appendChild(touchOverlay);
        
        this.touchControls = { moveArea, fireButton, pauseButton };
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        const { moveArea, fireButton, pauseButton } = this.touchControls;
        
        // Movement handling
        let isMoving = false;
        let moveStartX = 0;
        let moveStartY = 0;
        
        moveArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isMoving = true;
            const touch = e.touches[0];
            moveStartX = touch.clientX;
            moveStartY = touch.clientY;
            moveArea.classList.add('active');
        }, { passive: false });
        
        moveArea.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (!isMoving) return;
            
            const touch = e.touches[0];
            const deltaX = touch.clientX - moveStartX;
            const deltaY = touch.clientY - moveStartY;
            
            // Send movement input to game
            if (window.inputManager) {
                window.inputManager.setTouchMovement(deltaX, deltaY);
            }
        }, { passive: false });
        
        moveArea.addEventListener('touchend', (e) => {
            e.preventDefault();
            isMoving = false;
            moveArea.classList.remove('active');
            if (window.inputManager) {
                window.inputManager.setTouchMovement(0, 0);
            }
        }, { passive: false });
        
        // Fire button handling
        fireButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            fireButton.classList.add('active');
            if (window.inputManager) {
                window.inputManager.setTouchFiring(true);
            }
        }, { passive: false });
        
        fireButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            fireButton.classList.remove('active');
            if (window.inputManager) {
                window.inputManager.setTouchFiring(false);
            }
        }, { passive: false });
        
        // Pause button handling
        pauseButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            pauseButton.classList.add('active');
            if (window.game) {
                window.game.togglePause();
            }
        }, { passive: false });
        
        pauseButton.addEventListener('touchend', (e) => {
            e.preventDefault();
            pauseButton.classList.remove('active');
        }, { passive: false });
    }

    setupOrientationHandling() {
        const handleOrientationChange = () => {
            setTimeout(() => {
                this.isLandscape = window.innerWidth > window.innerHeight;
                this.updateLayoutForOrientation();
                
                // Resize canvas if needed
                if (window.game && window.game.canvas) {
                    window.game.resizeCanvas();
                }
            }, 100);
        };
        
        window.addEventListener('orientationchange', handleOrientationChange);
        window.addEventListener('resize', handleOrientationChange);
    }

    updateLayoutForOrientation() {
        const gameContainer = document.getElementById('gameContainer');
        if (!gameContainer) return;
        
        if (this.isLandscape) {
            gameContainer.classList.add('landscape');
            gameContainer.classList.remove('portrait');
        } else {
            gameContainer.classList.add('portrait');
            gameContainer.classList.remove('landscape');
        }
    }

    setupPerformanceOptimizations() {
        // Adjust game settings based on performance level
        if (window.GAME_CONFIG) {
            switch (this.performanceLevel) {
                case 'low':
                    window.GAME_CONFIG.EFFECTS.MAX_PARTICLES = 50;
                    window.GAME_CONFIG.EFFECTS.PARTICLE_DENSITY = 0.5;
                    break;
                case 'medium':
                    window.GAME_CONFIG.EFFECTS.MAX_PARTICLES = 100;
                    window.GAME_CONFIG.EFFECTS.PARTICLE_DENSITY = 0.75;
                    break;
                case 'high':
                    window.GAME_CONFIG.EFFECTS.MAX_PARTICLES = 200;
                    window.GAME_CONFIG.EFFECTS.PARTICLE_DENSITY = 1.0;
                    break;
            }
        }
        
        // Battery optimization
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                if (battery.level < 0.2) {
                    this.enablePowerSaveMode();
                }
                
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.2) {
                        this.enablePowerSaveMode();
                    }
                });
            });
        }
    }

    enablePowerSaveMode() {
        console.log('Enabling power save mode');
        this.frameRateTarget = Math.min(this.frameRateTarget, 30);
        
        if (window.effectsManager) {
            window.effectsManager.performanceMode = 'low';
        }
    }

    setupAccessibility() {
        // High contrast mode detection
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
        }
        
        // Reduced motion detection
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
            if (window.effectsManager) {
                window.effectsManager.reducedMotion = true;
            }
        }
    }

    // Public methods for game integration
    getOptimalSettings() {
        return {
            frameRate: this.frameRateTarget,
            particleCount: this.getOptimalParticleCount(),
            effectsQuality: this.performanceLevel,
            touchControls: this.isMobile
        };
    }

    getOptimalParticleCount() {
        switch (this.performanceLevel) {
            case 'low': return 50;
            case 'medium': return 100;
            case 'high': return 200;
            default: return 100;
        }
    }

    showTouchControls() {
        const touchControls = document.getElementById('touchControls');
        if (touchControls) {
            touchControls.style.display = 'block';
        }
    }

    hideTouchControls() {
        const touchControls = document.getElementById('touchControls');
        if (touchControls) {
            touchControls.style.display = 'none';
        }
    }
}

// Global mobile optimization instance
const mobileOptimization = new MobileOptimization();
