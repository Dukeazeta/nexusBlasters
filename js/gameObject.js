// Nexus Blasters - Base Game Object Class

// Base GameObject class
class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.active = true;
    }
    
    getBounds() {
        return {
            x: this.x - this.width / 2,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
    
    isOffScreen(canvasWidth, canvasHeight) {
        return this.x < -this.width || 
               this.x > canvasWidth + this.width || 
               this.y < -this.height || 
               this.y > canvasHeight + this.height;
    }
    
    destroy() {
        this.active = false;
    }
}
