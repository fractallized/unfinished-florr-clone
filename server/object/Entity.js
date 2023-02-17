import { Vector } from "./Vector.js";
import { COMPONENTS } from "./Components.js";
import { SpatialHash } from "../game/Collisions.js";

export class Entity {
    static BASE_KNOCKBACK = 5;
    static BASE_FRICTION = 0.9;
    static BASE_WEIGHT = 1;

    vel = new Vector(0,0);
    accel = new Vector(0,0);
    gridHash = -1;
    pendingDelete = false;
    canCollide = true;
    state = 2; //create
    gridBounds = [];

    constructor(arena, x, y, r, angle) {
        this._arena = arena;

        this.pos = new COMPONENTS.PositionComponent(this, x, y, angle, r);
        this.style = new COMPONENTS.StyleComponent(this, 0, 1);

        this.friction = Entity.BASE_FRICTION;
        this.weight = Entity.BASE_WEIGHT;
        this.deleteAnimation = new DeletionAnimation(this);
    }
    tick() {
        if (this.pendingDelete) return this.deleteAnimation.tick();
        this.vel.scale(this.friction);
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        if (this.pos.x < this.pos.radius) this.pos.x = this.pos.radius;
        else if (this.pos.x + this.pos.radius > this._arena.arena.width) this.pos.x = this._arena.arena.width - this.pos.radius;
        if (this.pos.y < this.pos.radius) this.pos.y = this.pos.radius;
        else if (this.pos.y + this.pos.radius > this._arena.arena.height) this.pos.y = this._arena.arena.height - this.pos.radius;
        if (true) { //rethink this
            this._arena.collisionGrid.remove(this);
            this.gridHash = this._arena.collisionGrid.insert(this);
        }
    }
    delete() { 
        this.pendingDelete = true;
    }
    getCollisions() { 
        const collisions = new Set();
        const possibleCollisions = this._arena.collisionGrid.getEntityCollisions(this);
        for (const entity of possibleCollisions) if (entity.canCollide) collisions.add(entity);
        return collisions;
    }
    collideWith(entity) {
        this.onCollide(entity);
        entity.onCollide(this);
        if (this.pendingDelete || entity.pendingDelete) return;
        let ratio = (entity.weight) / (this.weight + entity.weight);
        if (ratio === 0 || !Number.isFinite(ratio)) ratio = 0.5;
        const dist = Vector.sub(this.pos, entity.pos), _dist = dist.magnitude;
        if (_dist === 0) return;
        this.pos.add(dist.normalize().scale((this.pos.radius + entity.pos.radius - _dist + 0.5) * ratio)); //0.5 to prevent recollision
        entity.pos.add(dist.scale((ratio - 1) / ratio));
        entity.vel.add(dist.normalize().scale(ratio * Entity.BASE_KNOCKBACK));
        this.vel.add(dist.scale(-1));
    }
    onCollide(entity) {}
    wipeState() {
        this.state &= ~3;
        this.pos.reset();
        this.style.reset();
    }
}

class DeletionAnimation {
    static DURATION = 5;
    constructor(entity) {
        this.entity = entity;
        this._arena = entity._arena;
        this.pos = -1;
    }
    tick() {
        this._arena.collisionGrid.remove(this.entity);
        ++this.pos;
        if (this.pos === DeletionAnimation.DURATION) return this._arena.removeFromActive(this.entity);
        if (this.pos === DeletionAnimation.DURATION + 1) return this._arena.delete(this.entity);
        this.entity.pos.radius *= 1.1;
        this.entity.style.opacity *= 1 - (1 / DeletionAnimation.DURATION);
    }
}