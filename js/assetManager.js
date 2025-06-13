// Nexus Blasters - Asset Management System
class AssetManager {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadingProgress = 0;
    }
    
    // Create all pixel art sprites programmatically
    createSprites() {
        this.createPlayerShip();
        this.createEngineFlames();
        this.createEnemyShips();
        this.createBullets();
        this.createMuzzleFlashes();
        this.createPowerUps();
        this.createHeartSystem();
        this.createParticles();
        this.createBackgroundElements();
        
        this.loaded = true;
        this.loadingProgress = 100;
    }
    
    createPlayerShip() {
        const { canvas, ctx } = Utils.createPixelCanvas(64, 64);
        
        // Ship body (blue/cyan Nexus colors)
        ctx.fillStyle = GAME_CONFIG.COLORS.NEXUS_BLUE;
        ctx.fillRect(28, 16, 8, 32);   // Main body
        ctx.fillRect(24, 24, 16, 16);  // Center section
        ctx.fillRect(26, 20, 12, 8);   // Upper body
        
        // Ship wings (larger and more detailed)
        ctx.fillStyle = GAME_CONFIG.COLORS.NEXUS_DARK;
        ctx.fillRect(12, 32, 16, 8);   // Left wing
        ctx.fillRect(36, 32, 16, 8);   // Right wing
        ctx.fillRect(8, 34, 12, 6);    // Left wing extension
        ctx.fillRect(44, 34, 12, 6);   // Right wing extension
        ctx.fillRect(16, 36, 8, 4);    // Left wing detail
        ctx.fillRect(40, 36, 8, 4);    // Right wing detail
        
        // Ship nose (more detailed)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(30, 12, 4, 8);    // White nose tip
        ctx.fillRect(28, 14, 8, 6);    // Nose extension
        ctx.fillRect(26, 18, 12, 4);   // Nose base
        
        // Engine housings
        ctx.fillStyle = '#2d5aa0';
        ctx.fillRect(22, 48, 6, 12);   // Left engine housing
        ctx.fillRect(36, 48, 6, 12);   // Right engine housing
        
        // Cockpit (more detailed)
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(26, 18, 12, 12);
        ctx.fillStyle = '#add8e6';
        ctx.fillRect(28, 20, 8, 8);    // Cockpit glass
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(30, 22, 4, 4);    // Cockpit reflection
        
        // Wing weapons and details
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(18, 28, 6, 2);    // Left wing detail
        ctx.fillRect(40, 28, 6, 2);    // Right wing detail
        ctx.fillRect(12, 38, 3, 2);    // Left weapon
        ctx.fillRect(49, 38, 3, 2);    // Right weapon
        ctx.fillRect(14, 30, 2, 6);    // Left wing stripe
        ctx.fillRect(48, 30, 2, 6);    // Right wing stripe
        
        // Additional hull details
        ctx.fillStyle = GAME_CONFIG.COLORS.NEXUS_DARK;
        ctx.fillRect(30, 42, 4, 2);    // Hull line
        ctx.fillRect(24, 30, 3, 12);   // Left hull detail
        ctx.fillRect(37, 30, 3, 12);   // Right hull detail
        ctx.fillRect(28, 44, 8, 2);    // Lower hull detail
        
        // Hull highlights
        ctx.fillStyle = GAME_CONFIG.COLORS.NEXUS_LIGHT;
        ctx.fillRect(26, 26, 2, 16);   // Left highlight
        ctx.fillRect(36, 26, 2, 16);   // Right highlight
        
        this.sprites.playerShip = canvas;
    }
    
    createEngineFlames() {
        // Engine flame frame 1
        const { canvas: flame1, ctx: f1Ctx } = Utils.createPixelCanvas(64, 20);
        
        // Left engine flame
        f1Ctx.fillStyle = '#00ffff';
        f1Ctx.fillRect(24, 0, 4, 12);
        f1Ctx.fillStyle = '#ffffff';
        f1Ctx.fillRect(25, 0, 2, 8);
        f1Ctx.fillStyle = '#88ffff';
        f1Ctx.fillRect(23, 8, 6, 4);
        
        // Right engine flame
        f1Ctx.fillStyle = '#00ffff';
        f1Ctx.fillRect(36, 0, 4, 12);
        f1Ctx.fillStyle = '#ffffff';
        f1Ctx.fillRect(37, 0, 2, 8);
        f1Ctx.fillStyle = '#88ffff';
        f1Ctx.fillRect(35, 8, 6, 4);
        
        this.sprites.engineFlame1 = flame1;
        
        // Engine flame frame 2 (longer)
        const { canvas: flame2, ctx: f2Ctx } = Utils.createPixelCanvas(64, 20);
        
        // Left engine flame
        f2Ctx.fillStyle = '#00ffff';
        f2Ctx.fillRect(24, 0, 4, 16);
        f2Ctx.fillStyle = '#ffffff';
        f2Ctx.fillRect(25, 0, 2, 12);
        f2Ctx.fillStyle = '#88ffff';
        f2Ctx.fillRect(22, 12, 8, 4);
        
        // Right engine flame
        f2Ctx.fillStyle = '#00ffff';
        f2Ctx.fillRect(36, 0, 4, 16);
        f2Ctx.fillStyle = '#ffffff';
        f2Ctx.fillRect(37, 0, 2, 12);
        f2Ctx.fillStyle = '#88ffff';
        f2Ctx.fillRect(34, 12, 8, 4);
        
        this.sprites.engineFlame2 = flame2;
        
        // Engine flame frame 3 (shorter, different shape)
        const { canvas: flame3, ctx: f3Ctx } = Utils.createPixelCanvas(64, 20);
        
        // Left engine flame
        f3Ctx.fillStyle = '#00ffff';
        f3Ctx.fillRect(23, 0, 6, 10);
        f3Ctx.fillStyle = '#ffffff';
        f3Ctx.fillRect(25, 0, 2, 6);
        f3Ctx.fillStyle = '#88ffff';
        f3Ctx.fillRect(24, 6, 4, 4);
        
        // Right engine flame
        f3Ctx.fillStyle = '#00ffff';
        f3Ctx.fillRect(35, 0, 6, 10);
        f3Ctx.fillStyle = '#ffffff';
        f3Ctx.fillRect(37, 0, 2, 6);
        f3Ctx.fillStyle = '#88ffff';
        f3Ctx.fillRect(36, 6, 4, 4);
        
        this.sprites.engineFlame3 = flame3;
    }
    
    createEnemyShips() {
        // Enemy Type 1: Basic Scout (36x36 - 50% larger)
        const { canvas: scout, ctx: scoutCtx } = Utils.createPixelCanvas(36, 36);

        // Red enemy ship (scaled up)
        scoutCtx.fillStyle = '#ff4444';
        scoutCtx.fillRect(15, 6, 6, 18);    // Main body
        scoutCtx.fillRect(12, 12, 12, 6);   // Wings
        scoutCtx.fillStyle = '#aa0000';
        scoutCtx.fillRect(16, 3, 4, 6);     // Nose
        scoutCtx.fillStyle = '#ffaa00';
        scoutCtx.fillRect(13, 24, 3, 5);    // Left engine
        scoutCtx.fillRect(20, 24, 3, 5);    // Right engine

        // Additional details for larger size
        scoutCtx.fillStyle = '#ffffff';
        scoutCtx.fillRect(17, 8, 2, 2);     // Cockpit
        scoutCtx.fillStyle = '#cc2222';
        scoutCtx.fillRect(14, 14, 2, 4);    // Left wing detail
        scoutCtx.fillRect(20, 14, 2, 4);    // Right wing detail

        this.sprites.enemyScout = scout;

        // Enemy Type 2: Heavy Fighter (48x42 - 50% larger)
        const { canvas: fighter, ctx: fighterCtx } = Utils.createPixelCanvas(48, 42);

        // Purple enemy ship (scaled up)
        fighterCtx.fillStyle = '#8844ff';
        fighterCtx.fillRect(18, 6, 12, 24);  // Main body
        fighterCtx.fillRect(12, 15, 24, 9);  // Wide wings
        fighterCtx.fillStyle = '#4400aa';
        fighterCtx.fillRect(21, 3, 6, 6);    // Nose
        fighterCtx.fillStyle = '#ff4400';
        fighterCtx.fillRect(15, 30, 4, 6);   // Left engine
        fighterCtx.fillRect(29, 30, 4, 6);   // Right engine

        // Additional details for larger size
        fighterCtx.fillStyle = '#aa66ff';
        fighterCtx.fillRect(20, 12, 8, 6);   // Center section
        fighterCtx.fillStyle = '#ffffff';
        fighterCtx.fillRect(22, 9, 4, 3);    // Cockpit
        fighterCtx.fillStyle = '#6622cc';
        fighterCtx.fillRect(14, 18, 4, 6);   // Left wing detail
        fighterCtx.fillRect(30, 18, 4, 6);   // Right wing detail

        this.sprites.enemyFighter = fighter;
    }
    
    createBullets() {
        // Player bullet (enhanced)
        const { canvas: playerBullet, ctx: pbCtx } = Utils.createPixelCanvas(6, 12);

        // Main bullet body
        pbCtx.fillStyle = '#00ffff';
        pbCtx.fillRect(2, 0, 2, 12);
        pbCtx.fillRect(1, 2, 4, 8);

        // Bullet core (bright white)
        pbCtx.fillStyle = '#ffffff';
        pbCtx.fillRect(2, 0, 2, 6);

        // Energy trail
        pbCtx.fillStyle = '#88ffff';
        pbCtx.fillRect(1, 8, 4, 4);

        this.sprites.playerBullet = playerBullet;

        // Player rapid fire bullet (smaller, faster)
        const { canvas: rapidBullet, ctx: rbCtx } = Utils.createPixelCanvas(4, 8);

        rbCtx.fillStyle = '#ffff00';
        rbCtx.fillRect(1, 0, 2, 8);
        rbCtx.fillStyle = '#ffffff';
        rbCtx.fillRect(1, 0, 2, 4);

        this.sprites.playerRapidBullet = rapidBullet;

        // Enemy bullet
        const { canvas: enemyBullet, ctx: ebCtx } = Utils.createPixelCanvas(4, 8);

        ebCtx.fillStyle = '#ff4444';
        ebCtx.fillRect(1, 0, 2, 8);
        ebCtx.fillStyle = '#ffaa00';
        ebCtx.fillRect(1, 0, 2, 4);

        this.sprites.enemyBullet = enemyBullet;

        // Enemy heavy bullet
        const { canvas: heavyBullet, ctx: hbCtx } = Utils.createPixelCanvas(6, 10);

        hbCtx.fillStyle = '#aa0000';
        hbCtx.fillRect(1, 0, 4, 10);
        hbCtx.fillStyle = '#ff4444';
        hbCtx.fillRect(2, 0, 2, 8);
        hbCtx.fillStyle = '#ffaa00';
        hbCtx.fillRect(2, 0, 2, 4);

        this.sprites.enemyHeavyBullet = heavyBullet;
    }

    createMuzzleFlashes() {
        // Player muzzle flash frame 1
        const { canvas: flash1, ctx: f1Ctx } = Utils.createPixelCanvas(16, 12);

        // Bright center
        f1Ctx.fillStyle = '#ffffff';
        f1Ctx.fillRect(6, 4, 4, 4);

        // Cyan glow
        f1Ctx.fillStyle = '#00ffff';
        f1Ctx.fillRect(4, 2, 8, 8);
        f1Ctx.fillRect(2, 4, 12, 4);

        // Outer glow
        f1Ctx.fillStyle = '#88ffff';
        f1Ctx.fillRect(1, 5, 14, 2);
        f1Ctx.fillRect(5, 1, 6, 10);

        this.sprites.playerMuzzleFlash1 = flash1;

        // Player muzzle flash frame 2 (larger)
        const { canvas: flash2, ctx: f2Ctx } = Utils.createPixelCanvas(20, 16);

        // Bright center
        f2Ctx.fillStyle = '#ffffff';
        f2Ctx.fillRect(8, 6, 4, 4);

        // Cyan glow
        f2Ctx.fillStyle = '#00ffff';
        f2Ctx.fillRect(6, 4, 8, 8);
        f2Ctx.fillRect(4, 6, 12, 4);

        // Outer glow
        f2Ctx.fillStyle = '#88ffff';
        f2Ctx.fillRect(2, 7, 16, 2);
        f2Ctx.fillRect(7, 2, 6, 12);

        // Extended rays
        f2Ctx.fillStyle = '#44ffff';
        f2Ctx.fillRect(0, 7, 20, 2);
        f2Ctx.fillRect(9, 0, 2, 16);

        this.sprites.playerMuzzleFlash2 = flash2;

        // Enemy muzzle flash
        const { canvas: enemyFlash, ctx: efCtx } = Utils.createPixelCanvas(12, 10);

        // Bright center
        efCtx.fillStyle = '#ffffff';
        efCtx.fillRect(4, 3, 4, 4);

        // Red glow
        efCtx.fillStyle = '#ff4444';
        efCtx.fillRect(2, 1, 8, 8);
        efCtx.fillRect(1, 3, 10, 4);

        // Orange outer glow
        efCtx.fillStyle = '#ffaa44';
        efCtx.fillRect(0, 4, 12, 2);
        efCtx.fillRect(4, 0, 4, 10);

        this.sprites.enemyMuzzleFlash = enemyFlash;
    }
    
    createPowerUps() {
        // Health power-up (redesigned heart)
        const { canvas: health, ctx: healthCtx } = Utils.createPixelCanvas(20, 20);

        // Heart shape
        healthCtx.fillStyle = '#ff4444';
        // Top curves
        healthCtx.fillRect(4, 6, 4, 4);   // Left curve
        healthCtx.fillRect(12, 6, 4, 4);  // Right curve
        // Main body
        healthCtx.fillRect(2, 8, 16, 6);
        healthCtx.fillRect(4, 14, 12, 4);
        healthCtx.fillRect(6, 18, 8, 2);

        // Heart highlight
        healthCtx.fillStyle = '#ff8888';
        healthCtx.fillRect(5, 7, 2, 2);   // Left highlight
        healthCtx.fillRect(13, 7, 2, 2);  // Right highlight
        healthCtx.fillRect(4, 9, 12, 2);  // Center highlight

        // Glow effect
        healthCtx.fillStyle = '#ffaaaa';
        healthCtx.fillRect(3, 7, 1, 8);   // Left glow
        healthCtx.fillRect(16, 7, 1, 8);  // Right glow

        this.sprites.healthPowerUp = health;

        // Speed power-up (redesigned with wings)
        const { canvas: speed, ctx: speedCtx } = Utils.createPixelCanvas(20, 20);

        // Wing design
        speedCtx.fillStyle = '#ffff00';
        // Main wings
        speedCtx.fillRect(2, 8, 6, 4);    // Left wing
        speedCtx.fillRect(12, 8, 6, 4);   // Right wing
        speedCtx.fillRect(6, 6, 8, 8);    // Center body

        // Wing details
        speedCtx.fillStyle = '#ffffff';
        speedCtx.fillRect(3, 9, 4, 2);    // Left wing highlight
        speedCtx.fillRect(13, 9, 4, 2);   // Right wing highlight
        speedCtx.fillRect(8, 8, 4, 4);    // Center highlight

        // Speed lines
        speedCtx.fillStyle = '#ffff88';
        speedCtx.fillRect(1, 10, 2, 1);   // Left speed line
        speedCtx.fillRect(17, 10, 2, 1);  // Right speed line

        this.sprites.speedPowerUp = speed;

        // Rapid Fire power-up (redesigned with bullets)
        const { canvas: rapidFire, ctx: rfCtx } = Utils.createPixelCanvas(20, 20);

        // Multiple bullets design
        rfCtx.fillStyle = '#00ffff';
        // Three bullets
        rfCtx.fillRect(6, 2, 2, 6);       // Top bullet
        rfCtx.fillRect(12, 2, 2, 6);      // Top right bullet
        rfCtx.fillRect(9, 6, 2, 6);       // Center bullet
        rfCtx.fillRect(3, 10, 2, 6);      // Bottom left bullet
        rfCtx.fillRect(15, 10, 2, 6);     // Bottom right bullet

        // Bullet highlights
        rfCtx.fillStyle = '#ffffff';
        rfCtx.fillRect(6, 2, 2, 3);       // Top bullet highlight
        rfCtx.fillRect(12, 2, 2, 3);      // Top right highlight
        rfCtx.fillRect(9, 6, 2, 3);       // Center highlight

        this.sprites.rapidFirePowerUp = rapidFire;

        // Shield power-up (redesigned with hexagon)
        const { canvas: shield, ctx: shieldCtx } = Utils.createPixelCanvas(20, 20);

        // Hexagonal shield
        shieldCtx.fillStyle = '#00aaff';
        // Hexagon shape
        shieldCtx.fillRect(6, 4, 8, 2);   // Top
        shieldCtx.fillRect(4, 6, 12, 8);  // Middle
        shieldCtx.fillRect(6, 14, 8, 2);  // Bottom

        // Shield energy
        shieldCtx.fillStyle = '#88ddff';
        shieldCtx.fillRect(7, 5, 6, 1);   // Top energy
        shieldCtx.fillRect(5, 7, 10, 6);  // Center energy
        shieldCtx.fillRect(7, 14, 6, 1);  // Bottom energy

        // Shield core
        shieldCtx.fillStyle = '#ffffff';
        shieldCtx.fillRect(8, 8, 4, 4);   // Bright core

        this.sprites.shieldPowerUp = shield;
    }

    createHeartSystem() {
        // Full heart
        const { canvas: fullHeart, ctx: fhCtx } = Utils.createPixelCanvas(16, 16);

        // Heart shape
        fhCtx.fillStyle = '#ff4444';
        // Top curves
        fhCtx.fillRect(2, 4, 4, 3);       // Left curve
        fhCtx.fillRect(10, 4, 4, 3);      // Right curve
        // Main body
        fhCtx.fillRect(1, 6, 14, 5);
        fhCtx.fillRect(3, 11, 10, 3);
        fhCtx.fillRect(5, 14, 6, 1);

        // Heart highlight
        fhCtx.fillStyle = '#ff8888';
        fhCtx.fillRect(3, 5, 2, 2);       // Left highlight
        fhCtx.fillRect(11, 5, 2, 2);      // Right highlight
        fhCtx.fillRect(2, 7, 12, 2);      // Center highlight

        this.sprites.heartFull = fullHeart;

        // Empty heart
        const { canvas: emptyHeart, ctx: ehCtx } = Utils.createPixelCanvas(16, 16);

        // Heart outline only
        ehCtx.fillStyle = '#666666';
        // Outline
        ehCtx.fillRect(2, 4, 1, 3);       // Left outline
        ehCtx.fillRect(6, 4, 1, 1);       // Left top
        ehCtx.fillRect(9, 4, 1, 1);       // Right top
        ehCtx.fillRect(13, 4, 1, 3);      // Right outline
        ehCtx.fillRect(1, 6, 1, 5);       // Left side
        ehCtx.fillRect(14, 6, 1, 5);      // Right side
        ehCtx.fillRect(3, 11, 1, 3);      // Left bottom
        ehCtx.fillRect(12, 11, 1, 3);     // Right bottom
        ehCtx.fillRect(5, 14, 6, 1);      // Bottom

        this.sprites.heartEmpty = emptyHeart;
    }
    
    createParticles() {
        // Explosion particle
        const { canvas: explosion, ctx: expCtx } = Utils.createPixelCanvas(8, 8);
        
        expCtx.fillStyle = '#ffaa00';
        expCtx.fillRect(2, 2, 4, 4);
        expCtx.fillStyle = '#ff4400';
        expCtx.fillRect(3, 3, 2, 2);
        
        this.sprites.explosionParticle = explosion;
        
        // Star particle
        const { canvas: star, ctx: starCtx } = Utils.createPixelCanvas(4, 4);
        
        starCtx.fillStyle = '#ffffff';
        starCtx.fillRect(1, 0, 2, 4);  // Vertical
        starCtx.fillRect(0, 1, 4, 2);  // Horizontal
        
        this.sprites.starParticle = star;
    }

    createBackgroundElements() {
        // Create different types of stars
        const { canvas: bgStar1, ctx: bg1Ctx } = Utils.createPixelCanvas(2, 2);
        bg1Ctx.fillStyle = '#ffffff';
        bg1Ctx.fillRect(0, 0, 2, 2);
        this.sprites.bgStar1 = bgStar1;

        const { canvas: bgStar2, ctx: bg2Ctx } = Utils.createPixelCanvas(3, 3);
        bg2Ctx.fillStyle = '#cccccc';
        bg2Ctx.fillRect(1, 0, 1, 3);
        bg2Ctx.fillRect(0, 1, 3, 1);
        this.sprites.bgStar2 = bgStar2;

        const { canvas: bgStar3, ctx: bg3Ctx } = Utils.createPixelCanvas(4, 4);
        bg3Ctx.fillStyle = '#aaaaaa';
        bg3Ctx.fillRect(1, 0, 2, 4);
        bg3Ctx.fillRect(0, 1, 4, 2);
        bg3Ctx.fillStyle = '#ffffff';
        bg3Ctx.fillRect(1, 1, 2, 2);
        this.sprites.bgStar3 = bgStar3;

        // Twinkling star
        const { canvas: twinkleStar, ctx: twinkleCtx } = Utils.createPixelCanvas(5, 5);
        twinkleCtx.fillStyle = '#ffff88';
        twinkleCtx.fillRect(2, 0, 1, 5);
        twinkleCtx.fillRect(0, 2, 5, 1);
        twinkleCtx.fillStyle = '#ffffff';
        twinkleCtx.fillRect(2, 2, 1, 1);
        this.sprites.twinkleStar = twinkleStar;

        // Nexus nodes (smaller, more subtle)
        const { canvas: nexusNode, ctx: nodeCtx } = Utils.createPixelCanvas(8, 8);

        // Hexagonal node
        nodeCtx.fillStyle = GAME_CONFIG.COLORS.NEXUS_BLUE;
        nodeCtx.fillRect(2, 1, 4, 1);   // Top
        nodeCtx.fillRect(1, 2, 6, 4);   // Middle
        nodeCtx.fillRect(2, 6, 4, 1);   // Bottom
        nodeCtx.fillStyle = '#87ceeb';
        nodeCtx.fillRect(3, 3, 2, 2);   // Center

        this.sprites.nexusNode = nexusNode;
    }

    getSprite(name) {
        return this.sprites[name] || null;
    }
}

// Global asset manager instance
const assetManager = new AssetManager();
