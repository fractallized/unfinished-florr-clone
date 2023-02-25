"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* handles packets from client and sends back */
class Reader {
    constructor(packet) {
        this.index = 0;
        this.packet = packet;
    }
    u8() { return this.packet[this.index++]; }
    i32() { return this.u8() | (this.u8() << 8) | (this.u8() << 16) | (this.u8() << 24); }
    f32() { return this.i32() / 65536; }
}
exports.default = Reader;
