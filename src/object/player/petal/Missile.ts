import { PI_2 } from "../../../consts/Helpers";
import { PetalDefinition } from "../../../consts/PetalDefinitions";
import Arena from "../../../game/Arena";
import Entity from "../../Entity";
import Mob from "../../mob/Mob";
import Vector from "../../Vector";
import Petal from "../Petal";
import Player from "../Player";

export default class Missile extends Petal {
    static SHOOT_DELAY = 15;
    isShot = false;
    shootTick = 0;
    followNormalRotation = false;
    
    constructor(arena: Arena, player: Player, outerPos: number, innerPos: number, pos: number, rarity: number, petalDefinition: PetalDefinition) {
        super(arena, player, outerPos, innerPos, pos, rarity, petalDefinition);
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this._arena._tick - this.creationTick > Missile.SHOOT_DELAY && !this.isShot && this.player.owner.input.input & 16) {
            this.isShot = true;
            this.shootTick = this._arena._tick;
            this.player.onPetalLoss(this.outerPos, this.innerPos);
            if (this.petal.rarity > 4) this.findTarget();
            this.vel.set2(Vector.fromPolar(50, this.pos.angle));
            this.friction = 0.9;
        }
        super.tick();
    }
    doOrbitMechanics() {
        const input = this.player.owner.input.input;
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
        if (this.isShot) {
            if (this._arena._tick - this.shootTick < 50) this.accel.set2(Vector.fromPolar(4, this.pos.angle));
            else this.delete();
        } else {
            this.pos.angle = this.innerPos * PI_2 / this.count;
            this.accel.set2(Vector.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * PI_2 / this.player.numSpacesAlloc).add(Vector.fromPolar(12, this.pos.angle)).add(this.player.pos).sub(this.pos));
            if (this.count > 1) this.pos.angle += PI_2 / 4;
            this.accel.add(Vector.fromPolar(20, this.pos.angle));
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
                const angle = Math.abs(this.pos.angle - (Vector.sub(ent.pos, this.pos).angle ?? 0));
                if (angle > 1) continue;
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