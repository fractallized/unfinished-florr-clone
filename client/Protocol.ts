class Reader {
    p: Uint8Array;
    i = 0;
    constructor(p: Uint8Array) {
        this.p = p;
    } 
    has() { return this.p.length > this.i }
    ru8() { return this.p[this.i] }
    u8() { return this.p[this.i++] }
    vu() {
        let out = 0, at = 0;
        while (this.p[this.i] & 0x80) {
            out |= (this.u8() & 0x7f) << at;
            at += 7;
        }
        out |= this.u8() << at;
        return out;
    }
    vi() { return this.vu() | 0; }
    f32() { return new Float32Array(this.p.slice(this.i, this.i += 4).buffer)[0] }
}
const MSPT = 40;