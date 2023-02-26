"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("../../Vector"));
const Petal_1 = __importDefault(require("../Petal"));
class Missile extends Petal_1.default {
    constructor(arena, player, outerPos, innerPos, pos, rarity, petalDefinition) {
        super(arena, player, outerPos, innerPos, pos, rarity, petalDefinition);
        this.isShot = false;
        this.shootTick = 0;
    }
    tick() {
        if (this.pendingDelete)
            return super.tick();
        if (this._arena._tick - this.creationTick > Missile.SHOOT_DELAY && !this.isShot && this.player.owner.input.input & 16) {
            this.isShot = true;
            this.shootTick = this._arena._tick;
            this.followNormalRotation = false;
            this.player.onPetalLoss(this.outerPos, this.innerPos);
        }
        if (this.isShot) {
            if (this._arena._tick - this.shootTick < 50)
                this.accel.set2(Vector_1.default.fromPolar(25, this.pos.angle));
            else
                this.delete();
        }
        else {
            this.pos.angle = Vector_1.default.sub(this.pos, this.player.pos).angle ?? 0;
        }
        super.tick();
    }
    delete() {
        if (!this.isShot)
            return super.delete();
        this.pendingDelete = true;
        this.friction = 0.5;
    }
}
exports.default = Missile;
Missile.SHOOT_DELAY = 25;
