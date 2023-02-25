export default class Writer {
    packet: number[];
    constructor() {
        this.packet = [];
    }
    u8 = (x: number) => this.packet.push(Math.min(x,255));
    i32 = (x: number) => this.packet.push(...new Uint8Array(new Int32Array([x]).buffer));
    f32 = (x: number) => this.packet.push(...new Uint8Array(new Float32Array([x]).buffer));
    str = (x: string) => this.packet.push(...new TextEncoder().encode(x), 0);
    write = () => new Uint8Array(this.packet);
    reset = () => this.packet = [];
}