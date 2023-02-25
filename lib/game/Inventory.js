"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Helpers_js_1 = require("../consts/Helpers.js");
class Inventory {
    constructor() {
        this.grandState = 2;
        this.values = new Int32Array(Helpers_js_1.RARITY_COUNT * 10);
        this.state = new Uint8Array(this.values.length);
    }
    reset() {
        this.state.fill(0);
        this.grandState = 0;
    }
    get(n) {
        return this.values[n];
    }
    set(n, v) {
        if (this.values[n] === v)
            return;
        this.state[n] |= 1;
        this.grandState |= 1;
        this.values[n] = v;
    }
    add(n, i) {
        if (i === 0)
            return;
        this.state[n] |= 1;
        this.grandState |= 1;
        this.values[n] += i;
    }
}
exports.default = Inventory;
