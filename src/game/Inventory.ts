import { RARITY_COUNT } from "../coder/Helpers.js";

export default class Inventory {
    values: Int32Array;
    state: Uint8Array;
    grandState = 2;
    constructor() {
        this.values = new Int32Array(RARITY_COUNT * 10);
        this.state = new Uint8Array(this.values.length);
    }
    reset() {
        this.state.fill(0);
        this.grandState = 0;
    }
    get(n: number) {
        return this.values[n];
    }
    set(n: number, v: number) {
        if (this.values[n] === v) return;
        this.state[n] |= 1;
        this.grandState |= 1;
        this.values[n] = v;
    }
    add(n: number, i: number) {
        if (i === 0) return;
        this.state[n] |= 1;
        this.grandState |= 1;
        this.values[n] += i;
    }
}