export class Vector {
    values = {};
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    static add(v1, v2) {
        return new Vector(v1.x+v2.x,v1.y+v2.y);
    }
    static sub(v1, v2) {
        return new Vector(v1.x-v2.x,v1.y-v2.y);
    }
    static fromPolar(r, t) {
        return new Vector(r * Math.cos(t), r * Math.sin(t));
    }
    get magnitude() { return Math.sqrt(this.x*this.x+this.y*this.y) }
    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    set2({x, y}) {
        this.x = x;
        this.y = y;
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
    add({x, y}) {
        this.x += x;
        this.y += y;
        return this;
    }
    sub({x, y}) {
        this.x -= x;
        this.y -= y;
        return this;
    }
    distanceSq({x, y}) {
        return (this.x-x)**2+(this.y-y)**2;
    }
    normalize() {
        const mag = this.magnitude;
        if (mag === 0) return this;
        return this.scale(1 / mag);
    }
}
export class OneDimensionalVector {
    constructor(x, vel, accel) {
        this.pos = x;
        this.vel = vel;
        this.accel = accel;
    }
    tick() {
        this.vel += this.accel;
        this.pos += this.vel;
    }
}
export class Camera extends Vector {
    constructor(x,y) {
        super(x,y);
        this.fov = 1;
    }
}
export function interpolate(from, to, scale) {
    return from * (1 - scale) + to * (scale);
}