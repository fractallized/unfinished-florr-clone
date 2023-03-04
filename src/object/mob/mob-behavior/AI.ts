import { Input } from "../../Client";
import Mob from "../Mob";
import Entity from "../../Entity";

export default class AI {
    mob: Mob;
    input = new Input(0,0);
    constructor(mob: Mob) {
        this.mob = mob;
    }
    tick() {}
    onDamage(_: Entity) {}
}