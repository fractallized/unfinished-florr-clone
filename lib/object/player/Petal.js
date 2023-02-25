"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Components_1 = require("../Components");
const Entity_1 = __importDefault(require("../Entity"));
const Vector_1 = __importStar(require("../Vector"));
const Mob_1 = __importDefault(require("../mob/Mob"));
const Helpers_1 = require("../../consts/Helpers");
class Petal extends Entity_1.default {
    constructor(arena, player, outerPos, innerPos, pos, rarity, petalDefinition) {
        super(arena, player.pos.x, player.pos.y, petalDefinition.radius, 0);
        this.holdingRadius = new Vector_1.OneDimensionalVector(0, 20, 0);
        this.petal = new Components_1.PetalComponent(this, petalDefinition.id, rarity);
        this.health = new Components_1.HealthComponent(this, petalDefinition.health * Helpers_1.PETAL_RARITY_MULTIPLIER[rarity]);
        this.weight = 0.01;
        this.friction = 0.5;
        this.player = player;
        this.rotationPos = pos;
        this.outerPos = outerPos;
        this.innerPos = innerPos;
        this.pos.add(Vector_1.default.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc));
        this.petalDefinition = petalDefinition;
        this.count = petalDefinition.repeat ? petalDefinition.repeat[rarity] : 1;
        this.damage = petalDefinition.damage * Helpers_1.PETAL_RARITY_MULTIPLIER[rarity] / this.count;
        this.clump = petalDefinition.clump || false;
        this.creationTick = this._arena._tick;
    }
    tick() {
        if (this.pendingDelete)
            return super.tick();
        if (this.player.pendingDelete || this.player !== this._arena.entities.get(this.player.id))
            return this.delete();
        const input = this.player.owner.input.input;
        let hoverRadius = 75;
        if (this.petalDefinition.preventExtend) {
            if (input & 32)
                hoverRadius = 37.5;
        }
        else {
            if (input & 16)
                hoverRadius = 150;
            else if (input & 32)
                hoverRadius = 37.5;
        }
        this.holdingRadius.accel = (hoverRadius - this.holdingRadius.pos) * 0.04;
        this.holdingRadius.vel *= 0.8;
        this.holdingRadius.tick();
        if (this.clump)
            this.accel.set2(Vector_1.default.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc).add(Vector_1.default.fromPolar(10, this.innerPos * 2 * Math.PI / this.count)).add(this.player.pos).sub(this.pos));
        else
            this.accel.set2(Vector_1.default.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc).add(this.player.pos).sub(this.pos));
        super.tick();
    }
    onCollide(ent) {
        if (ent instanceof Mob_1.default) {
            if (this._arena._tick - this.health.lastDamaged > 2) {
                this.health.health -= ent.damage;
                this.health.lastDamaged = this._arena._tick;
            }
        }
        if (this.health.health < 0.0001) {
            this.health.health = 0;
            this.delete();
        }
    }
    delete() {
        this.player.onPetalLoss(this.outerPos, this.innerPos);
        super.delete();
    }
}
exports.default = Petal;
