import { Vector } from "./Vector.js";
class StateArray {
    constructor(component, componentIndex, val, size) {
        this.values = val;
        this.state = new Uint8Array(size);
        for (let n = 0; n < 40; n++) {
            Object.defineProperty(this, n, {
                get() { return this.values[n] },
                set(v) { if (this.values[n] === v) return; component.entity.state |= 1; component.state[componentIndex] |= 1; this.state[n] |= 1; this.values[n] = v;}
            })
        }
    }
}
class PositionComponent extends Vector {
    values = {};
    constructor(entity, x, y, angle, radius) {
        super(x, y);
        this.values = {
            x, y, angle, radius
        }
        this.entity = entity;
        this.state = new Uint8Array(4);
    }
    get x() { return this.values.x }
    get y() { return this.values.y }
    get angle() { return this.values.angle }
    get radius() { return this.values.radius }

    set x(v) { if (this.values.x === v) return; if (this.entity) { this.entity.state |= 1; this.state[0] |= 1; this.values.x = v; } }
    set y(v) { if (this.values.y === v) return; if (this.entity) { this.entity.state |= 1; this.state[1] |= 1; this.values.y = v; } }
    set angle(v) { if (this.values.angle === v) return; this.entity.state |= 1; this.state[2] |= 1; this.values.angle = v; }
    set radius(v) { if (this.values.radius === v) return; this.entity.state |= 1; this.state[3] |= 1; this.values.radius = v; }
    
    reset() { this.state.fill(0) }
}
class CameraComponent extends Vector {
    values = {};
    constructor(entity, x, y, fov, player) {
        super(x, y);
        this.values = {
            x, y, fov, player
        }
        this.entity = entity;
        this.state = new Uint8Array(4);
    }
    get x() { return this.values.x }
    get y() { return this.values.y }
    get fov() { return this.values.fov }
    get player() { return this.values.player }

    set x(v) { if (this.values.x === v) return; if (this.entity) { this.entity.state |= 1; this.state[0] |= 1; this.values.x = v; } }
    set y(v) { if (this.values.y === v) return; if (this.entity) { this.entity.state |= 1; this.state[1] |= 1; this.values.y = v; } }
    set fov(v) { if (this.values.fov === v) return; if (this.entity) this.entity.state |= 1; this.state[2] |= 1; this.values.fov = v; }
    set player(v) { if (this.values.player === v) return; if (this.entity) this.entity.state |= 1; this.state[3] |= 1; this.values.player = v; }
    
    reset() { this.state.fill(0) }
}
class ArenaComponent {
    constructor(entity, width, height, name) {
        this.values = {
            width, height, name
        }
        this.entity = entity;
        this.state = new Uint8Array(3);
    }
    get width() { return this.values.width }
    get height() { return this.values.height }
    get name() { return this.values.name }

    set width(v) { if (this.values.width === v) return; this.entity.state |= 1; this.state[0] |= 1; this.values.width = v; }
    set height(v) { if (this.values.height === v) return; this.entity.state |= 1; this.state[1] |= 1; this.values.height = v; }
    set name(v) { if (this.values.name === v) return; this.entity.state |= 1; this.state[2] |= 1; this.values.name = v; }
    
    reset() { this.state.fill(0) }
}
class StyleComponent {
    constructor(entity, color, opacity) {
        this.values = {
            color, opacity
        }
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get color() { return this.values.color }
    get opacity() { return this.values.opacity }

    set color(v) { if (this.values.color === v) return; this.entity.state |= 1; this.state[0] |= 1; this.values.color = v; }
    set opacity(v) { if (this.values.opacity === v) return; this.entity.state |= 1; this.state[1] |= 1; this.values.opacity = v; }
    
    reset() { this.state.fill(0) }
}
class HealthComponent {
    constructor(entity, health) {
        this.values = {
            health, maxHealth: health, lastDamaged: -1
        }
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get health() { return this.values.health }
    get maxHealth() { return this.values.maxHealth }
    get lastDamaged() { return this.values.lastDamaged }

    set health(v) { if (this.values.health === v) return; this.entity.state |= 1; this.state[0] |= 1; this.values.health = v; }
    set maxHealth(v) { if (this.values.maxHealth === v) return; this.entity.state |= 1; this.state[1] |= 1; this.values.maxHealth = v; }
    set lastDamaged(v) { this.values.lastDamaged = v }
    reset() { this.state.fill(0) }
}
class DropComponent {
    constructor(entity, id, rarity) {
        this.values = {
            id, rarity
        }
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get id() { return this.values.id }
    get rarity() { return this.values.rarity }

    set id(v) { if (this.values.id === v) return; this.entity.state |= 1; this.state[0] |= 1; this.values.id = v; }
    set rarity(v) { if (this.values.rarity === v) return; this.entity.state |= 1; this.state[1] |= 1; this.values.rarity = v; }
    
    reset() { this.state.fill(0) }
}
class PlayerInfoComponent {
    constructor(entity, petalsEquipped) {
        this.entity = entity;
        this.values = {
            numEquipped: 0,
            faceFlags: 0
        }
        this.petalsEquipped = new StateArray(this, 1, petalsEquipped, 40);
        this.petalHealths = new StateArray(this, 2, new Uint8Array(10), 10);
        this.petalCooldowns = new StateArray(this, 3, new Uint8Array(10), 10);
        this.state = new Uint8Array(5);
    }
    get numEquipped() { return this.values.numEquipped }
    get faceFlags() { return this.values.faceFlags }

    set numEquipped(v) { if (this.values.numEquipped === v) return; this.entity.state |= 1; this.state[0] |= 1; this.values.numEquipped = v; }
    set faceFlags(v) { if (this.values.faceFlags === v) return; this.entity.state |= 1; this.state[4] |= 1; this.values.faceFlags = v; }
    reset() { 
        this.state.fill(0);
        this.petalsEquipped.state.fill(0);
        this.petalCooldowns.state.fill(0);
        this.petalHealths.state.fill(0);
    }
}
class MobComponent {
    constructor(entity, id, rarity) {
        this.values = {
            id, rarity
        }
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get id() { return this.values.id }
    get rarity() { return this.values.rarity }

    set id(v) { if (this.values.id === v) return; this.entity.state |= 1; this.state[0] |= 1; this.values.id = v; }
    set rarity(v) { if (this.values.rarity === v) return; this.entity.state |= 1; this.state[1] |= 1; this.values.rarity = v; }
    
    reset() { this.state.fill(0) }
}
class PetalComponent {
    constructor(entity, id, rarity) {
        this.values = {
            id, rarity
        }
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get id() { return this.values.id }
    get rarity() { return this.values.rarity }

    set id(v) { if (this.values.id === v) return; this.entity.state |= 1; this.state[0] |= 1; this.values.id = v; }
    set rarity(v) { if (this.values.rarity === v) return; this.entity.state |= 1; this.state[1] |= 1; this.values.rarity = v; }
    
    reset() { this.state.fill(0) }
}
export const COMPONENTS = {
    PositionComponent,
    CameraComponent,
    ArenaComponent,
    StyleComponent,
    HealthComponent,
    DropComponent,
    PlayerInfoComponent,
    MobComponent,
    PetalComponent
}