"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interpolate = exports.Camera = exports.OneDimensionalVector = void 0;
class Vector {
    constructor(x, y) {
        this.values = {};
        this.x = x;
        this.y = y;
    }
    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
    static sub(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }
    static fromPolar(r, t) {
        return new Vector(r * Math.cos(t), r * Math.sin(t));
    }
    get magnitude() { return Math.sqrt(this.x * this.x + this.y * this.y); }
    get angle() {
        if (this.x && this.y)
            return Math.atan2(this.y, this.x);
        return null;
    }
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
exports.default = Vector;
class OneDimensionalVector {
    constructor(x, vel = 0, accel = 0) {
        this.pos = x;
        this.vel = vel;
        this.accel = accel;
    }
    tick() {
        this.vel += this.accel;
        this.pos += this.vel;
    }
}
exports.OneDimensionalVector = OneDimensionalVector;
class Camera extends Vector {
    constructor(x, y, fov) {
        super(x, y);
        this.player = -1;
        this.fov = fov;
    }
}
exports.Camera = Camera;
function interpolate(from, to, scale) {
    return from * (1 - scale) + to * (scale);
}
exports.interpolate = interpolate;
