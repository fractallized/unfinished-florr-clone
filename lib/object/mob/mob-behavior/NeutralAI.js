"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("../../Vector"));
const PassiveAI_1 = __importDefault(require("./PassiveAI"));
class NeutralAI1 extends PassiveAI_1.default {
    constructor(mob) {
        super(mob);
        this.target = null;
    }
    tick() {
        if (!this.target)
            return super.tick();
        if (this.target.pendingDelete) {
            this.input.set(0, 0);
            this.target = null;
            return;
        }
        this.input.setTarget(Vector_1.default.sub(this.target.pos, this.mob.pos).normalize().scale(this.mob.aggroSpeed * 5.8));
        this.input.tick();
        this.mob.vel.set2(this.input);
        this.mob.pos.angle = this.input.angle ?? this.mob.pos.angle;
    }
    onDamage(ent) {
        if (!this.target)
            this.target = ent;
    }
}
exports.default = NeutralAI1;
