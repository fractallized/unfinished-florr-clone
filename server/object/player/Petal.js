import COMPONENTS from "../Components.js";
import Entity from "../Entity.js";
import Vector, { OneDimensionalVector } from "../Vector.js";
import Mob from "../mob/Mob.js";
import { PETAL_RARITY_MULTIPLIER } from "../../coder/Helpers.js";

//TODO: FIX UP FIELD GROUPS AND FINALIZE NECESSARY ONES

export default class Petal extends Entity {
    constructor(arena, player, outerPos, innerPos, pos, rarity, petalDefinition) {
        super(arena, player.pos.x, player.pos.y, petalDefinition.radius, 0);

        this.petal = new COMPONENTS.PetalComponent(this, petalDefinition.id, rarity);
        this.health = new COMPONENTS.HealthComponent(this, petalDefinition.health * PETAL_RARITY_MULTIPLIER[rarity]);
        
        this.weight = 0.2;
        this.friction = 0.5;
        this.player = player;
        this.rotationPos = pos;
        this.outerPos = outerPos;
        this.innerPos = innerPos;
        this.holdingRadius = new OneDimensionalVector(0,20,0);
        this.pos.add(Vector.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc))
        
        this.petalDefinition = {...petalDefinition};
        this.count = petalDefinition.repeat? petalDefinition.repeat[rarity]: 1;
        this.damage = petalDefinition.damage * PETAL_RARITY_MULTIPLIER[rarity] / this.count;
        this.clump = petalDefinition.clump | false;
        
        this.creationTick = this._arena._tick;
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this.player.pendingDelete || this.player !== this._arena.entities.get(this.player.id)) return this.delete();
        const input = this.player.owner.input;
        let hoverRadius = 75;
        if (this.petalDefinition.preventExtend) {
            if (input & 32) hoverRadius = 37.5;
        } else {
            if (input & 16) hoverRadius = 150;
            else if (input & 32) hoverRadius = 37.5;
        }
        this.holdingRadius.accel = (hoverRadius - this.holdingRadius.pos) * 0.04;
        this.holdingRadius.vel *= 0.8;
        this.holdingRadius.tick();
        if (this.clump) this.accel.set2(Vector.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc).add(Vector.fromPolar(10, this.innerPos * 2 * Math.PI / this.count)).add(this.player.pos).sub(this.pos));
        else this.accel.set2(Vector.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc).add(this.player.pos).sub(this.pos));
        super.tick();
    }
    onCollide(ent) {
        if (ent instanceof Mob) {
            if (this._arena._tick - this.health.lastDamaged > 2) {
                this.health.health -= ent.damage;
                this.health.lastDamaged = this._arena._tick;
            }
        }
        if (this.health.health < 0.0001) {
            this.health.health = 0;
            this.delete();
        }
    }
    delete() {
        this.player.onPetalLoss(this.outerPos, this.innerPos);
        super.delete();
    }
    wipeState() {
        this.health.reset();
        this.petal.reset();
        super.wipeState();
    }
}