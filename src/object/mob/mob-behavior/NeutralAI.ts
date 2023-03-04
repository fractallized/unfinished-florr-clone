import Vector from "../../Vector";
import PassiveAI1 from "./PassiveAI";
import Entity from "../../Entity";
import Mob from "../Mob";

export default class NeutralAI1 extends PassiveAI1 {
    target: Entity | null = null;
    constructor(mob: Mob) {
        super(mob);
    }
    tick() {
        if (!this.target) return super.tick();
        if (this.target.pendingDelete) {
            this.input.set(0,0);
            this.target = null;
            return;
        }
        this.input.set2(Vector.sub(this.target.pos, this.mob.pos).normalize().scale(this.mob.aggroSpeed));
        //this.input.tick();
        this.mob.accel.set2(this.input);
        this.mob.pos.angle = this.input.angle ?? this.mob.pos.angle;
    }
    onDamage(ent: Entity) {
        if (!this.target) this.target = ent;
    }
}