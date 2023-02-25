"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("../../Client");
class AI {
    constructor(mob) {
        this.input = new Client_1.Input(0, 0);
        this.mob = mob;
    }
    tick() { }
    onDamage(ent) { }
}
exports.default = AI;
