// Nexus Blasters - Main Game Class
class NexusBlasters {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Core systems
        this.inputManager = null;
        this.gameState = null;
        
        // Game timing
        this.lastTime = 0;
        this.deltaTime = 0;
        this.gameTime = 0;
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.setupSystems();
        this.setupUI();
        this.loadAssets();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        
        // Enable pixel-perfect rendering
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Re-enable pixel-perfect rendering after resize
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        
        // Recreate background for new size
        if (backgroundRenderer && assetManager.loaded) {
            backgroundRenderer.resize(this.canvas.width, this.canvas.height);
        }
    }
    
    setupSystems() {
        // Initialize input manager
        this.inputManager = new InputManager(this.canvas);
        
        // Initialize game state
        this.gameState = new GameState();
    }
    
    setupUI() {
        // Main menu buttons
        document.getElementById('startButton').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.startGame();
        });

        document.getElementById('instructionsButton').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.showInstructions();
        });

        document.getElementById('achievementsButton').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.showAchievements();
        });

        document.getElementById('settingsButton').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.showSettings();
        });

        document.getElementById('creditsButton').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.showCredits();
        });

        // Back buttons
        document.getElementById('backFromInstructions').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.showMainMenu();
        });

        document.getElementById('backFromAchievements').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.showMainMenu();
        });

        document.getElementById('backFromSettings').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.showMainMenu();
        });

        document.getElementById('backFromCredits').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.showMainMenu();
        });

        // Restart button
        document.getElementById('restartButton').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.restartGame();
        });

        // Resume button
        document.getElementById('resumeButton').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.resumeGame();
        });

        // Main menu button
        document.getElementById('mainMenuButton').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.showMainMenu();
        });

        // Share button
        document.getElementById('shareButton').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.shareScore();
        });

        // Pause button
        document.getElementById('pauseBtn').addEventListener('click', () => {
            audioManager.playSound('buttonClick');
            this.pauseGame();
        });



        // Settings controls
        this.setupSettingsControls();

        // Social links
        this.setupSocialLinks();
    }
    
    loadAssets() {
        try {
            console.log('Starting asset loading...');

            // Create pixel art assets
            assetManager.createSprites();
            console.log('Sprites created successfully');

            // Initialize background renderer
            backgroundRenderer.init(this.canvas.width, this.canvas.height);
            console.log('Background renderer initialized');

            // Simulate loading time for effect
            setTimeout(() => {
                console.log('Loading complete, showing menu');
                document.getElementById('loadingScreen').style.display = 'none';
                this.gameState.state = 'menu';
                this.gameLoop();
            }, 1500);
        } catch (error) {
            console.error('Error during asset loading:', error);
            // Show error and try to continue
            document.getElementById('loadingScreen').innerHTML = '<h2>Loading Error - Check Console</h2>';
        }
    }
    
    startGame() {
        audioManager.playSound('gameStart');
        this.gameState.startGame(this.canvas.width, this.canvas.height);

        // Hide menu and show game UI
        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('customPauseButton').classList.remove('hidden');

        // Initialize UI elements
        this.createHeartDisplay();
        this.createPowerUpTimers();
        this.updateUI();
    }
    
    restartGame() {
        document.getElementById('gameOverScreen').classList.add('hidden');
        this.startGame();
    }
    
    pauseGame() {
        if (this.gameState.state === 'playing') {
            this.gameState.pauseGame();
            document.getElementById('pauseScreen').classList.remove('hidden');
        } else if (this.gameState.state === 'paused') {
            this.resumeGame();
        }
    }
    
    resumeGame() {
        if (this.gameState.state === 'paused') {
            this.gameState.resumeGame();
            document.getElementById('pauseScreen').classList.add('hidden');
        }
    }
    
    showMainMenu() {
        this.gameState.showMainMenu();
        this.hideAllScreens();
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('customPauseButton').classList.add('hidden');
    }

    showInstructions() {
        this.hideAllScreens();
        document.getElementById('instructionsScreen').classList.remove('hidden');
    }

    showAchievements() {
        this.hideAllScreens();
        document.getElementById('achievementsScreen').classList.remove('hidden');
        this.populateAchievements();
    }

    showSettings() {
        this.hideAllScreens();
        document.getElementById('settingsScreen').classList.remove('hidden');
        this.updateSettingsDisplay();
    }

    showCredits() {
        this.hideAllScreens();
        document.getElementById('creditsScreen').classList.remove('hidden');
    }

    hideAllScreens() {
        const screens = [
            'startScreen', 'instructionsScreen', 'achievementsScreen',
            'settingsScreen', 'creditsScreen', 'pauseScreen', 'gameOverScreen'
        ];
        screens.forEach(screenId => {
            document.getElementById(screenId).classList.add('hidden');
        });
    }
    
    shareScore() {
        const text = `I just earned ${this.gameState.score} NEX Points defending the Verifiable Internet in Nexus Protocol Defender! 🛡️ Securing consensus across the decentralized supercomputer. #NexusPlayground @NexusLabs`;
        const url = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: 'Nexus Protocol Defender Score',
                text: text,
                url: url
            });
        } else {
            // Fallback to Twitter
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            window.open(twitterUrl, '_blank');
        }
    }
    
    updateUI() {
        if (!this.gameState.player) return;

        document.getElementById('scoreValue').textContent = this.gameState.score;
        document.getElementById('waveValue').textContent = this.gameState.wave;

        // Update heart display
        this.updateHeartDisplay();

        // Update power-up timers
        this.updatePowerUpTimers();
    }

    updateHeartDisplay() {
        const player = this.gameState.player;
        const heartsContainer = document.getElementById('heartsContainer');
        const healthBar = document.getElementById('healthBar');
        const healthBarFill = document.getElementById('healthBarFill');
        const healthBarText = document.getElementById('healthBarText');

        if (!heartsContainer) {
            // Create hearts container if it doesn't exist
            this.createHeartDisplay();
            return;
        }

        // Update traditional hearts display
        heartsContainer.innerHTML = '';
        for (let i = 0; i < player.getMaxHearts(); i++) {
            const heartElement = document.createElement('div');
            heartElement.className = 'heart';

            if (i < player.getHearts()) {
                heartElement.classList.add('full');
            } else {
                heartElement.classList.add('empty');
            }

            heartsContainer.appendChild(heartElement);
        }

        // Update health bar (for mobile)
        if (healthBar && healthBarFill && healthBarText) {
            const healthPercent = (player.getHearts() / player.getMaxHearts()) * 100;
            healthBarFill.style.width = `${healthPercent}%`;
            healthBarText.textContent = `${player.getHearts()}/${player.getMaxHearts()}`;

            // Change color based on health level
            if (healthPercent <= 25) {
                healthBarFill.style.background = 'linear-gradient(90deg, #ff2222, #ff4444)';
            } else if (healthPercent <= 50) {
                healthBarFill.style.background = 'linear-gradient(90deg, #ff8844, #ffaa44)';
            } else {
                healthBarFill.style.background = 'linear-gradient(90deg, #44ff44, #88ff88)';
            }
        }
    }

    createHeartDisplay() {
        const healthDisplay = document.getElementById('healthDisplay');
        if (healthDisplay) {
            healthDisplay.innerHTML = `
                <span id="healthLabel">HEARTS:</span>
                <div id="heartsContainer"></div>
            `;
        }
    }

    createPowerUpTimers() {
        // Create power-up timer elements if they don't exist
        let timersContainer = document.getElementById('powerUpTimers');
        if (!timersContainer) {
            timersContainer = document.createElement('div');
            timersContainer.id = 'powerUpTimers';
            timersContainer.innerHTML = `
                <div id="speedTimer" class="timer-display">VELOCITY BOOST: 0s</div>
                <div id="shieldTimer" class="timer-display">CONSENSUS SHIELD: 0s</div>
                <div id="rapidFireIndicator" class="timer-display">PROOF BURST: ACTIVE</div>
            `;
            document.getElementById('gameContainer').appendChild(timersContainer);
        }
    }

    updatePowerUpTimers() {
        const player = this.gameState.player;

        // Update velocity boost timer
        const speedTime = Math.ceil(player.getSpeedBoostTimeLeft() / 1000);
        const speedTimer = document.getElementById('speedTimer');
        if (speedTimer) {
            if (speedTime > 0) {
                speedTimer.textContent = `VELOCITY BOOST: ${speedTime}s`;
                speedTimer.style.display = 'block';
            } else {
                speedTimer.style.display = 'none';
            }
        }

        // Update consensus shield timer
        const shieldTime = Math.ceil(player.getShieldTimeLeft() / 1000);
        const shieldTimer = document.getElementById('shieldTimer');
        if (shieldTimer) {
            if (shieldTime > 0) {
                shieldTimer.textContent = `CONSENSUS SHIELD: ${shieldTime}s`;
                shieldTimer.style.display = 'block';
            } else {
                shieldTimer.style.display = 'none';
            }
        }

        // Update proof burst indicator
        const rapidFireIndicator = document.getElementById('rapidFireIndicator');
        if (rapidFireIndicator) {
            if (player.rapidFirePermanent) {
                rapidFireIndicator.textContent = 'PROOF BURST: ACTIVE';
                rapidFireIndicator.style.display = 'block';
            } else {
                rapidFireIndicator.style.display = 'none';
            }
        }
    }
    
    gameLoop(currentTime = 0) {
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        this.gameTime += this.deltaTime;
        
        // Update systems
        this.update();
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update() {
        // Update input
        this.inputManager.update();
        
        // Update background
        backgroundRenderer.update(this.deltaTime);

        // Update game state
        this.gameState.update(this.deltaTime, this.inputManager, this.canvas.width, this.canvas.height);

        // Update UI animations
        uiAnimations.update(this.deltaTime);
        
        // Update UI
        if (this.gameState.state === 'playing') {
            this.updateUI();
            this.updateBossUI();
        }
        
        // Check game over
        if (this.gameState.state === 'gameOver') {
            this.handleGameOver();
        }
    }
    
    render() {
        // Apply screen shake
        effectsManager.applyScreenShake(this.ctx);

        // Clear canvas
        this.ctx.fillStyle = GAME_CONFIG.COLORS.SPACE_DARK;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Render background
        backgroundRenderer.render(this.ctx, this.canvas.width, this.canvas.height);

        // Render game objects
        if (this.gameState.state === 'playing' || this.gameState.state === 'paused') {
            this.gameState.render(this.ctx);
        }

        // Render visual effects
        effectsManager.render(this.ctx);

        // Restore screen shake
        effectsManager.restoreScreenShake(this.ctx);
    }
    
    handleGameOver() {
        audioManager.playSound('gameOver');

        // Show game over screen
        document.getElementById('finalScore').textContent = this.gameState.score;
        document.getElementById('finalWave').textContent = this.gameState.wave;
        document.getElementById('finalKills').textContent = this.gameState.kills;
        document.getElementById('gameOverScreen').classList.remove('hidden');

        // Reset game state to prevent multiple triggers
        this.gameState.state = 'gameOverShown';
    }

    updateBossUI() {
        const bossWarning = document.getElementById('bossWarning');
        const bossHealthBar = document.getElementById('bossHealthBar');
        const gameContainer = document.getElementById('gameContainer');

        // Handle boss warning display
        if (this.gameState.showingBossWarning) {
            const timeLeft = Math.ceil((this.gameState.bossWarningDuration - this.gameState.bossWarningTimer) / 1000);
            const bossType = this.gameState.getBossTypeForWave(this.gameState.wave);

            const bossNames = {
                protocolTitan: 'PROTOCOL BREACH TITAN',
                consensusDestroyer: 'CONSENSUS DESTROYER',
                networkOverlord: 'NETWORK OVERLORD'
            };

            bossWarning.querySelector('.boss-name').textContent = bossNames[bossType] || 'BOSS ENTITY';
            bossWarning.querySelector('.warning-countdown').textContent = timeLeft;
            bossWarning.classList.remove('hidden');
        } else {
            bossWarning.classList.add('hidden');
        }

        // Handle boss health bar display and UI layout changes
        if (this.gameState.currentBoss && this.gameState.currentBoss.hasEntered) {
            const boss = this.gameState.currentBoss;
            const healthPercent = (boss.health / boss.maxHealth) * 100;

            const bossNames = {
                protocolTitan: 'PROTOCOL BREACH TITAN',
                consensusDestroyer: 'CONSENSUS DESTROYER',
                networkOverlord: 'NETWORK OVERLORD'
            };

            bossHealthBar.querySelector('.boss-name-display').textContent = bossNames[boss.bossType] || 'BOSS ENTITY';
            bossHealthBar.querySelector('.boss-health-fill').style.width = `${healthPercent}%`;
            bossHealthBar.querySelector('.boss-phase-indicator').textContent = `PHASE ${boss.phase}`;
            bossHealthBar.classList.remove('hidden');

            // Enable boss fight UI mode - hide most UI elements, move health to bottom
            gameContainer.classList.add('boss-fight-mode');
        } else {
            bossHealthBar.classList.add('hidden');

            // Restore normal UI layout when no boss is active
            gameContainer.classList.remove('boss-fight-mode');
        }
    }



    setupSettingsControls() {
        // Volume controls
        const masterVolume = document.getElementById('masterVolume');
        const sfxVolume = document.getElementById('sfxVolume');
        const musicVolume = document.getElementById('musicVolume');

        masterVolume.addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('masterVolumeValue').textContent = `${value}%`;
            audioManager.setMasterVolume(value / 100);
        });

        sfxVolume.addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('sfxVolumeValue').textContent = `${value}%`;
            audioManager.setSFXVolume(value / 100);
        });

        musicVolume.addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('musicVolumeValue').textContent = `${value}%`;
            audioManager.setMusicVolume(value / 100);
        });

        // Touch sensitivity (placeholder for future mobile support)
        const touchSensitivity = document.getElementById('touchSensitivity');
        touchSensitivity.addEventListener('input', (e) => {
            const value = e.target.value;
            document.getElementById('touchSensitivityValue').textContent = `${value}%`;
            // Touch sensitivity setting stored for future use
            localStorage.setItem('nexus-touch-sensitivity', value);
        });

        // Toggle buttons
        document.getElementById('audioToggle').addEventListener('click', () => {
            audioManager.toggleAudio();
            this.updateSettingsDisplay();
        });

        document.getElementById('particleToggle').addEventListener('click', () => {
            effectsManager.toggleParticles();
            this.updateSettingsDisplay();
        });

        document.getElementById('screenShakeToggle').addEventListener('click', () => {
            effectsManager.toggleScreenShake();
            this.updateSettingsDisplay();
        });

        document.getElementById('hapticToggle').addEventListener('click', () => {
            // Haptic feedback toggle (placeholder for future mobile support)
            const currentState = localStorage.getItem('nexus-haptic-enabled') !== 'false';
            localStorage.setItem('nexus-haptic-enabled', (!currentState).toString());
            this.updateSettingsDisplay();
        });

        // Difficulty selector
        document.getElementById('difficulty').addEventListener('change', (e) => {
            this.setDifficulty(e.target.value);
        });
    }

    updateSettingsDisplay() {
        // Update toggle button states
        document.getElementById('audioToggle').textContent =
            audioManager.enabled ? '🔊 AUDIO ENABLED' : '🔇 AUDIO DISABLED';

        document.getElementById('particleToggle').textContent =
            effectsManager.particlesEnabled ? '✨ PARTICLE EFFECTS: ON' : '✨ PARTICLE EFFECTS: OFF';

        document.getElementById('screenShakeToggle').textContent =
            effectsManager.screenShakeEnabled ? '📳 SCREEN SHAKE: ON' : '📳 SCREEN SHAKE: OFF';

        const hapticEnabled = localStorage.getItem('nexus-haptic-enabled') !== 'false';
        document.getElementById('hapticToggle').textContent =
            hapticEnabled ? '📳 HAPTIC FEEDBACK: ON' : '📳 HAPTIC FEEDBACK: OFF';

        // Update button classes
        document.getElementById('audioToggle').className =
            `setting-button ${audioManager.enabled ? '' : 'disabled'}`;
        document.getElementById('particleToggle').className =
            `setting-button ${effectsManager.particlesEnabled ? '' : 'disabled'}`;
        document.getElementById('screenShakeToggle').className =
            `setting-button ${effectsManager.screenShakeEnabled ? '' : 'disabled'}`;
    }

    setDifficulty(level) {
        // Store difficulty setting
        localStorage.setItem('nexus-difficulty', level);

        // Apply difficulty modifiers
        switch (level) {
            case 'easy':
                GAME_CONFIG.ENEMY.SPAWN_RATE *= 1.5;
                GAME_CONFIG.POWERUP.SPAWN_RATE *= 0.8;
                break;
            case 'hard':
                GAME_CONFIG.ENEMY.SPAWN_RATE *= 0.7;
                GAME_CONFIG.POWERUP.SPAWN_RATE *= 1.3;
                break;
            default: // normal
                // Keep default values
                break;
        }
    }

    setupSocialLinks() {
        document.querySelectorAll('.social-button').forEach(button => {
            button.addEventListener('click', () => {
                const url = button.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank');
                }
            });
        });
    }

    populateAchievements() {
        const achievementsList = document.getElementById('achievementsList');
        const achievements = [
            {
                id: 'firstKill',
                icon: '🎯',
                title: 'FIRST BLOOD',
                description: 'Destroy your first malicious agent',
                unlocked: this.gameState.achievements.firstKill
            },
            {
                id: 'combo10',
                icon: '🔥',
                title: 'COMBO MASTER',
                description: 'Achieve a 10x elimination combo',
                unlocked: this.gameState.achievements.combo10
            },
            {
                id: 'combo25',
                icon: '⚡',
                title: 'COMBO EXPERT',
                description: 'Achieve a 25x elimination combo',
                unlocked: this.gameState.achievements.combo25
            },
            {
                id: 'combo50',
                icon: '💫',
                title: 'COMBO LEGEND',
                description: 'Achieve a 50x elimination combo',
                unlocked: this.gameState.achievements.combo50
            },
            {
                id: 'bossKiller',
                icon: '👑',
                title: 'BOSS SLAYER',
                description: 'Defeat a protocol breach entity',
                unlocked: this.gameState.achievements.bossKiller
            },
            {
                id: 'survivor',
                icon: '🛡️',
                title: 'PROTOCOL GUARDIAN',
                description: 'Survive 10 protocol waves',
                unlocked: this.gameState.achievements.survivor
            },
            {
                id: 'powerCollector',
                icon: '⭐',
                title: 'ENHANCEMENT SPECIALIST',
                description: 'Collect 50 power-up fragments',
                unlocked: this.gameState.achievements.powerCollector
            }
        ];

        achievementsList.innerHTML = achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">${achievement.unlocked ? achievement.icon : '🔒'}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.title}</div>
                    <div class="achievement-desc">${achievement.description}</div>
                    ${achievement.unlocked ? '<div class="achievement-progress">COMPLETED</div>' : '<div class="achievement-progress">LOCKED</div>'}
                </div>
            </div>
        `).join('');
    }
}

// Initialize game when page loads
window.addEventListener('load', () => {
    new NexusBlasters();
});
