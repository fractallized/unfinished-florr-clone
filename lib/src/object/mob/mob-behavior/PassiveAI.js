"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Vector_1 = __importDefault(require("../../Vector"));
const AI_1 = __importDefault(require("./AI"));
class PassiveAI1 extends AI_1.default {
    constructor(mob) {
        super(mob);
        this.lastIdle = -1;
        this.targetAngle = 0;
    }
    tick() {
        if (this.mob._arena._tick - this.lastIdle > 100 && Math.random() < 0.05) {
            this.lastIdle = this.mob._arena._tick;
            this.targetAngle = Math.random() * 2 * Math.PI;
        }
        else if (this.mob._arena._tick - this.lastIdle < 5)
            this.mob.pos.angle += 0.1 * (this.targetAngle - this.mob.pos.angle);
        else if (this.mob._arena._tick - this.lastIdle < 25)
            this.input.set2(Vector_1.default.fromPolar(this.mob.passiveSpeed, this.mob.pos.angle));
        else
            this.input.set(0, 0);
        this.mob.accel.set2(this.input);
    }
}
exports.default = PassiveAI1;
