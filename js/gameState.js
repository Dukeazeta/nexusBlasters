// Nexus Blasters - Game State Management
class GameState {
    constructor() {
        this.state = 'loading'; // loading, menu, playing, paused, gameOver
        this.score = 0;
        this.wave = 1;
        this.kills = 0;
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.particles = [];
        
        // Timers
        this.enemySpawnTimer = 0;
        this.enemySpawnRate = GAME_CONFIG.ENEMY.SPAWN_RATE;
        this.waveTimer = 0;
        this.powerUpSpawnTimer = 0;
        this.powerUpSpawnRate = 15000; // 15 seconds
        
        // Make this globally accessible for other classes
        window.gameState = this;
    }
    
    startGame(canvasWidth, canvasHeight) {
        this.state = 'playing';
        this.score = 0;
        this.wave = 1;
        this.kills = 0;
        
        // Initialize player
        this.player = new Player(canvasWidth / 2, canvasHeight - 80);
        
        // Clear arrays
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.particles = [];
        
        // Reset timers
        this.enemySpawnTimer = 0;
        this.waveTimer = 0;
        this.powerUpSpawnTimer = 0;
    }
    
    update(deltaTime, inputManager, canvasWidth, canvasHeight) {
        if (this.state !== 'playing') return;
        
        // Handle pause input
        if (inputManager.isPausePressed()) {
            this.pauseGame();
            return;
        }
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime, inputManager, canvasWidth, canvasHeight);
            
