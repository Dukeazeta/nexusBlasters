// Nexus Protocol Defender - Audio Management System
class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.music = {};
        this.masterVolume = 0.7;
        this.sfxVolume = 0.8;
        this.musicVolume = 0.5;
        this.enabled = true;
        
        // Current music state
        this.currentMusic = null;
        this.musicFadeInterval = null;
        
        this.initializeAudio();
        this.createSounds();
    }
    
    initializeAudio() {
        try {
            // Initialize Web Audio API with fallbacks
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            // Handle mobile audio unlock
            this.setupMobileAudioUnlock();
            
            console.log('Audio system initialized successfully');
        } catch (error) {
            console.warn('Web Audio API not supported, falling back to HTML5 audio');
            this.audioContext = null;
        }
    }
    
    setupMobileAudioUnlock() {
        // Mobile browsers require user interaction to enable audio
        const unlockAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('Audio context resumed');
                });
            }
            
            // Remove listeners after first interaction
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('click', unlockAudio);
        };
        
        document.addEventListener('touchstart', unlockAudio);
        document.addEventListener('click', unlockAudio);
    }
    
    createSounds() {
        // Generate all sound effects programmatically
        this.createWeaponSounds();
        this.createExplosionSounds();
        this.createPowerUpSounds();
        this.createUISounds();
        this.createAmbientSounds();
        this.createMusic();
    }
    
    createWeaponSounds() {
        // Player weapon sounds
        this.sounds.playerShoot = this.generateLaserSound(440, 0.1, 'sine');
        this.sounds.playerRapidFire = this.generateLaserSound(660, 0.08, 'square');
        this.sounds.playerCharge = this.generateChargeSound();
        
        // Enemy weapon sounds
        this.sounds.enemyShoot = this.generateLaserSound(220, 0.12, 'sawtooth');
        this.sounds.enemyHeavyShoot = this.generateLaserSound(180, 0.15, 'triangle');
    }
    
    createExplosionSounds() {
        // Different explosion types
        this.sounds.enemyDestroy = this.generateExplosionSound(0.3);
        this.sounds.playerHit = this.generateHitSound();
        this.sounds.bigExplosion = this.generateExplosionSound(0.5);
    }
    
    createPowerUpSounds() {
        // Power-up collection sounds
        this.sounds.healthPickup = this.generatePickupSound(523, 'sine'); // C5
        this.sounds.speedPickup = this.generatePickupSound(659, 'triangle'); // E5
        this.sounds.rapidFirePickup = this.generatePickupSound(784, 'square'); // G5
        this.sounds.shieldPickup = this.generatePickupSound(880, 'sine'); // A5
    }
    
    createUISounds() {
        // UI interaction sounds
        this.sounds.buttonClick = this.generateClickSound();
        this.sounds.menuSelect = this.generateSelectSound();
        this.sounds.gameStart = this.generateStartSound();
        this.sounds.gameOver = this.generateGameOverSound();
        this.sounds.waveComplete = this.generateWaveCompleteSound();

        // Boss-specific sounds
        this.sounds.bossWarning = this.generateBossWarningSound();
        this.sounds.bossEnter = this.generateBossEnterSound();
        this.sounds.bossPhaseChange = this.generateBossPhaseChangeSound();
        this.sounds.bossDefeat = this.generateBossDefeatSound();
    }
    
    createAmbientSounds() {
        // Ambient space sounds
        this.sounds.engineHum = this.generateEngineHum();
        this.sounds.spaceAmbient = this.generateSpaceAmbient();
    }
    
    createMusic() {
        // Background music tracks
        this.music.menu = this.generateMenuMusic();
        this.music.gameplay = this.generateGameplayMusic();
        this.music.boss = this.generateBossMusic();
        this.music.gameOver = this.generateGameOverMusic();
    }
    
    // Sound generation methods
    generateLaserSound(frequency, duration, waveType = 'sine') {
        if (!this.audioContext) return this.createFallbackSound();
        
        return () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = waveType;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.3, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    generateExplosionSound(intensity = 0.3) {
        if (!this.audioContext) return this.createFallbackSound();
        
        return () => {
            const duration = 0.5;
            const bufferSize = this.audioContext.sampleRate * duration;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            // Generate noise
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * intensity * Math.pow(1 - i / bufferSize, 2);
            }
            
            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            const filter = this.audioContext.createBiquadFilter();
            
            source.buffer = buffer;
            source.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(intensity * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            source.start(this.audioContext.currentTime);
        };
    }
    
    generatePickupSound(frequency, waveType = 'sine') {
        if (!this.audioContext) return this.createFallbackSound();
        
        return () => {
            const duration = 0.3;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = waveType;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(frequency * 1.5, this.audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.4 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    generateHitSound() {
        if (!this.audioContext) return this.createFallbackSound();
        
        return () => {
            const duration = 0.2;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + duration);
            
            gainNode.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    generateClickSound() {
        if (!this.audioContext) return this.createFallbackSound();
        
        return () => {
            const duration = 0.1;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
            
            gainNode.gain.setValueAtTime(0.2 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    createFallbackSound() {
        // Fallback for browsers without Web Audio API
        return () => {
            console.log('Audio not supported');
        };
    }
    
    generateChargeSound() {
        if (!this.audioContext) return this.createFallbackSound();

        return () => {
            const duration = 1.0;
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + duration);

            gainNode.gain.setValueAtTime(0.1 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.5 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    generateStartSound() {
        if (!this.audioContext) return this.createFallbackSound();

        return () => {
            const duration = 0.8;

            // Create ascending chord
            const frequencies = [261.63, 329.63, 392.00, 523.25]; // C-E-G-C

            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

                const startTime = this.audioContext.currentTime + index * 0.1;
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.2 * this.sfxVolume * this.masterVolume, startTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            });
        };
    }

    generateGameOverSound() {
        if (!this.audioContext) return this.createFallbackSound();

        return () => {
            const duration = 1.5;

            // Create descending dramatic sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + duration);

            gainNode.gain.setValueAtTime(0.4 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    generateWaveCompleteSound() {
        if (!this.audioContext) return this.createFallbackSound();

        return () => {
            const duration = 0.6;

            // Create triumphant ascending sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
            oscillator.frequency.setValueAtTime(330, this.audioContext.currentTime + 0.2);
            oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime + 0.4);

            gainNode.gain.setValueAtTime(0.3 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    generateBossWarningSound() {
        if (!this.audioContext) return this.createFallbackSound();

        return () => {
            const duration = 2.0;

            // Create ominous warning sound
            const oscillator1 = this.audioContext.createOscillator();
            const oscillator2 = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator1.type = 'sawtooth';
            oscillator2.type = 'triangle';

            oscillator1.frequency.setValueAtTime(80, this.audioContext.currentTime);
            oscillator1.frequency.linearRampToValueAtTime(120, this.audioContext.currentTime + duration);

            oscillator2.frequency.setValueAtTime(160, this.audioContext.currentTime);
            oscillator2.frequency.linearRampToValueAtTime(240, this.audioContext.currentTime + duration);

            gainNode.gain.setValueAtTime(0.4 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator1.start(this.audioContext.currentTime);
            oscillator2.start(this.audioContext.currentTime);
            oscillator1.stop(this.audioContext.currentTime + duration);
            oscillator2.stop(this.audioContext.currentTime + duration);
        };
    }

    generateBossEnterSound() {
        if (!this.audioContext) return this.createFallbackSound();

        return () => {
            const duration = 1.5;

            // Create dramatic entrance sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.5);
            oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + duration);

            gainNode.gain.setValueAtTime(0.5 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    generateBossPhaseChangeSound() {
        if (!this.audioContext) return this.createFallbackSound();

        return () => {
            const duration = 1.0;

            // Create phase transition sound
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.3);
            oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + duration);

            gainNode.gain.setValueAtTime(0.4 * this.sfxVolume * this.masterVolume, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }

    generateBossDefeatSound() {
        if (!this.audioContext) return this.createFallbackSound();

        return () => {
            const duration = 2.5;

            // Create epic victory sound
            const frequencies = [220, 277, 330, 440]; // A-C#-E-A chord

            frequencies.forEach((freq, index) => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime);

                const startTime = this.audioContext.currentTime + index * 0.2;
                gainNode.gain.setValueAtTime(0, startTime);
                gainNode.gain.linearRampToValueAtTime(0.3 * this.sfxVolume * this.masterVolume, startTime + 0.2);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                oscillator.start(startTime);
                oscillator.stop(startTime + duration);
            });
        };
    }

    // Placeholder methods for complex sounds (to be implemented later)
    generateSelectSound() { return this.createFallbackSound(); }
    generateEngineHum() { return this.createFallbackSound(); }
    generateSpaceAmbient() { return this.createFallbackSound(); }
    generateMenuMusic() { return this.createFallbackSound(); }
    generateGameplayMusic() { return this.createFallbackSound(); }
    generateBossMusic() { return this.createFallbackSound(); }
    generateGameOverMusic() { return this.createFallbackSound(); }
    
    // Public API methods
    playSound(soundName) {
        if (!this.enabled || !this.sounds[soundName]) return;
        
        try {
            this.sounds[soundName]();
        } catch (error) {
            console.warn(`Error playing sound ${soundName}:`, error);
        }
    }
    
    setMasterVolume(volume) {
        this.masterVolume = Utils.clamp(volume, 0, 1);
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Utils.clamp(volume, 0, 1);
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Utils.clamp(volume, 0, 1);
    }
    
    toggleAudio() {
        this.enabled = !this.enabled;
        if (!this.enabled && this.currentMusic) {
            this.stopMusic();
        }
    }
    
    playMusic(trackName) {
        // Music implementation will be added in next phase
        console.log(`Playing music: ${trackName}`);
    }
    
    stopMusic() {
        // Music implementation will be added in next phase
        console.log('Stopping music');
    }
}

// Global audio manager instance
const audioManager = new AudioManager();
