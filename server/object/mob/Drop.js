import { Entity } from "../Entity.js";
import { Vector } from "../Vector.js";
import { COMPONENTS } from "../Components.js";
import { OneDimensionalVector } from "../Vector.js";

export class Drop extends Entity {
    static BASE_VELOCITY = 16;
    constructor(arena, x, y, r, moveAngle, dropDefinition) {
        super(arena, x, y, r, 0);
        this.style.color = 1;
        this.drop = new COMPONENTS.DropComponent(dropDefinition.id,dropDefinition.rarity); //id,rar

        this.angle = new OneDimensionalVector(0,3.2,0);
        this.friction = 0.8;
        this.creationTick = this._arena.server.tick;
        this.collectionTick = -1;
        this.collectedBy = null;
        this.vel.add(Vector.fromPolar(Drop.BASE_VELOCITY, moveAngle));
    }
    tick() {
        if (this.collectedBy) {
            //add to player now
            //diff delete animation
            if (this.pos.distanceSq(this.collectedBy.pos) <= (this.pos.radius + this.collectedBy.pos.radius) ** 2) this.delete();
            this.vel.add(Vector.sub(this.collectedBy.pos, this.pos).normalize().scale(16));
            this.pos.angle += 0.4;
            return super.tick();
        }
        this.angle.tick();
        this.angle.vel *= 0.8;
        this.pos.angle = this.angle.pos;
        super.tick();
    }
}