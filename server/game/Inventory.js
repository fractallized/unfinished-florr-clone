import { RARITY_COUNT } from "../coder/Helpers.js";

export default class Inventory {
    constructor() {
        this.values = new Int32Array(RARITY_COUNT * 10);
        this.state = new Uint8Array(this.values.length);
        this.grandState = 2;
    }
    reset() {
        this.state.fill(0);
        this.grandState = 0;
    }
}
for (let n = 0; n < 8 * 10; n++) {
    Object.defineProperty(Inventory.prototype, n, {
        get() { return this.values[n] },
        set(v) { if (this.values[n] === v) return; this.grandState |= 1; this.state[n] |= 1; this.values[n] = v;}
    })
}