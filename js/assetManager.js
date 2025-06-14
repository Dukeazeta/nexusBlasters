// Nexus Blasters - Asset Management System
class AssetManager {
    constructor() {
        this.sprites = {};
        this.loaded = false;
        this.loadingProgress = 0;
    }
    
    // Create all pixel art sprites programmatically
    createSprites() {
        try {
            console.log('Creating player ship...');
            this.createPlayerShip();
            console.log('Creating engine flames...');
            this.createEngineFlames();
            console.log('Creating enemy ships...');
            this.createEnemyShips();
            console.log('Creating bullets...');
            this.createBullets();
            console.log('Creating muzzle flashes...');
            this.createMuzzleFlashes();
            console.log('Creating power-ups...');
            this.createPowerUps();
            console.log('Creating heart system...');
            this.createHeartSystem();
            console.log('Creating particles...');
            this.createParticles();
            console.log('Creating background elements...');
            this.createBackgroundElements();

            this.loaded = true;
            this.loadingProgress = 100;
            console.log('All sprites created successfully');
        } catch (error) {
            console.error('Error creating sprites:', error);
            throw error;
        }
    }
    
    createPlayerShip() {
        const { canvas, ctx } = Utils.createPixelCanvas(64, 64);
        
        // Verification Node body (official Nexus colors)
        ctx.fillStyle = GAME_CONFIG.COLORS.NEXUS_ACCENT;
        ctx.fillRect(28, 16, 8, 32);   // Main verification core
        ctx.fillRect(24, 24, 16, 16);  // Processing center
        ctx.fillRect(26, 20, 12, 8);   // Upper computation unit
        
        // Network connection arrays (larger and more detailed)
        ctx.fillStyle = GAME_CONFIG.COLORS.NEXUS_PRIMARY;
        ctx.fillRect(12, 32, 16, 8);   // Left network array
        ctx.fillRect(36, 32, 16, 8);   // Right network array
        ctx.fillRect(8, 34, 12, 6);    // Left array extension
        ctx.fillRect(44, 34, 12, 6);   // Right array extension
        ctx.fillRect(16, 36, 8, 4);    // Left connection detail
        ctx.fillRect(40, 36, 8, 4);    // Right connection detail
        
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
        
        // Verification indicators
        ctx.fillStyle = GAME_CONFIG.COLORS.VERIFICATION_GREEN;
        ctx.fillRect(26, 26, 2, 16);   // Left verification strip
        ctx.fillRect(36, 26, 2, 16);   // Right verification strip
        
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
        // Malicious Agent Type 1: Protocol Disruptor (36x36 - 50% larger)
        const { canvas: scout, ctx: scoutCtx } = Utils.createPixelCanvas(36, 36);

        // Threat-red malicious agent (scaled up)
        scoutCtx.fillStyle = GAME_CONFIG.COLORS.THREAT_RED;
        scoutCtx.fillRect(15, 6, 6, 18);    // Main body
        scoutCtx.fillRect(12, 12, 12, 6);   // Wings
        scoutCtx.fillStyle = '#aa0000';
        scoutCtx.fillRect(16, 3, 4, 6);     // Attack vector
        scoutCtx.fillStyle = '#ffaa00';
        scoutCtx.fillRect(13, 24, 3, 5);    // Left disruptor
        scoutCtx.fillRect(20, 24, 3, 5);    // Right disruptor

        // Malicious indicators
        scoutCtx.fillStyle = '#ff8888';
        scoutCtx.fillRect(17, 8, 2, 2);     // Threat scanner
        scoutCtx.fillStyle = '#cc2222';
        scoutCtx.fillRect(14, 14, 2, 4);    // Left attack module
        scoutCtx.fillRect(20, 14, 2, 4);    // Right attack module

        this.sprites.enemyScout = scout;

        // Malicious Agent Type 2: Consensus Breaker (48x42 - 50% larger)
        const { canvas: fighter, ctx: fighterCtx } = Utils.createPixelCanvas(48, 42);

        // Dark purple consensus threat (scaled up)
        fighterCtx.fillStyle = '#8844ff';
        fighterCtx.fillRect(18, 6, 12, 24);  // Main body
        fighterCtx.fillRect(12, 15, 24, 9);  // Wide attack wings
        fighterCtx.fillStyle = '#4400aa';
        fighterCtx.fillRect(21, 3, 6, 6);    // Breach vector
        fighterCtx.fillStyle = GAME_CONFIG.COLORS.THREAT_RED;
        fighterCtx.fillRect(15, 30, 4, 6);   // Left breach engine
        fighterCtx.fillRect(29, 30, 4, 6);   // Right breach engine

        // Consensus attack systems
        fighterCtx.fillStyle = '#aa66ff';
        fighterCtx.fillRect(20, 12, 8, 6);   // Attack core
        fighterCtx.fillStyle = '#ff8888';
        fighterCtx.fillRect(22, 9, 4, 3);    // Threat processor
        fighterCtx.fillStyle = '#6622cc';
        fighterCtx.fillRect(14, 18, 4, 6);   // Left breach module
        fighterCtx.fillRect(30, 18, 4, 6);   // Right breach module

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
        // Node Integrity Restoration (redesigned with Nexus hexagon)
        const { canvas: health, ctx: healthCtx } = Utils.createPixelCanvas(20, 20);

        // Hexagonal integrity symbol
        healthCtx.fillStyle = GAME_CONFIG.COLORS.VERIFICATION_GREEN;
        // Hexagon shape
        healthCtx.fillRect(6, 4, 8, 2);   // Top
        healthCtx.fillRect(4, 6, 12, 8);  // Middle
        healthCtx.fillRect(6, 14, 8, 2);  // Bottom

        // Inner cross for restoration
        healthCtx.fillStyle = '#ffffff';
        healthCtx.fillRect(8, 6, 4, 8);   // Vertical
        healthCtx.fillRect(6, 8, 8, 4);   // Horizontal

        // Glow effect
        healthCtx.fillStyle = GAME_CONFIG.COLORS.NEXUS_GLOW;
        healthCtx.fillRect(5, 5, 1, 10);  // Left glow
        healthCtx.fillRect(14, 5, 1, 10); // Right glow

        this.sprites.healthPowerUp = health;

        // Velocity Boost (redesigned with network acceleration)
        const { canvas: speed, ctx: speedCtx } = Utils.createPixelCanvas(20, 20);

        // Network acceleration symbol
        speedCtx.fillStyle = GAME_CONFIG.COLORS.PROOF_GOLD;
        // Arrow design pointing forward
        speedCtx.fillRect(2, 8, 12, 4);   // Main arrow body
        speedCtx.fillRect(14, 6, 4, 8);   // Arrow head
        speedCtx.fillRect(16, 4, 2, 12);  // Arrow tip

        // Speed trails
        speedCtx.fillStyle = '#ffffff';
        speedCtx.fillRect(4, 9, 8, 2);    // Center highlight
        speedCtx.fillRect(1, 7, 3, 1);    // Top trail
        speedCtx.fillRect(1, 12, 3, 1);   // Bottom trail

        // Velocity lines
        speedCtx.fillStyle = GAME_CONFIG.COLORS.NEXUS_GLOW;
        speedCtx.fillRect(0, 9, 2, 2);    // Trail effect

        this.sprites.speedPowerUp = speed;

        // Proof Burst (redesigned with verification symbols)
        const { canvas: rapidFire, ctx: rfCtx } = Utils.createPixelCanvas(20, 20);

        // Multiple proof fragments
        rfCtx.fillStyle = GAME_CONFIG.COLORS.NEXUS_GLOW;
        // Proof fragment pattern
        rfCtx.fillRect(6, 2, 2, 6);       // Top fragment
        rfCtx.fillRect(12, 2, 2, 6);      // Top right fragment
        rfCtx.fillRect(9, 6, 2, 6);       // Center fragment
        rfCtx.fillRect(3, 10, 2, 6);      // Bottom left fragment
        rfCtx.fillRect(15, 10, 2, 6);     // Bottom right fragment

        // Verification highlights
        rfCtx.fillStyle = GAME_CONFIG.COLORS.VERIFICATION_GREEN;
        rfCtx.fillRect(6, 2, 2, 3);       // Top verification
        rfCtx.fillRect(12, 2, 2, 3);      // Top right verification
        rfCtx.fillRect(9, 6, 2, 3);       // Center verification

        this.sprites.rapidFirePowerUp = rapidFire;

        // Consensus Shield (redesigned with network protection)
        const { canvas: shield, ctx: shieldCtx } = Utils.createPixelCanvas(20, 20);

        // Consensus protection hexagon
        shieldCtx.fillStyle = GAME_CONFIG.COLORS.NEXUS_ACCENT;
        // Hexagon shape
        shieldCtx.fillRect(6, 4, 8, 2);   // Top
        shieldCtx.fillRect(4, 6, 12, 8);  // Middle
        shieldCtx.fillRect(6, 14, 8, 2);  // Bottom

        // Network protection energy
        shieldCtx.fillStyle = GAME_CONFIG.COLORS.NEXUS_GLOW;
        shieldCtx.fillRect(7, 5, 6, 1);   // Top energy
        shieldCtx.fillRect(5, 7, 10, 6);  // Center energy
        shieldCtx.fillRect(7, 14, 6, 1);  // Bottom energy

        // Consensus core
        shieldCtx.fillStyle = GAME_CONFIG.COLORS.VERIFICATION_GREEN;
        shieldCtx.fillRect(8, 8, 4, 4);   // Bright verification core

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
