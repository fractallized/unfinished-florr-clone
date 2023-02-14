export class Inventory {
    constructor(entity) {
        this.values = new Int32Array(6 * 10);
        this.state = new Uint8Array(60);
        this.grandState = 2;
    }
    reset() {
        this.state.fill(0);
        this.grandState = 0;
    }
}
for (let n = 0; n < 60; n++) {
    Object.defineProperty(Inventory.prototype, n, {
        get() { return this.values[n] },
        set(v) { if (this.values[n] === v) return; this.grandState |= 1; this.state[n] |= 1; this.values[n] = v;}
    })
}