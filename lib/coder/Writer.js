"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Writer {
    constructor() {
        this.u8 = (x) => this.packet.push(Math.min(x, 255));
        this.i32 = (x) => this.packet.push(...new Uint8Array(new Int32Array([x]).buffer));
        this.f32 = (x) => this.packet.push(...new Uint8Array(new Float32Array([x]).buffer));
        this.str = (x) => this.packet.push(...new TextEncoder().encode(x), 0);
        this.write = () => new Uint8Array(this.packet);
        this.reset = () => this.packet = [];
        this.packet = [];
    }
}
exports.default = Writer;
