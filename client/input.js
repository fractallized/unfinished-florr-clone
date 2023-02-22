let input = 0;
document.oncontextmenu = _ => false;
window.onkeydown = async ({ code }) => {
    switch(code) {
        case "KeyD":
            input |= 1;
            break;
        case "KeyS":
            input |= 2;
            break;
        case "KeyA":
            input |= 4;
            break;
        case "KeyW":
            input |= 8;
            break;
        case "KeyZ":
            break;
        case "Enter":
            if (ws.readyState === 1) ws.send(new Uint8Array([0]));
    }
}
window.onkeyup = async ({ code }) => {
    switch(code) {
        case "KeyD":
            input &= ~1;
            break;
        case "KeyS":
            input &= ~2;
            break;
        case "KeyA":
            input &= ~4;
            break;
        case "KeyW":
            input &= ~8; 
    }
}
class Reader {
    constructor(p) {
        this.p = p;
        this.i = 0;
    } 
    has() { return this.p.length > this.i }
    ru8() { return this.p[this.i] }
    u8() { return this.p[this.i++] }
    i32() { return this.u8() | (this.u8() << 8) | (this.u8() << 16) | (this.u8() << 24) }
    f32() { return new Float32Array(this.p.slice(this.i, this.i += 4).buffer)[0] }
}
canvas.onmousedown = async (e) => {
    e.preventDefault();
    if (e.button === 0) input |= 16;
    else input |= 32;
}
canvas.onmouseup = async (e) => {
    e.preventDefault();
    if (e.button === 0) input &= ~16;
    else input &= ~32; 
}