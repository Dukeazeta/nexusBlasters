// Nexus Blasters - Particle Class

// Particle class for simple game particles (not part of the effects system)
class Particle extends GameObject {
    constructor(x, y, velocityX, velocityY, type = 'explosion') {
        super(x, y, 4, 4);
        this.velocityX = velocityX;
        this.velocityY = velocityY;
        this.type = type;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.gravity = 50;
        this.friction = 0.98;
        this.color = this.getParticleColor(type);
        this.size = Utils.randomFloat(2, 6);
        this.maxSize = this.size;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
    }
    
    getParticleColor(type) {
        const colors = {
            explosion: '#ff6644',
            spark: '#ffff88',
            debris: '#888888',
            smoke: '#666666',
            fire: '#ff4400',
            energy: '#44aaff'
        };
        return colors[type] || '#ffffff';
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        
        // Apply physics
        this.velocityY += this.gravity * dt;
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;
        
        // Update position
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        
        // Update rotation
        this.rotation += this.rotationSpeed * dt;
        
        // Update life
        this.life -= dt;
        
        // Update size based on life
        const lifeRatio = this.life / this.maxLife;
        this.size = this.maxSize * lifeRatio;
        
        // Mark for removal if dead
        if (this.life <= 0 || this.size <= 0) {
            this.active = false;
        }
    }
    
    render(ctx) {
        if (!this.active) return;
        
        const alpha = this.life / this.maxLife;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        // Apply rotation for debris particles
        if (this.type === 'debris') {
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.translate(-this.x, -this.y);
        }
        
        // Render based on particle type
        switch (this.type) {
            case 'explosion':
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'spark':
                ctx.strokeStyle = this.color;
                ctx.lineWidth = this.size;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x - this.velocityX * 0.01, this.y - this.velocityY * 0.01);
                ctx.stroke();
                break;
                
            case 'debris':
                ctx.fillStyle = this.color;
                ctx.fillRect(
                    this.x - this.size / 2,
                    this.y - this.size / 2,
                    this.size,
                    this.size
                );
                break;
                
            case 'smoke':
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'fire':
                // Fire particle with flickering effect
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = this.size * 2;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                break;
                
            case 'energy':
                // Energy particle with glow
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = this.size * 3;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Add inner bright core
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.3, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                break;
                
            default:
                // Default circular particle
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                break;
        }
        
        ctx.restore();
    }
    
    // Static factory methods for common particle types
    static createExplosion(x, y) {
        const particles = [];
        const count = Utils.randomInt(8, 15);
        
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
            const speed = Utils.randomFloat(50, 150);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            particles.push(new Particle(x, y, vx, vy, 'explosion'));
        }
        
        return particles;
    }
    
    static createSparks(x, y, direction = 0) {
        const particles = [];
        const count = Utils.randomInt(5, 10);
        
        for (let i = 0; i < count; i++) {
            const spread = Math.PI / 3; // 60 degree spread
            const angle = direction + (Math.random() - 0.5) * spread;
            const speed = Utils.randomFloat(100, 200);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            particles.push(new Particle(x, y, vx, vy, 'spark'));
        }
        
        return particles;
    }
    
    static createDebris(x, y) {
        const particles = [];
        const count = Utils.randomInt(6, 12);
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Utils.randomFloat(30, 100);
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            particles.push(new Particle(x, y, vx, vy, 'debris'));
        }
        
        return particles;
    }
}
