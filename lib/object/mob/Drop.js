"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_js_1 = __importDefault(require("../Entity.js"));
const Vector_js_1 = __importDefault(require("../Vector.js"));
const Vector_js_2 = require("../Vector.js");
const Components_js_1 = require("../Components.js");
class Drop extends Entity_js_1.default {
    constructor(arena, x, y, r, moveAngle, dropDefinition) {
        super(arena, x, y, r, 0);
        this.collectedBy = null;
        this.canCollide = false;
        this.drop = new Components_js_1.DropComponent(this, dropDefinition.id, dropDefinition.rarity);
        this.angle = new Vector_js_2.OneDimensionalVector(0, 3.8, 0);
        this.friction = 0.9;
        this.creationTick = this._arena._tick;
        this.vel.add(Vector_js_1.default.fromPolar(Drop.BASE_VELOCITY, moveAngle));
    }
    tick() {
        if (this._arena._tick - this.creationTick > (1 + this.drop.rarity) * 25 * 10)
            this.delete();
        if (this._arena._tick - this.creationTick === 15)
            this.canCollide = true;
        if (this.pendingDelete)
            return super.tick();
        if (this.collectedBy) {
            if (this.pos.distanceSq(this.collectedBy.pos) <= (this.pos.radius + this.collectedBy.pos.radius) ** 2) {
                this.collectedBy.owner.inventory.add((this.drop.id - 1) * 8 + this.drop.rarity, 1);
                this.delete();
                for (let n = 0; n < 2 * this.collectedBy.owner.numEquipped; n += 2) {
                    if (this.collectedBy.playerInfo.petalsEquipped.values[n])
                        continue;
                    this.collectedBy.changePetal(n >> 1, this.drop.id, this.drop.rarity);
                    return;
                }
                for (let n = 2 * this.collectedBy.owner.numEquipped; n < 4 * this.collectedBy.owner.numEquipped; n += 2) {
                    if (this.collectedBy.playerInfo.petalsEquipped.values[n])
                        continue;
                    this.collectedBy.changePetal(n >> 1, this.drop.id, this.drop.rarity);
                    return;
                }
                return;
            }
            this.vel.add(Vector_js_1.default.sub(this.collectedBy.pos, this.pos).normalize().scale(8));
            this.pos.angle += 0.4;
            return super.tick();
        }
        this.angle.tick();
        this.angle.vel *= 0.8;
        this.pos.angle = this.angle.pos;
        super.tick();
    }
    wipeState() {
        this.state = 0;
        this.drop.reset();
        super.wipeState();
    }
}
exports.default = Drop;
Drop.BASE_VELOCITY = 16;
