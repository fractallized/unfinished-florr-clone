let input = 0;
document.oncontextmenu = _ => false;
window.onkeydown = async ({ code }) => {
    switch(code) {
        case "KeyE":
            if (ws.readyState === 1) ws.send(new Uint8Array([2,4,3,0]));
            break;
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
            clientSimulation.inventory.change();
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
    const dx = (e.clientX - clientSimulation.inventory.x * staticScale) / 60 / staticScale - 0.5;
    const dy = (e.clientY - (canvas.height/devicePixelRatio + clientSimulation.inventory.y * staticScale)) / 60 / staticScale - 0.5;
    if (dx >= 0 && dx < 6) {
        if (dy >= 0 && dy < 10) {
            const hash = (dy | 0) * 6 + (dx | 0);
            const possible = Object.values(clientSimulation.inventoryLayout)[hash];
            if (possible) {
                clientSimulation.pendingEquip.id = possible.petalID;
                clientSimulation.pendingEquip.rarity = possible.rarity;
                clientSimulation.pendingEquip.onmousedown(e);
            }
        }
    }
    for (const b of Object.values(clientSimulation.loadout)) {
        if (Math.abs(b.x - e.clientX) / staticScale > 40) continue;
        if (Math.abs(b.y - e.clientY) / staticScale > 40) continue;
        return b.onmousedown(e);
    }
}
canvas.onmousemove = async (e) => {
    if (clientSimulation.selected) clientSimulation.selected.onmousemove(e);
}
canvas.onmouseup = async (e) => {
    e.preventDefault();
    if (e.button === 0) input &= ~16;
    else input &= ~32; 
    if (clientSimulation.selected) clientSimulation.selected.onmouseup(e);
}