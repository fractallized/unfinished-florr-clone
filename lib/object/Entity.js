"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("./Vector"));
const Components_1 = require("./Components");
const AbstractEntity_1 = __importDefault(require("./AbstractEntity"));
class Entity extends AbstractEntity_1.default {
    constructor(arena, x, y, r, angle) {
        super();
        this.friction = Entity.BASE_FRICTION;
        this.weight = Entity.BASE_WEIGHT;
        this.vel = new Vector_1.default(0, 0);
        this.accel = new Vector_1.default(0, 0);
        this.canCollide = true;
        this.gridBounds = [0, 0, 0, 0];
        this.damage = 0;
        this.pos = new Components_1.PositionComponent(this, x, y, r, angle);
        this.style = new Components_1.StyleComponent(this, 0, 1);
        this._arena = arena;
        this.deleteAnimation = new DeletionAnimation(this);
    }
    tick() {
        if (!this._arena)
            return;
        this.vel.scale(this.friction);
        this.vel.add(this.accel);
        this.pos.add(this.vel);
        if (this.pos.x < this.pos.radius)
            this.pos.x = this.pos.radius;
        else if (this.pos.x + this.pos.radius > this._arena.arena.width)
            this.pos.x = this._arena.arena.width - this.pos.radius;
        if (this.pos.y < this.pos.radius)
            this.pos.y = this.pos.radius;
        else if (this.pos.y + this.pos.radius > this._arena.arena.height)
            this.pos.y = this._arena.arena.height - this.pos.radius;
        if (this.pendingDelete)
            return this.deleteAnimation.tick();
        if (true) { //rethink this
            this._arena.collisionGrid.remove(this);
            this._arena.collisionGrid.insert(this);
        }
    }
    delete() {
        this.pendingDelete = true;
    }
    getCollisions() {
        const collisions = new Set();
        const possibleCollisions = this._arena.collisionGrid.getEntityCollisions(this);
        for (const entity of possibleCollisions)
            if (entity.canCollide && !entity.pendingDelete)
                collisions.add(entity);
        return collisions;
    }
    collideWith(entity) {
        if (this.pendingDelete || entity.pendingDelete)
            return;
        this.onCollide(entity);
        entity.onCollide(this);
        let ratio = (entity.weight) / (this.weight + entity.weight);
        if (ratio === 0 || !Number.isFinite(ratio))
            ratio = 0.5;
        const dist = Vector_1.default.sub(this.pos, entity.pos), _dist = dist.magnitude;
        if (_dist === 0)
            return;
        this.pos.add(dist.normalize().scale((this.pos.radius + entity.pos.radius - _dist + 0.5) * ratio)); //0.5 to prevent recollision
        entity.pos.add(dist.scale((ratio - 1) / ratio));
        entity.vel.add(dist.normalize().scale((1 - ratio) * Entity.BASE_KNOCKBACK));
        this.vel.add(dist.scale(ratio / (ratio - 1)));
    }
    onCollide(entity) { }
    wipeState() {
        this.state = 0;
        this.pos.reset();
        this.style.reset();
    }
}
exports.default = Entity;
Entity.BASE_KNOCKBACK = 2;
Entity.BASE_FRICTION = 0.85;
Entity.BASE_WEIGHT = 1;
class DeletionAnimation {
    constructor(entity) {
        this.pos = -1;
        this.entity = entity;
        this._arena = entity._arena;
    }
    tick() {
        ++this.pos;
        if (this.pos === DeletionAnimation.DURATION)
            return this._arena.removeFromActive(this.entity);
        if (this.pos === DeletionAnimation.DURATION + 1)
            return this._arena.remove(this.entity);
        this.entity.pos.radius *= 1.1;
        this.entity.style.opacity *= 1 - (1 / DeletionAnimation.DURATION);
    }
}
DeletionAnimation.DURATION = 5;
