// Nexus Blasters - Game Objects Coordinator
// This file serves as the main entry point for all game object classes
// All individual classes are now in separate files for better organization

// Note: The individual classes (GameObject, Bullet, Enemy, Boss, PowerUp, Particle)
// are loaded from their respective files via script tags in index.html
// This file can contain any shared utilities or factory functions if needed

// Factory functions for creating game objects
class GameObjectFactory {
    static createBullet(x, y, velocityX, velocityY, type = 'player', subType = 'normal') {
        return new Bullet(x, y, velocityX, velocityY, type, subType);
    }

    static createEnemy(x, y, type = 'scout') {
        return new Enemy(x, y, type);
    }

    static createBoss(x, y, type = 'protocolTitan', wave = 5) {
        return new Boss(x, y, type, wave);
    }

    static createPowerUp(x, y, type = 'health') {
        return new PowerUp(x, y, type);
    }

    static createParticle(x, y, velocityX, velocityY, type = 'explosion') {
        return new Particle(x, y, velocityX, velocityY, type);
    }

    // Utility method to create multiple particles at once
    static createExplosionParticles(x, y) {
        return Particle.createExplosion(x, y);
    }

    static createSparkParticles(x, y, direction = 0) {
        return Particle.createSparks(x, y, direction);
    }

    static createDebrisParticles(x, y) {
        return Particle.createDebris(x, y);
    }
}

// All game object classes are now loaded from separate files
// This file only contains the factory class for convenience






