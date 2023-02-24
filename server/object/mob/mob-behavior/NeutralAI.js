import { Vector } from "../../Vector.js";
import { PassiveAI1 } from "./PassiveAI.js";

export class NeutralAI1 extends PassiveAI1 {
    target = null;
    constructor(mob) {
        super(mob);
    }
    tick() {
        if (!this.target) return super.tick();
        if (this.target.pendingDelete) {
            this.input.set(0,0);
            this.target = null;
            return;
        }
        this.input.setTarget(Vector.sub(this.target.pos, this.mob.pos).normalize().scale(this.mob.aggroSpeed));
        this.input.tick();
        this.mob.accel.set2(this.input);
        this.mob.pos.angle = this.input.angle ?? this.mob.pos.angle;
    }
    onDamage(ent) {
        if (!this.target) this.target = ent;
    }
}