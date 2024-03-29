import AbstractEntity from "./AbstractEntity.js";
import { VectorLike } from "./Vector.js";
import { RARITY_COUNT } from "../consts/Helpers.js";

type ComponentType = number | string | StateArray;
type TypedArray = Uint8Array;
interface Component {
    values: Record<string, ComponentType>;
    state: Uint8Array;
    entity: AbstractEntity;
}
class StateArray {
    values: TypedArray;
    component: Component;
    componentIndex: number;
    state: Uint8Array;
    constructor(component: Component, componentIndex: number, val: TypedArray, size: number) {
        this.component = component;
        this.componentIndex = componentIndex;
        this.values = val;
        this.state = new Uint8Array(size);
    }
    get(n: number) { return this.values[n] }
    set(n: number, v: number) {
        if (this.values[n] === v) return;
        this.component.entity.state |= 1;
        this.state[n] |= 1;
        this.component.state[this.componentIndex] |= 1;
        this.values[n] = v;
    }
}

export class Inventory {
    values: Int32Array;
    state: Uint8Array;
    grandState = 2;
    constructor() {
        this.values = new Int32Array(RARITY_COUNT * 100);
        this.state = new Uint8Array(this.values.length);
    }
    reset() {
        this.state.fill(0);
        this.grandState = 0;
    }
    get(n: number) {
        return this.values[n];
    }
    set(n: number, v: number) {
        if (this.values[n] === v) return;
        this.state[n] |= 1;
        this.grandState |= 1;
        this.values[n] = v;
    }
    add(n: number, i: number) {
        if (i === 0) return;
        this.state[n] |= 1;
        this.grandState |= 1;
        this.values[n] += i;
    }
}
export class PositionComponent implements Component, VectorLike {
    values: {
        x: number,
        y: number,
        angle: number,
        radius: number
    }
    entity: AbstractEntity;
    state: Uint8Array;
    constructor(entity: AbstractEntity, x: number, y: number, radius: number, angle: number) {
        this.values = {
            x, y, radius, angle
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
    get magnitude() { return Math.sqrt(this.x*this.x+this.y*this.y) }
    set(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }
    set2(v: VectorLike) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    setAngle(angle: number) {
        const mag = this.magnitude;
        this.x = mag * Math.cos(angle);
        this.y = mag * Math.sin(angle);
    }
    scale(s: number) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    add(v: VectorLike) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v: VectorLike) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    distanceSq(v: VectorLike) {
        return (this.x-v.x)**2+(this.y-v.y)**2;
    }
    normalize() {
        const mag = this.magnitude;
        if (mag === 0) return this;
        return this.scale(1 / mag);
    }
}
export class CameraComponent implements Component, VectorLike {
    values: {
        x: number,
        y: number,
        fov: number,
        player: number
    };
    entity: AbstractEntity;
    state: Uint8Array;
    constructor(entity: AbstractEntity, x: number, y: number, fov: number, player: number) {
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
    get magnitude() { return Math.sqrt(this.x*this.x+this.y*this.y) }
    set(x: number, y: number) {
        this.x = x;
        this.y = y;
        return this;
    }
    set2(v: VectorLike) {
        this.x = v.x;
        this.y = v.y;
        return this;
    }
    setAngle(angle: number) {
        const mag = this.magnitude;
        this.x = mag * Math.cos(angle);
        this.y = mag * Math.sin(angle);
    }
    scale(s: number) {
        this.x *= s;
        this.y *= s;
        return this;
    }
    add(v: VectorLike) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v: VectorLike) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    distanceSq(v: VectorLike) {
        return (this.x-v.x)**2+(this.y-v.y)**2;
    }
    normalize() {
        const mag = this.magnitude;
        if (mag === 0) return this;
        return this.scale(1 / mag);
    }
}
export class ArenaComponent implements Component {
    values: {
        width: number,
        height: number,
        name: string
    }
    entity: AbstractEntity;
    state: Uint8Array;
    constructor(entity: AbstractEntity, width: number, height: number, name: string) {
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
export class StyleComponent implements Component {
    values: {
        flags: number,
        opacity: number
    }
    entity: AbstractEntity;
    state: Uint8Array;
    constructor(entity: AbstractEntity, flags: number, opacity: number) {
        this.values = {
            flags, opacity
        }
        this.entity = entity;
        this.state = new Uint8Array(2);
    }
    get flags() { return this.values.flags }
    get opacity() { return this.values.opacity }

    set flags(v) { if (this.values.flags === v) return; this.entity.state |= 1; this.state[0] |= 1; this.values.flags = v; }
    set opacity(v) { if (this.values.opacity === v) return; this.entity.state |= 1; this.state[1] |= 1; this.values.opacity = v; }
    
    reset() { this.state.fill(0) }
}
export class HealthComponent implements Component {
    values: {
        health: number,
        maxHealth: number,
        lastDamaged: number
    }
    entity: AbstractEntity;
    state: Uint8Array;
    constructor(entity: AbstractEntity, health: number) {
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
export class DropComponent implements Component {
    values: {
        id: number,
        rarity: number
    }
    entity: AbstractEntity;
    state: Uint8Array;
    constructor(entity: AbstractEntity, id: number, rarity: number) {
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
export class PlayerInfoComponent implements Component {
    values: {
        numEquipped: number,
        faceFlags: number,
    }
    entity: AbstractEntity;
    state: Uint8Array;
    petalsEquipped = new StateArray(this, 1, new Uint8Array(40), 40);
    petalHealths = new StateArray(this, 2, new Uint8Array(10), 10);
    petalCooldowns = new StateArray(this, 3, new Uint8Array(10), 10);    
    constructor(entity: AbstractEntity) {
        this.entity = entity;
        this.values = {
            numEquipped: 0,
            faceFlags: 0
        }
        this.state = new Uint8Array(5);
        this.petalsEquipped = new StateArray(this, 1, new Uint8Array(40), 40);
        this.petalHealths = new StateArray(this, 2, new Uint8Array(10), 10);
        this.petalCooldowns = new StateArray(this, 3, new Uint8Array(10), 10);
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
export class MobComponent implements Component {
    values: {
        id: number,
        rarity: number
    }
    entity: AbstractEntity;
    state: Uint8Array;
    constructor(entity: AbstractEntity, id: number, rarity: number) {
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
export class PetalComponent implements Component {
    values: {
        id: number,
        rarity: number
    }
    entity: AbstractEntity;
    state: Uint8Array;
    constructor(entity: AbstractEntity, id: number, rarity: number) {
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