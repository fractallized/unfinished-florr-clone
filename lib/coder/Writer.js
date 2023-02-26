"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Writer {
    constructor() {
        this.u8 = (x) => this.packet.push(Math.min(x, 255));
        this.vu = (x) => {
            while (x >= 128) {
                this.u8((x & 127) | 128);
                x >>>= 7;
            }
            this.u8(x);
        };
        this.vi = (x) => this.vu(x >>> 0);
        this.f32 = (x) => this.packet.push(...new Uint8Array(new Float32Array([x]).buffer));
        this.str = (x) => this.packet.push(...new TextEncoder().encode(x), 0);
        this.write = () => new Uint8Array(this.packet);
        this.reset = () => this.packet = [];
        this.packet = [];
    }
}
exports.default = Writer;
