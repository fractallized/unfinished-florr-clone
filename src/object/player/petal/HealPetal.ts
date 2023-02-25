import { PETAL_RARITY_MULTIPLIER } from "../../../consts/Helpers";
import Arena from "../../../game/Arena";
import { PetalDefinition } from "../../../consts/PetalDefinitions";
import Petal from "../Petal";
import Player from "../Player";
//TODO: FIX UP FIELD GROUPS AND FINALIZE NECESSARY ONES

export default class HealPetal extends Petal {
    heal: number;
    constructor(arena: Arena, player: Player, outerPos: number, innerPos: number, pos: number, rarity: number, petalDefinition: PetalDefinition) {
        super(arena, player, outerPos, innerPos, pos, rarity, petalDefinition);
        this.heal = PETAL_RARITY_MULTIPLIER[rarity] * (petalDefinition.heal || 0);
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this.player.health.health === this.player.health.maxHealth || this._arena._tick - this.creationTick <= 25) return super.tick();
        if (this.petalDefinition.heal < 0) {
            if (this.holdingRadius.pos < this.player.pos.radius) {
                this.player.health.health = Math.min(this.player.health.health - this.heal, this.player.health.maxHealth);
                this.delete();
            }
            this.holdingRadius.accel =  this.holdingRadius.pos * -0.02;
            this.holdingRadius.vel *= 0.75;
            this.holdingRadius.tick();
        } else this.player.health.health = Math.min(this.player.health.health + this.heal, this.player.health.maxHealth);
        super.tick();
    }
}