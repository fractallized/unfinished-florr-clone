import { Vector } from "./Vector.js";
export class Entity {
    constructor(arena, x, y, r, angle) {
        this.arena = arena;
        this.radius = r;
        this.pos = new Vector(x,y);
        this.pos.angle = angle;
        this.vel = new Vector(0,0);
        this.accel = new Vector(0,0);
        this.pendingDelete = false;
        this.friction = 0.9;
        this.lastDamaged = this.arena.server.tick;
    }
    tick() {
        this.vel.scale(this.friction);
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        if (this.pos.x < this.radius) this.pos.x = this.radius;
        else if (this.pos.x + this.radius > this.arena.width) this.pos.x = this.arena.width - this.radius;
        if (this.pos.y < this.radius) this.pos.y = this.radius;
        else if (this.pos.y + this.radius > this.arena.height) this.pos.y = this.arena.height - this.radius;
    }
    delete() { this.pendingDelete = true; this.arena.remove(this) }
    getCollisions() {
        const potential = [];
        for (const entity of Object.values(this.arena.entities)) {
            if (!entity.hasOwnProperty('pos') || !entity.hasOwnProperty('radius')) continue;
            if (this.pos.distanceSq(entity.pos) < (this.radius + entity.radius) ** 2) potential.push(entity);
        } //SUPER SLOW, O(N^2)
        return potential;
    }
    onCollide() {}
}