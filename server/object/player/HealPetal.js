import { COMPONENTS } from "../Components.js";
import { OneDimensionalVector, Vector } from "../Vector.js";
import { PETAL_RARITY_MULTIPLIER } from "../../MobDefinitions.js";
import { Petal } from "./Petal.js";

//TODO: FIX UP FIELD GROUPS AND FINALIZE NECESSARY ONES

export class HealPetal extends Petal {
    constructor(arena, player, x, y, outerPos, innerPos, pos, rarity, petalDefinition) {
        super(arena, player, x, y, outerPos, innerPos, pos, rarity, petalDefinition);
        this.petalDefinition.heal *= PETAL_RARITY_MULTIPLIER[rarity];
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this.player.pendingDelete || this.player !== this._arena.entities[this.player.id]) return this.delete();
        if (this.player.health.health === this.player.health.maxHealth || this._arena.server.tick - this.creationTick <= 25) return super.tick();
        if (this.petalDefinition.heal < 0) {
            if (this.holdingRadius.pos < this.player.pos.radius) {
                this.player.health.health = Math.min(this.player.health.health - this.petalDefinition.heal, this.player.health.maxHealth);
                this.delete();
            }
            this.holdingRadius.accel =  this.holdingRadius.pos * -0.02;
            this.holdingRadius.vel *= 0.75;
            this.holdingRadius.tick();
            this.pos.set2(Vector.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc).add(this.player.pos));
            return super.tick2();
        } else {
            this.player.health.health = Math.min(this.player.health.health + this.petalDefinition.heal, this.player.health.maxHealth);
        }
        super.tick();
    }
}