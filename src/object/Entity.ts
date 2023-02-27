import Vector from "./Vector";
import Arena from "../game/Arena";
import { PositionComponent, StyleComponent } from "./Components";
import AbstractEntity from "./AbstractEntity";
export default class Entity extends AbstractEntity {
    static BASE_KNOCKBACK = 15;
    static BASE_FRICTION = 0.85;
    static BASE_WEIGHT = 1;

    _arena: Arena;
    friction = Entity.BASE_FRICTION;
    weight = Entity.BASE_WEIGHT;
    vel = new Vector(0,0);
    accel = new Vector(0,0);
    canCollide = true;
    pos: PositionComponent;
    style: StyleComponent;
    deleteAnimation: DeletionAnimation;
    gridBounds = [0,0,0,0];
    damage = 0;
    isFriendly = false;

    constructor(arena: Arena, x: number, y: number, r: number, angle: number) {
        super();
        this.pos = new PositionComponent(this, x, y, r, angle);
        this.style = new StyleComponent(this, 0, 1);
        this._arena = arena;

        this.deleteAnimation = new DeletionAnimation(this);
    }
    tick() {
        if (!this._arena) return;
        this.vel.scale(this.friction);
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        if (this.pos.x < this.pos.radius) this.pos.x = this.pos.radius;
        else if (this.pos.x + this.pos.radius > this._arena.arena.width) this.pos.x = this._arena.arena.width - this.pos.radius;
        if (this.pos.y < this.pos.radius) this.pos.y = this.pos.radius;
        else if (this.pos.y + this.pos.radius > this._arena.arena.height) this.pos.y = this._arena.arena.height - this.pos.radius;
        this._arena.collisionGrid.reinsert(this);
        if (this.pendingDelete) return this.deleteAnimation.tick();
    }
    delete() { 
        this.pendingDelete = true;
        this.canCollide = false;
        this.friction = 0.5;
    }
    getCollisions() { 
        const collisions = new Set<Entity>();
        const possibleCollisions = this._arena.collisionGrid.getEntityCollisions(this);
        for (const entity of possibleCollisions) if (entity.canCollide && !entity.pendingDelete) collisions.add(entity);
        return collisions;
    }
    collideWith(entity: Entity) {
        if (this.pendingDelete || entity.pendingDelete) return;
        this.onCollide(entity);
        entity.onCollide(this);
        let ratio = (entity.weight) / (this.weight + entity.weight);
        if (ratio === 0 || !Number.isFinite(ratio)) ratio = 0.5;
        const dist = Vector.sub(this.pos, entity.pos), _dist = dist.magnitude;
        if (_dist === 0) return;
        this.pos.add(dist.normalize().scale((this.pos.radius + entity.pos.radius - _dist + 0.5) * ratio)); //0.5 to prevent recollision
        entity.pos.add(dist.scale((ratio - 1) / ratio));
        entity.vel.add(dist.normalize().scale((1 - ratio) * Entity.BASE_KNOCKBACK));
        this.vel.add(dist.scale(ratio / (ratio - 1)));
    }
    onCollide(entity: Entity) {}
}

class DeletionAnimation {
    static DURATION = 5;
    entity: Entity;
    _arena: Arena;
    pos = -1;
    constructor(entity: Entity) {
        this.entity = entity;
        this._arena = entity._arena;
    }
    tick() {
        ++this.pos;
        if (this.pos === DeletionAnimation.DURATION) return this._arena.remove(this.entity);
        this.entity.pos.radius *= 1.1;
        this.entity.style.opacity *= 1 - (1 / DeletionAnimation.DURATION);
    }
}