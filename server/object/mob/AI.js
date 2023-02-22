import { Player } from "../player/Player.js";
import { Vector } from "../Vector.js";

export class Input extends Vector {
    constructor(x, y) {
        super(x, y);
        this.targetX = x;
        this.targetY = y;
        this.input = 0;
    }
    setTarget(x, y) {
        this.targetX = x;
        this.targetY = y;
    }
    tick() {
        this.x += 0.1 * (this.targetX - this.x);
        this.y += 0.1 * (this.targetY - this.y);
    }
    get angle() {
        if (this.x && this.y) return Math.atan2(this.y, this.x);
        return null;
    }
}
export class AI {
    target = null;
    idleTick = -1;
    constructor(mob, range) {
        this._mob = mob;
        this.range = range;
        this.input = new Input(0,0);
    }
    tick() {
        if (this._mob.pendingDelete) return;
        if (this.target && !this.target.pendingDelete) {
            //chase target
            this.input.setTarget(this.target.pos.x - this._mob.pos.x, this.target.pos.y - this._mob.pos.y);
        } else {
            this.input.scale(0.9);
            if (this.idleTick - this._mob._arena._tick > 100) {
                this.idleTick = this._mob._arena._tick;
                this.input.set(Vector.fromPolar(2, Math.random() * Math.PI * 2));
            } else if (this.idleTick - this._mob._arena._tick === 25) this.input.set(0,0);
            //this.input.set(0,0);
            //this.input.setTarget(0,0);
            this.target = null;
            const possible = this.getCollisions();
            for (const ent of possible) {
                if (!(ent instanceof Player)) continue;
                if (this._mob.pos.distanceSq(ent.pos) > (this.range + ent.pos.radius) ** 2) continue;
                this.target = ent;
                break;
            }
        }
        this.input.tick();
    }
    getCollisions() { 
        const collisions = new Set();
        const possibleCollisions = this._mob._arena.collisionGrid.getEntityCollisions(this._mob, this.range);
        for (const entity of possibleCollisions) if (entity.canCollide) collisions.add(entity);
        return collisions;
    }
}