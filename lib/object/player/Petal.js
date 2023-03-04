"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = require("../Components");
const Entity_1 = __importDefault(require("../Entity"));
const Vector_1 = __importDefault(require("../Vector"));
const Helpers_1 = require("../../consts/Helpers");
class Petal extends Entity_1.default {
    constructor(arena, player, outerPos, innerPos, pos, rarity, petal) {
        const petalDefinition = petal.definition;
        super(arena, player.pos.x, player.pos.y, petalDefinition.radius, 0);
        this.ROTATION_FIRMNESS = 0.4;
        this.isFriendly = true;
        this.holdingRadius = 0;
        this.followNormalRotation = true;
        this.petal = new Components_1.PetalComponent(this, petalDefinition.id, rarity);
        this.health = new Components_1.HealthComponent(this, petalDefinition.health * Helpers_1.PETAL_RARITY_MULTIPLIER[rarity]);
        this.weight = Petal.BASE_WEIGHT;
        this.friction = Petal.BASE_FRICTION;
        this.player = player;
        this.rotationPos = pos;
        this.outerPos = outerPos;
        this.innerPos = innerPos;
        this.petalDefinition = petal;
        this.count = petalDefinition.repeat ? petalDefinition.repeat[rarity] : 1;
        this.damage = petalDefinition.damage * Helpers_1.PETAL_RARITY_MULTIPLIER[rarity] / this.count;
        this.poison = petalDefinition.poison ?? null;
        this.clump = petalDefinition.clump || false;
        this.creationTick = this._arena._tick;
    }
    tick() {
        if (this.pendingDelete)
            return super.tick();
        if (this.player.pendingDelete || this.player !== this._arena.entities.get(this.player.id))
            return this.delete();
        this.doOrbitMechanics();
        super.tick();
    }
    doOrbitMechanics() {
        if (this.followNormalRotation) {
            const input = this.player.owner.input.input;
            this.holdingRadius = 75;
            if (this.petalDefinition.definition.preventExtend) {
                if (input & 32)
                    this.holdingRadius = 37.5;
            }
            else {
                if (input & 16)
                    this.holdingRadius = 150;
                else if (input & 32)
                    this.holdingRadius = 37.5;
            }
        }
        if (this.clump)
            this.accel.set2(Vector_1.default.fromPolar(this.holdingRadius, this.player.rotationAngle + this.rotationPos * Helpers_1.PI_2 / this.player.numSpacesAlloc).add(Vector_1.default.fromPolar(10, this.innerPos * Helpers_1.PI_2 / this.count + this.player.rotationAngle * 0.2)).add(this.player.pos).sub(this.pos)).scale(this.ROTATION_FIRMNESS);
        else
            this.accel.set2(Vector_1.default.fromPolar(this.holdingRadius, this.player.rotationAngle + this.rotationPos * Helpers_1.PI_2 / this.player.numSpacesAlloc).add(this.player.pos).sub(this.pos)).scale(this.ROTATION_FIRMNESS);
    }
    onCollide(ent) {
        if (ent.isFriendly !== this.isFriendly) {
            if (this._arena._tick - this.health.lastDamaged > 2) {
                this.doDamage(ent.damage);
                this.health.lastDamaged = this._arena._tick;
                this.style.flags ^= 2;
            }
        }
        if (this.health.health === 0)
            this.delete();
    }
    delete() {
        this.player.onPetalLoss(this.outerPos, this.innerPos);
        super.delete();
    }
}
exports.default = Petal;
Petal.BASE_FRICTION = 0.5;
Petal.BASE_WEIGHT = 0.01;
