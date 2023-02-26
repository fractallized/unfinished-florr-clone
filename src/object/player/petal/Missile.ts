import { PetalDefinition } from "../../../consts/PetalDefinitions";
import Arena from "../../../game/Arena";
import Vector from "../../Vector";
import Petal from "../Petal";
import Player from "../Player";

export default class Missile extends Petal {
    static SHOOT_DELAY = 12;
    isShot = false;
    shootTick = 0;
    constructor(arena: Arena, player: Player, outerPos: number, innerPos: number, pos: number, rarity: number, petalDefinition: PetalDefinition) {
        super(arena, player, outerPos, innerPos, pos, rarity, petalDefinition);
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this._arena._tick - this.creationTick > Missile.SHOOT_DELAY && !this.isShot && this.player.owner.input.input & 16) {
            this.isShot = true;
            this.shootTick = this._arena._tick;
            this.followNormalRotation = false;
            this.player.onPetalLoss(this.outerPos, this.innerPos);
        }
        if (this.isShot) {
            if (this._arena._tick - this.shootTick < 50) this.accel.set2(Vector.fromPolar(25, this.pos.angle));
            else this.delete();
        } else {
            this.pos.angle = Vector.sub(this.pos, this.player.pos).angle ?? 0;
        }
        super.tick();
    }
    delete() {
        if (!this.isShot) return super.delete();
        this.pendingDelete = true; //don't onpetalloss again
        this.friction = 0.5;
    }
}