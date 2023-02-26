export interface VectorLike {
    x: any,
    y: any
}
export default class Vector implements VectorLike {
    values = {};
    x: any;
    y: any;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    static add(v1: VectorLike, v2: VectorLike) {
        return new Vector(v1.x+v2.x,v1.y+v2.y);
    }
    static sub(v1: VectorLike, v2: VectorLike) {
        return new Vector(v1.x-v2.x,v1.y-v2.y);
    }
    static fromPolar(r: number, t: number) {
        return new Vector(r * Math.cos(t), r * Math.sin(t));
    }
    get magnitude() { return Math.sqrt(this.x*this.x+this.y*this.y) }
    get angle() {
        if (this.x && this.y) return Math.atan2(this.y, this.x);
        return null;
    }
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
export class OneDimensionalVector {
    pos: number;
    vel: number;
    accel: number;
    constructor(x: number, vel: number = 0, accel: number = 0) {
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
    fov: number;
    player = -1;
    constructor(x: number,y: number, fov: number) {
        super(x,y);
        this.fov = fov;
    }
}
export function interpolate(from: number, to: number, scale: number) {
    return from * (1 - scale) + to * (scale);
}