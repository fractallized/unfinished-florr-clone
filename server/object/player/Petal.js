import { COMPONENTS } from "../Components.js";
import { Entity } from "../Entity.js";
import { OneDimensionalVector, Vector } from "../Vector.js";
import { Mob } from "../mob/Mob.js";
import { PETAL_RARITY_MULTIPLIER } from "../../MobDefinitions.js";

//TODO: FIX UP FIELD GROUPS AND FINALIZE NECESSARY ONES

export class Petal extends Entity {
    constructor(arena, player, x, y, outerPos, innerPos, pos, rarity, petalDefinition) {
        super(arena, x, y, petalDefinition.radius, 0);

        this.petal = new COMPONENTS.PetalComponent(petalDefinition.id, rarity);
        this.health = new COMPONENTS.HealthComponent(petalDefinition.health * PETAL_RARITY_MULTIPLIER[rarity]);
        this.damage = petalDefinition.damage * PETAL_RARITY_MULTIPLIER[rarity];
        this.weight = 0.5;

        this.player = player;
        this.rotationPos = pos;
        this.outerPos = outerPos;
        this.innerPos = innerPos;
        this.holdingRadius = new OneDimensionalVector(0,20,0);
        this.pos.add(Vector.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc))
        
        this.petalDefinition = petalDefinition;
        
        this.creationTick = this._arena.server.tick;
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this.player.pendingDelete || this.player !== this._arena.entities[this.player.id]) return this.delete();
        const input = this.player.owner.input;
        const hoverRadius = 75 + (((input >> 4) & !this.petalDefinition.preventExtend) - ((input >> 5) & 1)) * 25;
        this.holdingRadius.accel = (hoverRadius - this.holdingRadius.pos) * 0.04;
        this.holdingRadius.vel *= 0.75;
        this.holdingRadius.tick();
        this.pos.set2(Vector.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc).add(this.player.pos));
        super.tick();
    }
    tick2() {
        super.tick(); //for heal petals
    }
    onCollide(ent) {
        if (ent instanceof Mob) {
            if (this._arena.server.tick - this.health.lastDamaged > 0) {
                this.health.health -= ent.damage;
                this.health.lastDamaged = this._arena.server.tick;
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
}