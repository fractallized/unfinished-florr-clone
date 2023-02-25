"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PetalComponent = exports.MobComponent = exports.PlayerInfoComponent = exports.DropComponent = exports.HealthComponent = exports.StyleComponent = exports.ArenaComponent = exports.CameraComponent = exports.PositionComponent = void 0;
class StateArray {
    constructor(component, componentIndex, val, size) {
        this.component = component;
        this.componentIndex = componentIndex;
        this.values = val;
        this.state = new Uint8Array(size);
    }
    get(n) { return this.values[n]; }
    set(n, v) {
        if (this.values[n] === v)
            return;
        this.state[n] |= 1;
        this.component.state[this.componentIndex] |= 1;
        this.values[n] = v;
    }
}
class PositionComponent {
    constructor(entity, x, y, radius, angle) {
        //super(x, y);
        this.values = {
            x, y, radius, angle
        };
        this.entity = entity;
        this.state = new Uint8Array(4);
    }
    get x() { return this.values.x; }
    get y() { return this.values.y; }
    get angle() { return this.values.angle; }
    get radius() { return this.values.radius; }
    set x(v) { if (this.values.x === v)
        return; if (this.entity) {
        this.entity.state |= 1;
        this.state[0] |= 1;
        this.values.x = v;
    } }
    set y(v) { if (this.values.y === v)
        return; if (this.entity) {
        this.entity.state |= 1;
        this.state[1] |= 1;
        this.values.y = v;
    } }
    set angle(v) { if (this.values.angle === v)
        return; this.entity.state |= 1; this.state[2] |= 1; this.values.angle = v; }
    set radius(v) { if (this.values.radius === v)
        return; this.entity.state |= 1; this.state[3] |= 1; this.values.radius = v; }
    reset() { this.state.fill(0); }
    get magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    set2(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    setAngle(angle) {
        const mag = this.magnitude;
        this.x = mag * Math.cos(angle);
        this.y = mag * Math.sin(angle);
    }
    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    distanceSq(v) {
        return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
    }
    normalize() {
        const mag = this.magnitude;
        if (mag === 0)
            return this;
        return this.scale(1 / mag);
    }
}
exports.PositionComponent = PositionComponent;
class CameraComponent {
    constructor(entity, x, y, fov, player) {
        this.values = {
            x, y, fov, player
        };
        this.entity = entity;
        this.state = new Uint8Array(4);
    }
    get x() { return this.values.x; }
    get y() { return this.values.y; }
    get fov() { return this.values.fov; }
    get player() { return this.values.player; }
    set x(v) { if (this.values.x === v)
        return; if (this.entity) {
        this.entity.state |= 1;
        this.state[0] |= 1;
        this.values.x = v;
    } }
    set y(v) { if (this.values.y === v)
        return; if (this.entity) {
        this.entity.state |= 1;
        this.state[1] |= 1;
        this.values.y = v;
    } }
    set fov(v) { if (this.values.fov === v)
        return; if (this.entity)
        this.entity.state |= 1; this.state[2] |= 1; this.values.fov = v; }
    set player(v) { if (this.values.player === v)
        return; if (this.entity)
        this.entity.state |= 1; this.state[3] |= 1; this.values.player = v; }
    reset() { this.state.fill(0); }
    get magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    set2(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    setAngle(angle) {
        const mag = this.magnitude;
        this.x = mag * Math.cos(angle);
        this.y = mag * Math.sin(angle);
    }
    scale(s) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    distanceSq(v) {
        return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
    }
    normalize() {
        const mag = this.magnitude;
        if (mag === 0)
            return this;
        return this.scale(1 / mag);
    }
}
exports.CameraComponent = CameraComponent;
class ArenaComponent {
    constructor(entity, width, height, name) {
        this.values = {
            width, height, name
        };
        this.entity = entity;
        this.state = new Uint8Array(3);
    }
    get width() { return this.values.width; }
    get height() { return this.values.height; }
    get name() { return this.values.name; }
    set width(v) { if (this.values.width === v)
        return; this.entity.state |= 1; this.state[0] |= 1; this.values.width = v; }
    set height(v) { if (this.values.height === v)
        return; this.entity.state |= 1; this.state[1] |= 1; this.values.height = v; }
    set name(v) { if (this.values.name === v)
        return; this.entity.state |= 1; this.state[2] |= 1; this.values.name = v; }
    reset() { this.state.fill(0); }
}
exports.ArenaComponent = ArenaComponent;
class StyleComponent {
    constructor(entity, color, opacity) {
        this.values = {
            color, opacity
        };
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get color() { return this.values.color; }
    get opacity() { return this.values.opacity; }
    set color(v) { if (this.values.color === v)
        return; this.entity.state |= 1; this.state[0] |= 1; this.values.color = v; }
    set opacity(v) { if (this.values.opacity === v)
        return; this.entity.state |= 1; this.state[1] |= 1; this.values.opacity = v; }
    reset() { this.state.fill(0); }
}
exports.StyleComponent = StyleComponent;
class HealthComponent {
    constructor(entity, health) {
        this.values = {
            health, maxHealth: health, lastDamaged: -1
        };
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get health() { return this.values.health; }
    get maxHealth() { return this.values.maxHealth; }
    get lastDamaged() { return this.values.lastDamaged; }
    set health(v) { if (this.values.health === v)
        return; this.entity.state |= 1; this.state[0] |= 1; this.values.health = v; }
    set maxHealth(v) { if (this.values.maxHealth === v)
        return; this.entity.state |= 1; this.state[1] |= 1; this.values.maxHealth = v; }
    set lastDamaged(v) { this.values.lastDamaged = v; }
    reset() { this.state.fill(0); }
}
exports.HealthComponent = HealthComponent;
class DropComponent {
    constructor(entity, id, rarity) {
        this.values = {
            id, rarity
        };
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get id() { return this.values.id; }
    get rarity() { return this.values.rarity; }
    set id(v) { if (this.values.id === v)
        return; this.entity.state |= 1; this.state[0] |= 1; this.values.id = v; }
    set rarity(v) { if (this.values.rarity === v)
        return; this.entity.state |= 1; this.state[1] |= 1; this.values.rarity = v; }
    reset() { this.state.fill(0); }
}
exports.DropComponent = DropComponent;
class PlayerInfoComponent {
    constructor(entity) {
        this.petalsEquipped = new StateArray(this, 1, new Uint8Array(40), 40);
        this.petalHealths = new StateArray(this, 2, new Uint8Array(10), 10);
        this.petalCooldowns = new StateArray(this, 3, new Uint8Array(10), 10);
        this.entity = entity;
        this.values = {
            numEquipped: 0,
            faceFlags: 0
        };
        this.petalsEquipped = new StateArray(this, 1, new Uint8Array(40), 40);
        this.petalHealths = new StateArray(this, 2, new Uint8Array(10), 10);
        this.petalCooldowns = new StateArray(this, 3, new Uint8Array(10), 10);
        this.state = new Uint8Array(5);
    }
    get numEquipped() { return this.values.numEquipped; }
    get faceFlags() { return this.values.faceFlags; }
    set numEquipped(v) { if (this.values.numEquipped === v)
        return; this.entity.state |= 1; this.state[0] |= 1; this.values.numEquipped = v; }
    set faceFlags(v) { if (this.values.faceFlags === v)
        return; this.entity.state |= 1; this.state[4] |= 1; this.values.faceFlags = v; }
    reset() {
        this.state.fill(0);
        this.petalsEquipped.state.fill(0);
        this.petalCooldowns.state.fill(0);
        this.petalHealths.state.fill(0);
    }
}
exports.PlayerInfoComponent = PlayerInfoComponent;
class MobComponent {
    constructor(entity, id, rarity) {
        this.values = {
            id, rarity
        };
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get id() { return this.values.id; }
    get rarity() { return this.values.rarity; }
    set id(v) { if (this.values.id === v)
        return; this.entity.state |= 1; this.state[0] |= 1; this.values.id = v; }
    set rarity(v) { if (this.values.rarity === v)
        return; this.entity.state |= 1; this.state[1] |= 1; this.values.rarity = v; }
    reset() { this.state.fill(0); }
}
exports.MobComponent = MobComponent;
class PetalComponent {
    constructor(entity, id, rarity) {
        this.values = {
            id, rarity
        };
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get id() { return this.values.id; }
    get rarity() { return this.values.rarity; }
    set id(v) { if (this.values.id === v)
        return; this.entity.state |= 1; this.state[0] |= 1; this.values.id = v; }
    set rarity(v) { if (this.values.rarity === v)
        return; this.entity.state |= 1; this.state[1] |= 1; this.values.rarity = v; }
    reset() { this.state.fill(0); }
}
exports.PetalComponent = PetalComponent;
