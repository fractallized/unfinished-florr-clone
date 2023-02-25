import Vector from "../../Vector";
import Mob from "../Mob";
import AI from "./AI";

export default class PassiveAI1 extends AI {
    lastIdle = -1;
    targetAngle = 0;
    constructor(mob: Mob) {
        super(mob);
    }
    tick() {
        if (this.mob._arena._tick - this.lastIdle > 100 && Math.random() < 0.05) {
            this.lastIdle = this.mob._arena._tick;
            this.targetAngle = Math.random() * 2 * Math.PI;
        } else if (this.mob._arena._tick - this.lastIdle < 5) this.mob.pos.angle += 0.1 * (this.targetAngle - this.mob.pos.angle);
        else if (this.mob._arena._tick - this.lastIdle < 15) this.input.setTarget(Vector.fromPolar(this.mob.passiveSpeed, this.mob.pos.angle));
        else this.input.set(0,0);
        this.input.tick();
        this.mob.accel.set2(this.input);
    }
}