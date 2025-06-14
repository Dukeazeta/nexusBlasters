// Nexus Blasters - Background Rendering System
class BackgroundRenderer {
    constructor() {
        this.backgroundCanvas = null;
        this.offset = 0;
        this.speed = GAME_CONFIG.BACKGROUND.SCROLL_SPEED;

        // Animated elements
        this.animatedStars = [];
        this.floatingDebris = [];
        this.energyStreams = [];
        this.pulsingNodes = [];

        this.initAnimatedElements();
    }

    initAnimatedElements() {
        // Create animated twinkling stars
        for (let i = 0; i < 50; i++) {
            this.animatedStars.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                size: Math.random() * 2 + 1,
                twinkleSpeed: Math.random() * 0.02 + 0.01,
                brightness: Math.random(),
                color: Math.random() > 0.8 ? GAME_CONFIG.COLORS.NEXUS_GLOW : '#ffffff'
            });
        }

        // Create floating debris
        for (let i = 0; i < 15; i++) {
            this.floatingDebris.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                size: Math.random() * 4 + 2,
                speed: Math.random() * 20 + 10,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                color: '#666666'
            });
        }

        // Create energy streams
        for (let i = 0; i < 8; i++) {
            this.energyStreams.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                length: Math.random() * 100 + 50,
                speed: Math.random() * 30 + 20,
                thickness: Math.random() * 2 + 1,
                color: GAME_CONFIG.COLORS.NEXUS_ACCENT,
                alpha: Math.random() * 0.5 + 0.3,
                direction: Math.random() * Math.PI * 2
            });
        }

        // Create pulsing nexus nodes
        for (let i = 0; i < 6; i++) {
            this.pulsingNodes.push({
                x: Math.random() * 800,
                y: Math.random() * 600,
                size: Math.random() * 8 + 4,
                pulseSpeed: Math.random() * 0.03 + 0.01,
                pulsePhase: Math.random() * Math.PI * 2,
                color: GAME_CONFIG.COLORS.NEXUS_GLOW,
                connections: []
            });
        }

        // Create connections between nearby nodes
        for (let i = 0; i < this.pulsingNodes.length; i++) {
            for (let j = i + 1; j < this.pulsingNodes.length; j++) {
                const node1 = this.pulsingNodes[i];
                const node2 = this.pulsingNodes[j];
                const distance = Math.sqrt(
                    Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2)
                );

                if (distance < 200) {
                    node1.connections.push(j);
                }
            }
        }
    }

    // Create space elements (planets, nebulae, etc.)
    createSpaceElements() {
        this.createPlanets();
        this.createNebulae();
        this.createAsteroids();
    }
    
    createPlanets() {
        // Large gas giant with rings
        const { canvas: planet1, ctx: p1Ctx } = Utils.createPixelCanvas(120, 100);
        
        // Planet base (blue-green gas giant)
        p1Ctx.fillStyle = '#2d5aa0';
        Utils.drawCircle(p1Ctx, 60, 50, 40);
        
        // Gas bands
        p1Ctx.fillStyle = GAME_CONFIG.COLORS.NEXUS_BLUE;
        Utils.drawEllipse(p1Ctx, 60, 35, 35, 8);
        Utils.drawEllipse(p1Ctx, 60, 50, 38, 6);
        Utils.drawEllipse(p1Ctx, 60, 65, 32, 5);
        
        // Storm spots
        p1Ctx.fillStyle = '#1e3d6f';
        Utils.drawCircle(p1Ctx, 45, 40, 6);
        Utils.drawCircle(p1Ctx, 70, 60, 4);
        
        // Atmosphere glow
        p1Ctx.fillStyle = GAME_CONFIG.COLORS.NEXUS_LIGHT;
        Utils.drawCircle(p1Ctx, 60, 50, 42);
        p1Ctx.fillStyle = '#2d5aa0';
        Utils.drawCircle(p1Ctx, 60, 50, 40);
        
        // Planet rings
        p1Ctx.fillStyle = '#cccccc';
        Utils.drawEllipse(p1Ctx, 60, 50, 55, 3);
        Utils.drawEllipse(p1Ctx, 60, 50, 60, 2);
        p1Ctx.fillStyle = '#888888';
        Utils.drawEllipse(p1Ctx, 60, 50, 58, 1);
        
        assetManager.sprites.planet1 = planet1;
        
        // Rocky planet with atmosphere
        const { canvas: planet2, ctx: p2Ctx } = Utils.createPixelCanvas(70, 70);
        
        // Planet base (red-orange rocky)
        p2Ctx.fillStyle = '#cc4400';
        Utils.drawCircle(p2Ctx, 35, 35, 30);
        
        // Surface features (continents/landmasses)
        p2Ctx.fillStyle = '#aa2200';
        Utils.drawCircle(p2Ctx, 25, 25, 8);
        Utils.drawCircle(p2Ctx, 50, 30, 6);
        Utils.drawCircle(p2Ctx, 40, 50, 10);
        Utils.drawCircle(p2Ctx, 20, 45, 5);
        
        // Mountain ranges
        p2Ctx.fillStyle = '#884400';
        Utils.drawCircle(p2Ctx, 30, 20, 3);
        Utils.drawCircle(p2Ctx, 45, 40, 4);
        
        // Polar ice caps
        p2Ctx.fillStyle = '#ffffff';
        Utils.drawCircle(p2Ctx, 35, 15, 4);
        Utils.drawCircle(p2Ctx, 35, 55, 3);
        
        // Atmosphere
        p2Ctx.fillStyle = '#ff8844';
        Utils.drawCircle(p2Ctx, 35, 35, 32);
        p2Ctx.fillStyle = '#cc4400';
        Utils.drawCircle(p2Ctx, 35, 35, 30);
        
        assetManager.sprites.planet2 = planet2;
        
        // Detailed moon with craters
        const { canvas: moon, ctx: moonCtx } = Utils.createPixelCanvas(32, 32);
        
        // Moon base (gray)
        moonCtx.fillStyle = '#888888';
        Utils.drawCircle(moonCtx, 16, 16, 14);
        
        // Large craters
        moonCtx.fillStyle = '#666666';
        Utils.drawCircle(moonCtx, 10, 10, 4);
        Utils.drawCircle(moonCtx, 22, 18, 3);
        Utils.drawCircle(moonCtx, 12, 24, 2);
        
        // Small craters
        moonCtx.fillStyle = '#555555';
        Utils.drawCircle(moonCtx, 20, 8, 1);
        Utils.drawCircle(moonCtx, 8, 20, 1);
        Utils.drawCircle(moonCtx, 25, 25, 1);
        
        // Highlights (sunlit side)
        moonCtx.fillStyle = '#aaaaaa';
        Utils.drawCircle(moonCtx, 12, 12, 2);
        Utils.drawCircle(moonCtx, 18, 14, 1);
        
        assetManager.sprites.moon = moon;
    }
    
    createNebulae() {
        // Purple nebula
        const { canvas: nebula1, ctx: n1Ctx } = Utils.createPixelCanvas(120, 80);
        
        // Create nebula cloud effect
        n1Ctx.fillStyle = '#4a0e4e';
        Utils.drawNebula(n1Ctx, 60, 40, 50, 30);
        n1Ctx.fillStyle = '#6a1b70';
        Utils.drawNebula(n1Ctx, 40, 30, 30, 20);
        n1Ctx.fillStyle = '#8b2a96';
        Utils.drawNebula(n1Ctx, 80, 50, 25, 15);
        
        assetManager.sprites.nebula1 = nebula1;
        
        // Blue nebula
        const { canvas: nebula2, ctx: n2Ctx } = Utils.createPixelCanvas(100, 60);
        
        n2Ctx.fillStyle = '#0e2a4e';
        Utils.drawNebula(n2Ctx, 50, 30, 40, 25);
        n2Ctx.fillStyle = '#1b4a70';
        Utils.drawNebula(n2Ctx, 30, 20, 25, 15);
        n2Ctx.fillStyle = '#2a6a96';
        Utils.drawNebula(n2Ctx, 70, 40, 20, 12);
        
        assetManager.sprites.nebula2 = nebula2;
    }
    
    createAsteroids() {
        // Asteroid
        const { canvas: asteroid, ctx: astCtx } = Utils.createPixelCanvas(16, 12);
        
        // Irregular asteroid shape
        astCtx.fillStyle = '#666666';
        astCtx.fillRect(2, 4, 12, 4);
        astCtx.fillRect(4, 2, 8, 8);
        astCtx.fillRect(1, 5, 14, 2);
        
        // Surface details
        astCtx.fillStyle = '#444444';
        astCtx.fillRect(3, 3, 2, 2);
        astCtx.fillRect(8, 6, 1, 1);
        astCtx.fillRect(11, 4, 2, 1);
        
        assetManager.sprites.asteroid = asteroid;
    }
    
    // Create an epic space background
    createStarField(width, height) {
        const { canvas, ctx } = Utils.createPixelCanvas(width, height);
        
        // Deep space gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0a0a2e');
        gradient.addColorStop(0.5, GAME_CONFIG.COLORS.SPACE_DARK);
        gradient.addColorStop(1, '#1a0a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        
        // Add distant nebulae (very faint)
        const nebula1 = assetManager.getSprite('nebula1');
        const nebula2 = assetManager.getSprite('nebula2');
        
        if (nebula1) {
            ctx.globalAlpha = 0.15;
            ctx.drawImage(nebula1, width * 0.1, height * 0.2);
            ctx.drawImage(nebula1, width * 0.7, height * 0.6);
            ctx.globalAlpha = 1.0;
        }
        
        if (nebula2) {
            ctx.globalAlpha = 0.12;
            ctx.drawImage(nebula2, width * 0.4, height * 0.1);
            ctx.drawImage(nebula2, width * 0.2, height * 0.7);
            ctx.globalAlpha = 1.0;
        }
        
        // Add distant planets
        this.addPlanetsToBackground(ctx, width, height);
        
        // Generate layered stars (far to near)
        this.addStarsToBackground(ctx, width, height);
        
        // Add subtle Nexus nodes
        this.addNexusNodesToBackground(ctx, width, height);
        
        return canvas;
    }
    
    addPlanetsToBackground(ctx, width, height) {
        const planet1 = assetManager.getSprite('planet1');
        const planet2 = assetManager.getSprite('planet2');
        const moon = assetManager.getSprite('moon');
        const asteroid = assetManager.getSprite('asteroid');
        
        if (planet1) {
            ctx.globalAlpha = 0.7;
            ctx.drawImage(planet1, width * 0.75, height * 0.05);
            ctx.globalAlpha = 1.0;
        }
        
        if (planet2) {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(planet2, width * 0.02, height * 0.25);
            ctx.globalAlpha = 1.0;
        }
        
        if (moon) {
            ctx.globalAlpha = 0.6;
            ctx.drawImage(moon, width * 0.12, height * 0.12);
            ctx.drawImage(moon, width * 0.88, height * 0.75);
            ctx.drawImage(moon, width * 0.45, height * 0.08);
            ctx.globalAlpha = 1.0;
        }
        
        // Add asteroids
        if (asteroid) {
            ctx.globalAlpha = 0.4;
            for (let i = 0; i < 8; i++) {
                const x = Math.random() * width;
                const y = Math.random() * height;
                ctx.drawImage(asteroid, x, y);
            }
            ctx.globalAlpha = 1.0;
        }
    }
    
    addStarsToBackground(ctx, width, height) {
        // Distant stars (small and dim)
        for (let i = 0; i < 150; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const sprite = assetManager.getSprite('bgStar1');
            
            if (sprite) {
                ctx.globalAlpha = 0.4 + Math.random() * 0.3;
                ctx.drawImage(sprite, x, y);
                ctx.globalAlpha = 1.0;
            }
        }
        
        // Medium stars
        for (let i = 0; i < 80; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const sprite = assetManager.getSprite('bgStar2');
            
            if (sprite) {
                ctx.globalAlpha = 0.6 + Math.random() * 0.3;
                ctx.drawImage(sprite, x, y);
                ctx.globalAlpha = 1.0;
            }
        }
        
        // Bright stars
        for (let i = 0; i < 40; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const sprite = assetManager.getSprite('bgStar3');
            
            if (sprite) {
                ctx.globalAlpha = 0.8 + Math.random() * 0.2;
                ctx.drawImage(sprite, x, y);
                ctx.globalAlpha = 1.0;
            }
        }
        
        // Twinkling stars (brightest)
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const sprite = assetManager.getSprite('twinkleStar');
            
            if (sprite) {
                ctx.globalAlpha = 0.7 + Math.random() * 0.3;
                ctx.drawImage(sprite, x, y);
                ctx.globalAlpha = 1.0;
            }
        }
    }
    
    addNexusNodesToBackground(ctx, width, height) {
        for (let i = 0; i < 12; i++) {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const node = assetManager.getSprite('nexusNode');
            
            if (node) {
                ctx.globalAlpha = 0.2 + Math.random() * 0.2;
                ctx.drawImage(node, x, y);
                ctx.globalAlpha = 1.0;
            }
        }
    }
    
    // Initialize background
    init(width, height) {
        try {
            console.log('Initializing background renderer...');
            this.createSpaceElements();
            console.log('Space elements created');
            this.backgroundCanvas = this.createStarField(width, height);
            console.log('Star field created');
        } catch (error) {
            console.error('Error initializing background:', error);
            throw error;
        }
    }
    
    // Update background animation
    update(deltaTime) {
        this.offset += this.speed * (deltaTime / 1000);
        this.updateAnimatedElements(deltaTime);
    }

    updateAnimatedElements(deltaTime) {
        const dt = deltaTime / 1000;

        // Update twinkling stars
        for (const star of this.animatedStars) {
            star.brightness += star.twinkleSpeed;
            if (star.brightness > 1) star.brightness = 0;
        }

        // Update floating debris
        for (const debris of this.floatingDebris) {
            debris.y += debris.speed * dt;
            debris.rotation += debris.rotationSpeed;

            // Wrap around screen
            if (debris.y > 650) {
                debris.y = -50;
                debris.x = Math.random() * 800;
            }
        }

        // Update energy streams
        for (const stream of this.energyStreams) {
            stream.x += Math.cos(stream.direction) * stream.speed * dt;
            stream.y += Math.sin(stream.direction) * stream.speed * dt;

            // Wrap around screen
            if (stream.x < -100) stream.x = 900;
            if (stream.x > 900) stream.x = -100;
            if (stream.y < -100) stream.y = 700;
            if (stream.y > 700) stream.y = -100;
        }

        // Update pulsing nodes
        for (const node of this.pulsingNodes) {
            node.pulsePhase += node.pulseSpeed;
        }
    }
    
    // Render animated background
    render(ctx, canvasWidth, canvasHeight) {
        if (!this.backgroundCanvas) return;

        // Create scrolling effect by drawing background twice (scrolling downward)
        const yOffset = this.offset % canvasHeight;
        ctx.drawImage(this.backgroundCanvas, 0, yOffset);
        ctx.drawImage(this.backgroundCanvas, 0, yOffset - canvasHeight);

        // Render animated elements on top
        this.renderAnimatedElements(ctx, canvasWidth, canvasHeight);
    }

    renderAnimatedElements(ctx, canvasWidth, canvasHeight) {
        ctx.save();

        // Render energy streams
        for (const stream of this.energyStreams) {
            ctx.globalAlpha = stream.alpha;
            ctx.strokeStyle = stream.color;
            ctx.lineWidth = stream.thickness;
            ctx.beginPath();
            ctx.moveTo(stream.x, stream.y);
            ctx.lineTo(
                stream.x + Math.cos(stream.direction) * stream.length,
                stream.y + Math.sin(stream.direction) * stream.length
            );
            ctx.stroke();
        }

        // Render pulsing nodes and connections
        for (let i = 0; i < this.pulsingNodes.length; i++) {
            const node = this.pulsingNodes[i];

            // Render connections
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = node.color;
            ctx.lineWidth = 1;
            for (const connectionIndex of node.connections) {
                const connectedNode = this.pulsingNodes[connectionIndex];
                ctx.beginPath();
                ctx.moveTo(node.x, node.y);
                ctx.lineTo(connectedNode.x, connectedNode.y);
                ctx.stroke();
            }

            // Render node
            const pulseIntensity = 0.5 + 0.5 * Math.sin(node.pulsePhase);
            ctx.globalAlpha = pulseIntensity * 0.8;
            ctx.fillStyle = node.color;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * pulseIntensity, 0, Math.PI * 2);
            ctx.fill();

            // Add glow effect
            ctx.globalAlpha = pulseIntensity * 0.3;
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.size * pulseIntensity * 2, 0, Math.PI * 2);
            ctx.fill();
        }

        // Render floating debris
        for (const debris of this.floatingDebris) {
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = debris.color;
            ctx.save();
            ctx.translate(debris.x, debris.y);
            ctx.rotate(debris.rotation);
            ctx.fillRect(-debris.size / 2, -debris.size / 2, debris.size, debris.size);
            ctx.restore();
        }

        // Render animated twinkling stars
        for (const star of this.animatedStars) {
            ctx.globalAlpha = star.brightness;
            ctx.fillStyle = star.color;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // Add twinkle effect
            if (star.brightness > 0.8) {
                ctx.globalAlpha = (star.brightness - 0.8) * 5;
                ctx.strokeStyle = star.color;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(star.x - star.size * 2, star.y);
                ctx.lineTo(star.x + star.size * 2, star.y);
                ctx.moveTo(star.x, star.y - star.size * 2);
                ctx.lineTo(star.x, star.y + star.size * 2);
                ctx.stroke();
            }
        }

        ctx.restore();
    }
    
    // Recreate background when canvas resizes
    resize(width, height) {
        if (assetManager.loaded) {
            this.backgroundCanvas = this.createStarField(width, height);
        }
    }
}

// Global background renderer instance
const backgroundRenderer = new BackgroundRenderer();
