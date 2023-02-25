/* handles packets from client and sends back */
export default class Reader {
    packet: number[] | Uint8Array;
    index = 0;
    constructor(packet: number[] | Uint8Array) {
        this.packet = packet;
    }
    u8() { return this.packet[this.index++]; }
    i32() { return this.u8() | (this.u8() << 8) | (this.u8() << 16) | (this.u8() << 24)}
    f32() { return this.i32() / 65536 }
}