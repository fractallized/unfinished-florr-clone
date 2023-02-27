"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("../../../consts/Helpers");
const Petal_1 = __importDefault(require("../Petal"));
class HealPetal extends Petal_1.default {
    constructor(arena, player, outerPos, innerPos, pos, rarity, petal) {
        super(arena, player, outerPos, innerPos, pos, rarity, petal);
        this.heal = Helpers_1.PETAL_RARITY_MULTIPLIER[rarity] * (petal.definition.heal || 0);
    }
    tick() {
        if (this.pendingDelete)
            return super.tick();
        if (this.player.health.health === this.player.health.maxHealth || this._arena._tick - this.creationTick <= 25)
            return super.tick();
        if (this.heal < 0) {
            if (this.holdingRadius.pos < this.player.pos.radius) {
                this.healSelf(-this.heal);
                this.delete();
            }
            this.holdingRadius.accel = this.holdingRadius.pos * -0.02;
            this.holdingRadius.vel *= 0.75;
            this.holdingRadius.tick();
        }
        this.healSelf(this.heal);
        super.tick();
    }
}
exports.default = HealPetal;
