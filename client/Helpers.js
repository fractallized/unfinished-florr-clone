"use strict";
const lerp = (start, end, t) => {
    t = Math.max(Math.min(t, 1), 0);
    return start + (end - start) * t;
};
const lerpTime = (last, length) => (performance.now() - last) / length;
const angleLerp = (curr, target, pct) => {
    pct = Math.max(Math.min(pct, 1), 0);
    if (Math.abs(curr - target) > PI_2 / 2) {
        if (target > curr) curr += PI_2;
        else target += PI_2;
    }
    curr = curr * (1 - pct) + target * pct;
    if (curr > PI_2 / 2) curr -= PI_2;
    return curr;
}
const PETAL_NAMES = 
['Basic','Light','Stinger','Rose','Leaf','Wing','Antennae',
'Rock','Faster','Iris','Missile'];
const MOB_NAMES = ['Baby Ant','Worker Ant','Soldier Ant','Ladybug','Bee'];
const MOB_SIZE_MULTIPLIER = [1, 1.2, 1.5, 2, 3, 4, 6, 10];
function getStroke(color, black = 0.64) {
    return "#" +
    (Math.min(Math.round(parseInt(color.slice(1,3), 16) * black), 255)).toString(16).padStart(2, '0') + 
    (Math.min(Math.round(parseInt(color.slice(3,5), 16) * black), 255)).toString(16).padStart(2, '0') + 
    (Math.min(Math.round(parseInt(color.slice(5,7), 16) * black), 255)).toString(16).padStart(2, '0');
}
function getColorByRarity(rarity) {
    if (rarity === 0) return '#7eef6d';
    if (rarity === 1) return '#ffe65d';
    if (rarity === 2) return '#4d52e3';
    if (rarity === 3) return '#861fde';
    if (rarity === 4) return '#de1f1f';
    if (rarity === 5) return '#1fdbde';
    if (rarity === 6) return '#ff2b75';
    if (rarity === 7) return '#2bffa3';
    else return '#999999';
}
function getNameByRarity(rarity) {
    if (rarity === 0) return 'Common';
    if (rarity === 1) return 'Unusual';
    if (rarity === 2) return 'Rare';
    if (rarity === 3) return 'Epic';
    if (rarity === 4) return 'Legendary';
    if (rarity === 5) return 'Mythic';
    if (rarity === 6) return 'Ultra';
    if (rarity === 7) return 'Super';
    else return '???';
}
////////////////////////////////
let input = 0, attack = 0, defend = 0;
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
    if (clientRender.selected) return;
    for (const ent of Object.values(clientRender.entities)) {
        if (Math.abs(ent.pos.x - e.clientX) > ent.pos.radius) continue;
        if (Math.abs(ent.pos.y - e.clientY) > ent.pos.radius) continue;
        return ent.onmousedown(e);
    }
}
canvas.onmousemove = async (e) => {
    e.preventDefault();
    clientRender.selected && clientRender.selected.onmousemove(e);
}
canvas.onmouseup = async (e) => {
    e.preventDefault();
    if (e.button === 0) attack &= ~1;
    else defend &= ~1; 
    clientRender.selected && clientRender.selected.onmouseup(e);
}
