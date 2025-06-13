// Nexus Blasters - Utility Functions
class Utils {
    // Helper function to draw pixelated circles
    static drawCircle(ctx, centerX, centerY, radius) {
        for (let x = -radius; x <= radius; x++) {
            for (let y = -radius; y <= radius; y++) {
                if (x * x + y * y <= radius * radius) {
                    ctx.fillRect(centerX + x, centerY + y, 1, 1);
                }
            }
        }
    }
    
    // Helper function to draw pixelated ellipses
    static drawEllipse(ctx, centerX, centerY, radiusX, radiusY) {
        for (let x = -radiusX; x <= radiusX; x++) {
            for (let y = -radiusY; y <= radiusY; y++) {
                if ((x * x) / (radiusX * radiusX) + (y * y) / (radiusY * radiusY) <= 1) {
                    ctx.fillRect(centerX + x, centerY + y, 1, 1);
                }
            }
        }
    }
    
    // Helper function to draw nebula clouds
    static drawNebula(ctx, centerX, centerY, width, height) {
        for (let x = -width/2; x <= width/2; x += 2) {
            for (let y = -height/2; y <= height/2; y += 2) {
                const distance = Math.sqrt(x*x + y*y);
                const maxDistance = Math.sqrt(width*width + height*height) / 2;
                if (distance < maxDistance && Math.random() > distance / maxDistance) {
                    ctx.fillRect(centerX + x, centerY + y, 2, 2);
                }
            }
        }
    }
    
    // Create a canvas with pixel-perfect settings
    static createPixelCanvas(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        return { canvas, ctx };
    }
    
    // Distance calculation
    static distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    // Clamp value between min and max
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
    
    // Linear interpolation
    static lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
    
    // Random integer between min and max (inclusive)
    static randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    // Random float between min and max
    static randomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }
    
    // Check if two rectangles collide
    static rectCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }
    
    // Check if two circles collide
    static circleCollision(circle1, circle2) {
        const distance = this.distance(circle1.x, circle1.y, circle2.x, circle2.y);
        return distance < circle1.radius + circle2.radius;
    }
}

// Game Constants
const GAME_CONFIG = {
    PLAYER: {
        SPEED: 300,
        SIZE: 64,
        ENGINE_ANIM_SPEED: 100
    },
    ENEMY: {
        SPAWN_RATE: 2000,
        SCOUT_SPEED: 150,
        FIGHTER_SPEED: 100
    },
    POWERUP: {
        SPAWN_RATE: 8000 // 8 seconds between power-ups
    },
    BULLET: {
        PLAYER_SPEED: 500,
        PLAYER_RAPID_SPEED: 600,
        ENEMY_SPEED: 200,
        ENEMY_HEAVY_SPEED: 150
    },
    BLASTER: {
        MUZZLE_FLASH_DURATION: 100,
        ENEMY_MUZZLE_FLASH_DURATION: 80,
        TRAIL_SPAWN_RATE: 0.3
    },
    BACKGROUND: {
        SCROLL_SPEED: 20
    },
    COLORS: {
        NEXUS_BLUE: '#4a90e2',
        NEXUS_LIGHT: '#6bb6ff',
        NEXUS_DARK: '#357abd',
        SPACE_DARK: '#000814',
        SPACE_DEEP: '#0a0a2e'
    }
};
