import { Input } from "../../Client.js";

export default class AI {
    constructor(mob) {
        this.mob = mob;
        this.input = new Input(0,0);
    }
    tick() {}
    onDamage(_) {}
}