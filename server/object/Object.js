import { Vector } from "./Vector.js";
export class Object {
    constructor(arena, x, y, r, angle) {
        this.arena = arena;
        this.radius = r;
        this.angle = angle;
        this.pos = new Vector(x,y);
        this.vel = new Vector(0,0);
        this.accel = new Vector(0,0);
    }
    tick() {
        this.vel.scale(0.9);
        this.vel.add(this.accel);
        this.pos.add(this.vel);
    }
    delete() {
        this.game.delete(this);
    }
}