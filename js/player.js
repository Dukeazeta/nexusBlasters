// Nexus Blasters - Player Class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = GAME_CONFIG.PLAYER.SIZE;
        this.height = GAME_CONFIG.PLAYER.SIZE;
        this.speed = GAME_CONFIG.PLAYER.SPEED;
        
        // Animation properties
        this.engineFrame = 0;
        this.engineTimer = 0;
        this.engineAnimSpeed = GAME_CONFIG.PLAYER.ENGINE_ANIM_SPEED;
        
        // Combat properties (heart system) - Increased to 10 hearts maximum
        this.hearts = 6; // Start with 6 hearts
        this.maxHearts = 10; // Can accumulate up to 10 hearts
        this.shootTimer = 0;
        this.shootCooldown = 200; // milliseconds

        // Firing animation
        this.muzzleFlashTimer = 0;
        this.muzzleFlashDuration = 100; // milliseconds
        this.muzzleFlashFrame = 0;
        this.isFiring = false;
        
        // Power-up effects (redesigned system)
        this.speedBoost = 1.0;
        this.speedBoostTimer = 0;
        this.speedBoostDuration = 10000; // 10 seconds
        this.rapidFire = false;
        this.rapidFirePermanent = false; // Permanent until damage
        this.shield = false;
        this.shieldTimer = 0;
        this.shieldDuration = 10000; // 10 seconds

        // New power-ups
        this.multiShot = false;
        this.multiShotTimer = 0;
        this.multiShotDuration = 10000; // 10 seconds

        this.homingMissiles = false;
        this.homingMissilesTimer = 0;
        this.homingMissilesDuration = 10000; // 10 seconds

        this.invincibility = false;
        this.invincibilityTimer = 0;
        this.invincibilityDuration = 5000; // 5 seconds

        this.superWeapon = false;
        this.superWeaponTimer = 0;
        this.superWeaponDuration = 15000; // 15 seconds
    }
    
    update(deltaTime, inputManager, canvasWidth, canvasHeight) {
        this.updateMovement(deltaTime, inputManager, canvasWidth, canvasHeight);
        this.updateAnimation(deltaTime);
        this.updatePowerUps(deltaTime);
        this.updateShooting(deltaTime, inputManager);
        this.updateFiringAnimation(deltaTime);
        this.updateVisualEffects(deltaTime);
    }
    
    updateMovement(deltaTime, inputManager, canvasWidth, canvasHeight) {
        const moveSpeed = this.speed * this.speedBoost * (deltaTime / 1000);
        let moved = false;

        // Handle keyboard movement (always takes priority)
        const keyMovement = inputManager.getMovementInput();
        if (keyMovement.x !== 0 || keyMovement.y !== 0) {
            this.x += keyMovement.x * moveSpeed;
            this.y += keyMovement.y * moveSpeed;
            moved = true;
        }
        // Handle mouse/touch movement (only if no keyboard input and input is active)
        else if (inputManager.isInputActive()) {
            const inputPos = inputManager.getInputPosition();

            // Calculate movement towards input position
            const dx = inputPos.x - this.x;
            const dy = inputPos.y - this.y;
            const distance = Utils.distance(this.x, this.y, inputPos.x, inputPos.y);

            // Move towards input position if far enough away and input is active
            if (distance > 5) {
                const moveX = (dx / distance) * moveSpeed;
                const moveY = (dy / distance) * moveSpeed;

                this.x += moveX;
                this.y += moveY;
                moved = true;
            }
        }

        // Only apply bounds checking if we actually moved
        if (moved) {
            this.x = Utils.clamp(this.x, this.width / 2, canvasWidth - this.width / 2);
            this.y = Utils.clamp(this.y, this.height / 2, canvasHeight - this.height / 2);
        }
    }
    
    updateAnimation(deltaTime) {
        // Update engine animation
        this.engineTimer += deltaTime;
        if (this.engineTimer >= this.engineAnimSpeed) {
            this.engineFrame = (this.engineFrame + 1) % 3;
            this.engineTimer = 0;
        }
    }

    updateFiringAnimation(deltaTime) {
        // Update muzzle flash animation
        if (this.isFiring) {
            this.muzzleFlashTimer += deltaTime;

            // Animate muzzle flash frames
            if (this.muzzleFlashTimer < this.muzzleFlashDuration / 2) {
                this.muzzleFlashFrame = 1;
            } else if (this.muzzleFlashTimer < this.muzzleFlashDuration) {
                this.muzzleFlashFrame = 2;
            } else {
                this.isFiring = false;
                this.muzzleFlashTimer = 0;
                this.muzzleFlashFrame = 0;
            }
        }
    }
    
    updatePowerUps(deltaTime) {
        // Update speed boost (10 second timer)
        if (this.speedBoostTimer > 0) {
            this.speedBoostTimer -= deltaTime;
            if (this.speedBoostTimer <= 0) {
                this.speedBoost = 1.0;
            }
        }

        // Rapid fire is permanent until damage (no timer needed)
        this.rapidFire = this.rapidFirePermanent;

        // Update shield (10 second timer)
        if (this.shieldTimer > 0) {
            this.shieldTimer -= deltaTime;
            if (this.shieldTimer <= 0) {
                this.shield = false;
            }
        }
    }
    
    updateShooting(deltaTime, inputManager) {
        // Update shoot timer
        if (this.shootTimer > 0) {
            this.shootTimer -= deltaTime;
        }
        
        // Check for shooting input
        if (inputManager.isShooting() && this.shootTimer <= 0) {
            this.shoot();
            
            // Set cooldown (reduced if rapid fire is active)
            this.shootTimer = this.rapidFire ? this.shootCooldown / 2 : this.shootCooldown;
        }
    }
    
    shoot() {
        // Trigger muzzle flash animation
        this.isFiring = true;
        this.muzzleFlashTimer = 0;
        this.muzzleFlashFrame = 1;

        // Play weapon sound effect
        if (this.rapidFire) {
            audioManager.playSound('playerRapidFire');
        } else {
            audioManager.playSound('playerShoot');
        }

        // Create bullet(s) - this will be handled by the game state
        if (window.gameState) {
            // Shoot from weapon positions (left and right of ship)
            const leftWeaponX = this.x - 20;
            const rightWeaponX = this.x + 20;
            const weaponY = this.y - this.height / 2;

            if (this.rapidFire) {
                // Rapid fire mode - smaller bullets, higher rate
                window.gameState.createPlayerBullet(leftWeaponX, weaponY, 'rapid');
                window.gameState.createPlayerBullet(rightWeaponX, weaponY, 'rapid');

                // Enhanced muzzle flash effects for dual weapons
                effectsManager.muzzleFlash(leftWeaponX, weaponY, 'player');
                effectsManager.muzzleFlash(rightWeaponX, weaponY, 'player');
            } else {
                // Normal fire mode - larger bullets
                window.gameState.createPlayerBullet(this.x, weaponY, 'normal');

                // Enhanced muzzle flash effect
                effectsManager.muzzleFlash(this.x, weaponY, 'player');
            }
        }
    }

    updateVisualEffects(deltaTime) {
        // Create engine trail particles
        if (Math.random() < 0.7) { // 70% chance each frame
            effectsManager.playerEngineTrail(this.x, this.y, this.speedBoost > 1.0);
        }

        // Add shield glow effect
        if (this.shield && Math.random() < 0.3) {
            effectsManager.createGlowParticle(this.x, this.y, GAME_CONFIG.COLORS.NEXUS_ACCENT, 1.0, 0.5);
        }
    }

    takeDamage(amount = 1) {
        if (this.shield) {
            return false; // No damage taken due to shield
        }

        this.hearts -= amount;
        this.hearts = Math.max(0, this.hearts);

        // Losing a heart deactivates rapid fire
        if (this.hearts < this.maxHearts) {
            this.rapidFirePermanent = false;
        }

        return true; // Damage was taken
    }

    heal(amount = 1) {
        this.hearts += amount;
        this.hearts = Math.min(this.maxHearts, this.hearts);
    }

    applySpeedBoost() {
        this.speedBoost = 1.5;
        this.speedBoostTimer = this.speedBoostDuration;
    }

    applyRapidFire() {
        this.rapidFirePermanent = true; // Permanent until damage
    }

    applyShield() {
        this.shield = true;
        this.shieldTimer = this.shieldDuration;
    }

    getHealthPercentage() {
        return this.hearts / this.maxHearts;
    }

    isDead() {
        return this.hearts <= 0;
    }

    getHearts() {
        return this.hearts;
    }

    getMaxHearts() {
        return this.maxHearts;
    }

    getSpeedBoostTimeLeft() {
        return Math.max(0, this.speedBoostTimer);
    }

    getShieldTimeLeft() {
        return Math.max(0, this.shieldTimer);
    }
    
    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
    
    render(ctx) {
        const sprite = assetManager.getSprite('playerShip');
        if (sprite) {
            // Add glow effect for the ship
            ctx.save();
            if (this.shield) {
                // Stronger glow when shielded
                ctx.shadowColor = GAME_CONFIG.COLORS.NEXUS_GLOW;
                ctx.shadowBlur = 15;
            } else {
                // Subtle glow normally
                ctx.shadowColor = GAME_CONFIG.COLORS.VERIFICATION_GREEN;
                ctx.shadowBlur = 6;
            }

            // Draw the ship
            ctx.drawImage(sprite, this.x - this.width / 2, this.y - this.height / 2);
            ctx.restore();

            // Draw animated engine flames
            const flameSprite = assetManager.getSprite(`engineFlame${this.engineFrame + 1}`);
            if (flameSprite) {
                ctx.drawImage(flameSprite,
                    this.x - this.width / 2,
                    this.y - this.height / 2 + this.height);
            }

            // Draw muzzle flash if firing
            if (this.isFiring && this.muzzleFlashFrame > 0) {
                this.renderMuzzleFlash(ctx);
            }

            // Draw shield effect if active
            if (this.shield) {
                this.renderShield(ctx);
            }

            // Draw speed boost effect if active
            if (this.speedBoost > 1.0) {
                this.renderSpeedBoost(ctx);
            }
        } else {
            // Fallback rendering
            ctx.fillStyle = GAME_CONFIG.COLORS.NEXUS_BLUE;
            ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
    }
    
    renderShield(ctx) {
        // Draw a pulsing shield effect
        const pulseAlpha = 0.3 + 0.2 * Math.sin(Date.now() * 0.01);
        ctx.globalAlpha = pulseAlpha;
        ctx.strokeStyle = '#00ffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width / 2 + 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
    
    renderSpeedBoost(ctx) {
        // Draw speed lines behind the ship
        ctx.strokeStyle = '#ffff00';
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        
        for (let i = 0; i < 5; i++) {
            const offsetX = (Math.random() - 0.5) * this.width;
            const startY = this.y + this.height / 2 + i * 8;
            const endY = startY + 20;
            
            ctx.beginPath();
            ctx.moveTo(this.x + offsetX, startY);
            ctx.lineTo(this.x + offsetX, endY);
            ctx.stroke();
        }
        
        ctx.globalAlpha = 1.0;
    }

    renderMuzzleFlash(ctx) {
        const flashSprite = assetManager.getSprite(`playerMuzzleFlash${this.muzzleFlashFrame}`);
        if (flashSprite) {
            // Position muzzle flash at the front of the ship
            const flashX = this.x - flashSprite.width / 2;
            const flashY = this.y - this.height / 2 - flashSprite.height / 2;

            // Add slight random offset for more dynamic effect
            const offsetX = (Math.random() - 0.5) * 2;
            const offsetY = (Math.random() - 0.5) * 2;

            // Draw with slight transparency for glow effect
            ctx.globalAlpha = 0.9;
            ctx.drawImage(flashSprite, flashX + offsetX, flashY + offsetY);
            ctx.globalAlpha = 1.0;
        }
    }
}
