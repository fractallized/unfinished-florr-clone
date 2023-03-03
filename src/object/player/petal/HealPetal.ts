import { PETAL_RARITY_MULTIPLIER } from "../../../consts/Helpers";
import Arena from "../../../game/Arena";
import Vector from "../../Vector";
import Petal from "../Petal";
import Player, { PlayerPetal } from "../Player";
//TODO: FIX UP FIELD GROUPS AND FINALIZE NECESSARY ONES

export default class HealPetal extends Petal {
    heal: number;
    constructor(arena: Arena, player: Player, outerPos: number, innerPos: number, pos: number, rarity: number, petal: PlayerPetal) {
        super(arena, player, outerPos, innerPos, pos, rarity, petal);
        this.heal = PETAL_RARITY_MULTIPLIER[rarity] * (petal.definition.heal || 0);
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this.player.health.health === this.player.health.maxHealth || this._arena._tick - this.creationTick <= 25) return super.tick();
        if (this.heal < 0) {
            if (this.pos.distanceSq(this.player.pos) <= (this.pos.radius + this.player.pos.radius) ** 2) {
                this.player.healSelf(-this.heal);
                this.delete();
            }
            this.followNormalRotation = false;
            this.ROTATION_FIRMNESS = 0.2;
            this.holdingRadius = 0;
        } else this.player.healSelf(this.heal);
        super.tick();
    }
}