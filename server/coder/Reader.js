/* handles packets from client and sends back */
export class Reader {
    constructor(packet) {
        this.packet = packet;
        this.index = 0;
    }
    u8() { return this.packet[this.index++]; }
    i32() { return this.u8() | (this.u8() << 8) | (this.u8() << 16) | (this.u8() << 24)}
    f32() { return this.i32() / 65536 }
}