// Nexus Blasters - Input Management System
class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.mouse = { x: 0, y: 0, pressed: false };
        this.keys = {};
        this.touch = { x: 0, y: 0, active: false };
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.setupMouseEvents();
        this.setupTouchEvents();
        this.setupKeyboardEvents();
    }
    
    setupMouseEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = (e.clientX - rect.left) * (this.canvas.width / rect.width);
            this.mouse.y = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            e.preventDefault();
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.mouse.pressed = false;
        });
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    setupTouchEvents() {
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.touch.x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            this.touch.y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
            this.touch.active = true;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.touch.x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
            this.touch.y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touch.active = false;
        });
        
        // Prevent scrolling on touch
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
        }, { passive: false });
    }
    
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Prevent default for game keys
            if (['Space', 'Escape', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Prevent spacebar from scrolling page
        document.addEventListener('keypress', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
            }
        });
    }
    
    // Get current input position (mouse or touch)
    getInputPosition() {
        if (this.touch.active) {
            return { x: this.touch.x, y: this.touch.y };
        }
        return { x: this.mouse.x, y: this.mouse.y };
    }
    
    // Check if input is active (mouse pressed or touch active)
    isInputActive() {
        return this.mouse.pressed || this.touch.active;
    }
    
    // Check if a key is currently pressed
    isKeyPressed(keyCode) {
        return !!this.keys[keyCode];
    }
    
    // Check if a key was just pressed (and reset it)
    wasKeyPressed(keyCode) {
        if (this.keys[keyCode]) {
            this.keys[keyCode] = false;
            return true;
        }
        return false;
    }
    
    // Get movement input from WASD or arrow keys
    getMovementInput() {
        const movement = { x: 0, y: 0 };
        
        if (this.isKeyPressed('ArrowLeft') || this.isKeyPressed('KeyA')) {
            movement.x -= 1;
        }
        if (this.isKeyPressed('ArrowRight') || this.isKeyPressed('KeyD')) {
            movement.x += 1;
        }
        if (this.isKeyPressed('ArrowUp') || this.isKeyPressed('KeyW')) {
            movement.y -= 1;
        }
        if (this.isKeyPressed('ArrowDown') || this.isKeyPressed('KeyS')) {
            movement.y += 1;
        }
        
        // Normalize diagonal movement
        if (movement.x !== 0 && movement.y !== 0) {
            const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
            movement.x /= length;
            movement.y /= length;
        }
        
        return movement;
    }
    
    // Check for shooting input
    isShooting() {
        return this.isKeyPressed('Space') || this.isInputActive();
    }
    
    // Check for pause input
    isPausePressed() {
        return this.wasKeyPressed('Escape') || this.wasKeyPressed('KeyP');
    }
    
    // Reset all input states
    reset() {
        this.mouse.pressed = false;
        this.touch.active = false;
        this.keys = {};
    }
    
    // Update method for any per-frame input processing
    update() {
        // Any input processing that needs to happen each frame
        // Currently empty but available for future use
    }
}
