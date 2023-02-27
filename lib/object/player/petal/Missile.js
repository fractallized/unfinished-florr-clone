"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_1 = require("../../../consts/Helpers");
const Mob_1 = __importDefault(require("../../mob/Mob"));
const Vector_1 = __importDefault(require("../../Vector"));
const Petal_1 = __importDefault(require("../Petal"));
class Missile extends Petal_1.default {
    constructor(arena, player, outerPos, innerPos, pos, rarity, petal) {
        super(arena, player, outerPos, innerPos, pos, rarity, petal);
        this.isShot = false;
        this.shootTick = 0;
        this.followNormalRotation = false;
    }
    tick() {
        if (this.pendingDelete)
            return super.tick();
        if (this._arena._tick - this.creationTick > Missile.SHOOT_DELAY && !this.isShot && this.player.owner.input.input & 16) {
            this.isShot = true;
            this.shootTick = this._arena._tick;
            this.player.onPetalLoss(this.outerPos, this.innerPos);
            if (this.petal.rarity > 4)
                this.findTarget();
            this.vel.set2(Vector_1.default.fromPolar(40, this.pos.angle));
            this.friction = 0.9;
        }
        super.tick();
    }
    doOrbitMechanics() {
        if (this.isShot) {
            if (this._arena._tick - this.shootTick < 50) {
                this.accel.set2(Vector_1.default.fromPolar(4, this.pos.angle));
            }
            else
                this.delete();
        }
        else {
            super.doOrbitMechanics();
            this.pos.angle = (this.player.rotationAngle + this.rotationPos * Helpers_1.PI_2 / this.player.numSpacesAlloc) % Helpers_1.PI_2;
        }
    }
    findTarget() {
        const possibles = this._arena.collisionGrid.getEntityCollisions(this, 100 * this.petal.rarity);
        let minMob = null;
        let minDist = Number.MAX_VALUE;
        for (const ent of possibles) {
            if (ent instanceof Mob_1.default && ent.isFriendly !== this.isFriendly) {
                const distSq = this.pos.distanceSq(ent.pos);
                if (distSq > (100 * this.petal.rarity) ** 2)
                    continue;
                if ((0, Helpers_1.minAngleDifference)(this.pos.angle, Vector_1.default.sub(ent.pos, this.pos).angle ?? 0) > 1)
                    continue;
                if (distSq < minDist) {
                    minDist = distSq;
                    minMob = ent;
                }
            }
        }
        if (minMob)
            this.pos.angle = Vector_1.default.sub(minMob.pos, this.pos).angle ?? this.pos.angle;
    }
    delete() {
        if (!this.isShot)
            return super.delete();
        this.pendingDelete = true;
        this.friction = 0.5;
    }
}
exports.default = Missile;
Missile.SHOOT_DELAY = 15;
