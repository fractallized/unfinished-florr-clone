let input = 0;
let attack = defend = 0;
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
        case "Space":
            attack |= 2;
            break;
        case "ShiftLeft":
        case "ShiftRight":
            defend |= 2;
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
            break;
        case "Space":
            attack &= ~2;
            break;
        case "ShiftLeft":
        case "ShiftRight":
            defend &= ~2;
            break;
    }
}
canvas.onmousedown = async (e) => {
    e.preventDefault();
    if (e.button === 0) attack |= 1;
    else defend |= 1;
    if (CLIENT_RENDER.selected) return;
    for (const ent of CLIENT_RENDER.loadout) {
        if (!ent.id) continue;
        if (Math.abs(ent.x - e.clientX) > ent.squareRadius) continue;
        if (Math.abs(ent.y - e.clientY) > ent.squareRadius) continue;
        return ent.onmousedown(e);
    }
    for (const ent of CLIENT_RENDER.inventory) {
        if (!ent.count) continue;
        if (Math.abs(ent.x - e.clientX) > ent.squareRadius) continue;
        if (Math.abs(ent.y - e.clientY) > ent.squareRadius) continue;
        return ent.onmousedown(e);
    }
}
canvas.onmousemove = async (e) => {
    e.preventDefault();
    CLIENT_RENDER.selected && CLIENT_RENDER.selected.onmousemove(e);
}
canvas.onmouseup = async (e) => {
    e.preventDefault();
    if (e.button === 0) attack &= ~1;
    else defend &= ~1; 
    CLIENT_RENDER.selected && CLIENT_RENDER.selected.onmouseup(e);
}