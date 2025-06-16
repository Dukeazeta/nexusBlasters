// Nexus Blasters - Input Management System
class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.mouse = { x: 0, y: 0, pressed: false };
        this.keys = {};
        this.touch = { x: 0, y: 0, active: false };

        // Mobile touch controls
        this.touchMovement = { x: 0, y: 0 };
        this.touchFiring = false;

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
            if (e.touches.length > 0) {
                const rect = this.canvas.getBoundingClientRect();
                const touch = e.touches[0];
                this.touch.x = (touch.clientX - rect.left) * (this.canvas.width / rect.width);
                this.touch.y = (touch.clientY - rect.top) * (this.canvas.height / rect.height);
                this.touch.active = true;
            }
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.touch.active = false;
            // Clear touch position when touch ends to prevent ghost movement
            this.touch.x = 0;
            this.touch.y = 0;
        });

        this.canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.touch.active = false;
            this.touch.x = 0;
            this.touch.y = 0;
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

    // Check if there's any movement input (mouse, touch, or keyboard)
    hasMovementInput() {
        const keyMovement = this.getMovementInput();
        const hasKeyInput = keyMovement.x !== 0 || keyMovement.y !== 0;
        return this.mouse.pressed || this.touch.active || hasKeyInput;
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
    


    
    // Check for pause input
    isPausePressed() {
        return this.wasKeyPressed('Escape') || this.wasKeyPressed('KeyP');
    }
    
    // Reset all input states
    reset() {
        this.mouse.pressed = false;
        this.touch.active = false;
        this.touch.x = 0;
        this.touch.y = 0;
        this.keys = {};
    }

    // Force clear touch state (useful for debugging or edge cases)
    clearTouchState() {
        this.touch.active = false;
        this.touch.x = 0;
        this.touch.y = 0;
    }
    
    // Mobile touch control methods
    setTouchMovement(deltaX, deltaY) {
        // Normalize touch movement to -1 to 1 range
        const sensitivity = 0.01;
        this.touchMovement.x = Math.max(-1, Math.min(1, deltaX * sensitivity));
        this.touchMovement.y = Math.max(-1, Math.min(1, deltaY * sensitivity));
    }

    setTouchFiring(firing) {
        this.touchFiring = firing;
    }

    // Enhanced movement input that includes touch controls
    getMovementInput() {
        const movement = { x: 0, y: 0 };

        // Keyboard input
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

        // Add touch movement
        movement.x += this.touchMovement.x;
        movement.y += this.touchMovement.y;

        // Clamp to -1 to 1 range
        movement.x = Math.max(-1, Math.min(1, movement.x));
        movement.y = Math.max(-1, Math.min(1, movement.y));

        // Normalize diagonal movement
        if (movement.x !== 0 && movement.y !== 0) {
            const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
            if (length > 1) {
                movement.x /= length;
                movement.y /= length;
            }
        }

        return movement;
    }

    // Enhanced shooting input that includes touch controls
    isShooting() {
        return this.isKeyPressed('Space') || this.isInputActive() || this.touchFiring;
    }

    // Update method for any per-frame input processing
    update() {
        // Decay touch movement over time for smoother control
        this.touchMovement.x *= 0.9;
        this.touchMovement.y *= 0.9;

        // Clear very small movements to prevent jitter
        if (Math.abs(this.touchMovement.x) < 0.01) this.touchMovement.x = 0;
        if (Math.abs(this.touchMovement.y) < 0.01) this.touchMovement.y = 0;
    }
}