            // Check if player is dead
            if (this.player.isDead()) {
                this.gameOver();
                return;
            }
        }
        
        // Spawn enemies
        this.updateEnemySpawning(deltaTime, canvasWidth);
        
        // Spawn power-ups
        this.updatePowerUpSpawning(deltaTime, canvasWidth);
        
        // Update game objects
        this.updateEnemies(deltaTime);
        this.updateBullets(deltaTime, canvasWidth, canvasHeight);
        this.updatePowerUps(deltaTime, canvasHeight);
        this.updateParticles(deltaTime);
        
        // Check collisions
        this.checkCollisions();
        
        // Update wave progression
        this.updateWaveProgression(deltaTime);
    }
    
    updateEnemySpawning(deltaTime, canvasWidth) {
        this.enemySpawnTimer += deltaTime;
        
        if (this.enemySpawnTimer >= this.enemySpawnRate) {
            this.spawnEnemy(canvasWidth);
            this.enemySpawnTimer = 0;
            
            // Increase spawn rate slightly each wave
            this.enemySpawnRate = Math.max(1000, GAME_CONFIG.ENEMY.SPAWN_RATE - (this.wave * 100));
        }
    }
    
    updatePowerUpSpawning(deltaTime, canvasWidth) {
        this.powerUpSpawnTimer += deltaTime;
        
        if (this.powerUpSpawnTimer >= this.powerUpSpawnRate) {
            this.spawnPowerUp(canvasWidth);
            this.powerUpSpawnTimer = 0;
        }
    }
    
    spawnEnemy(canvasWidth) {
        const x = Utils.randomFloat(50, canvasWidth - 50);
        const y = -50;
        const type = Math.random() < 0.7 ? 'scout' : 'fighter';
        
        this.enemies.push(new Enemy(x, y, type));
    }
    
    spawnPowerUp(canvasWidth) {
        const x = Utils.randomFloat(50, canvasWidth - 50);
        const y = -20;

        // Weighted power-up distribution
        const rand = Math.random();
        let type;
        if (rand < 0.4) {
            type = 'health';      // 40% chance
        } else if (rand < 0.65) {
            type = 'speed';       // 25% chance
        } else if (rand < 0.85) {
            type = 'rapidFire';   // 20% chance
        } else {
            type = 'shield';      // 15% chance
        }

        this.powerUps.push(new PowerUp(x, y, type));
    }
    
    updateEnemies(deltaTime) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (!enemy.active) {
                this.enemies.splice(i, 1);
                continue;
            }
            
            enemy.update(deltaTime, this.player?.x || 0, this.player?.y || 0);
            
            // Remove enemies that are off screen
            if (enemy.y > window.innerHeight + 100) {
                this.enemies.splice(i, 1);
            }
        }
    }
    
    updateBullets(deltaTime, canvasWidth, canvasHeight) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            if (!bullet.active) {
                this.bullets.splice(i, 1);
                continue;
            }
            
            bullet.update(deltaTime);
            
            // Remove bullets that are off screen
            if (bullet.isOffScreen(canvasWidth, canvasHeight)) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    updatePowerUps(deltaTime, canvasHeight) {
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (!powerUp.active) {
                this.powerUps.splice(i, 1);
                continue;
            }
            
            powerUp.update(deltaTime);
            
            // Remove power-ups that are off screen
            if (powerUp.y > canvasHeight + 50) {
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    updateParticles(deltaTime) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            if (!particle.active) {
                this.particles.splice(i, 1);
                continue;
            }
            
            particle.update(deltaTime);
        }
    }
    
    checkCollisions() {
        if (!this.player) return;
        
        const playerBounds = this.player.getBounds();
        
        // Player vs Enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            const enemyBounds = enemy.getBounds();

            if (Utils.rectCollision(playerBounds, enemyBounds)) {
                this.player.takeDamage(1); // Take 1 heart of damage
                this.createExplosion(enemy.x, enemy.y);
                this.enemies.splice(i, 1);
                break;
            }
        }

        // Player vs Enemy Bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.type !== 'enemy') continue;

            const bulletBounds = bullet.getBounds();

            if (Utils.rectCollision(playerBounds, bulletBounds)) {
                this.player.takeDamage(1); // Take 1 heart of damage
                this.createExplosion(bullet.x, bullet.y);
                this.bullets.splice(i, 1);
                break;
            }
        }
        
        // Player Bullets vs Enemies
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            if (bullet.type !== 'player') continue;
            
            const bulletBounds = bullet.getBounds();
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                const enemyBounds = enemy.getBounds();
                
                if (Utils.rectCollision(bulletBounds, enemyBounds)) {
                    if (enemy.takeDamage(bullet.damage)) {
                        this.score += enemy.points;
                        this.kills++;
                        this.createExplosion(enemy.x, enemy.y);
                        this.enemies.splice(j, 1);
                    }
                    this.bullets.splice(i, 1);
                    break;
                }
            }
        }
        
        // Player vs Power-ups
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            const powerUpBounds = powerUp.getBounds();
            
            if (Utils.rectCollision(playerBounds, powerUpBounds)) {
                powerUp.applyEffect(this.player);
                this.powerUps.splice(i, 1);
            }
        }
    }
    
    updateWaveProgression(deltaTime) {
        this.waveTimer += deltaTime;

        // New wave every 30 seconds
        if (this.waveTimer >= 30000) {
            this.wave++;
            this.waveTimer = 0;

            // Update enemy fire rates for new wave
            this.updateEnemyFireRates();
        }
    }

    updateEnemyFireRates() {
        // Update fire rates for all existing enemies
        this.enemies.forEach(enemy => {
            enemy.shootCooldown = enemy.getFireRate();
        });
    }
    
    createPlayerBullet(x, y, bulletType = 'normal') {
        const bullet = new Bullet(x, y, 0, -GAME_CONFIG.BULLET.PLAYER_SPEED, 'player', bulletType);
        this.bullets.push(bullet);
    }

    createEnemyBullet(x, y, velocityX, velocityY, bulletType = 'normal') {
        const bullet = new Bullet(x, y, velocityX, velocityY, 'enemy', bulletType);
        this.bullets.push(bullet);
    }
    
    createExplosion(x, y) {
        for (let i = 0; i < 8; i++) {
            const velocityX = Utils.randomFloat(-100, 100);
            const velocityY = Utils.randomFloat(-100, 100);
            const particle = new Particle(x, y, velocityX, velocityY, 'explosion');
            this.particles.push(particle);
        }
    }
    
    pauseGame() {
        this.state = 'paused';
    }
    
    resumeGame() {
        this.state = 'playing';
    }
    
    gameOver() {
        this.state = 'gameOver';
    }
    
    showMainMenu() {
        this.state = 'menu';
    }
    
    render(ctx) {
        // Render all game objects
        if (this.player) {
            this.player.render(ctx);
        }
        
        this.enemies.forEach(enemy => enemy.render(ctx));
        this.bullets.forEach(bullet => bullet.render(ctx));
        this.powerUps.forEach(powerUp => powerUp.render(ctx));
        this.particles.forEach(particle => particle.render(ctx));
    }
}
