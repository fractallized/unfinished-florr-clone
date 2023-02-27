import { minAngleDifference, PI_2 } from "../../../consts/Helpers";
import { PetalDefinition } from "../../../consts/PetalDefinitions";
import Arena from "../../../game/Arena";
import Entity from "../../Entity";
import Mob from "../../mob/Mob";
import Vector from "../../Vector";
import Petal from "../Petal";
import Player, { PlayerPetal } from "../Player";

export default class Missile extends Petal {
    static SHOOT_DELAY = 15;
    isShot = false;
    shootTick = 0;
    followNormalRotation = false;

    constructor(arena: Arena, player: Player, outerPos: number, innerPos: number, pos: number, rarity: number, petal: PlayerPetal) {
        super(arena, player, outerPos, innerPos, pos, rarity, petal);
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this._arena._tick - this.creationTick > Missile.SHOOT_DELAY && !this.isShot && this.player.owner.input.input & 16) {
            this.isShot = true;
            this.shootTick = this._arena._tick;
            this.player.onPetalLoss(this.outerPos, this.innerPos);
            if (this.petal.rarity > 4) this.findTarget();
            this.vel.set2(Vector.fromPolar(40, this.pos.angle));
            this.friction = 0.9;
        }
        super.tick();
    }
    doOrbitMechanics() {
        if (this.isShot) {
            if (this._arena._tick - this.shootTick < 50) {
                this.accel.set2(Vector.fromPolar(4, this.pos.angle));
            }
            else this.delete();
        } else {
            super.doOrbitMechanics();
            this.pos.angle = (this.player.rotationAngle + this.rotationPos * PI_2 / this.player.numSpacesAlloc) % PI_2;
        }
    }
    findTarget() {
        const possibles = this._arena.collisionGrid.getEntityCollisions(this, 100 * this.petal.rarity);
        let minMob: Entity | null = null;
        let minDist = Number.MAX_VALUE;
        for (const ent of possibles) {
            if (ent instanceof Mob && ent.isFriendly !== this.isFriendly) {
                const distSq = this.pos.distanceSq(ent.pos);
                if (distSq > (100 * this.petal.rarity) ** 2) continue;
                if (minAngleDifference(this.pos.angle, Vector.sub(ent.pos, this.pos).angle ?? 0) > 1) continue;
                if (distSq < minDist) {
                    minDist = distSq;
                    minMob = ent;
                }
            }
        }
        if (minMob) this.pos.angle = Vector.sub(minMob.pos, this.pos).angle ?? this.pos.angle;
    }
    delete() {
        if (!this.isShot) return super.delete();
        this.pendingDelete = true; //don't onpetalloss again
        this.friction = 0.5;
    }
}