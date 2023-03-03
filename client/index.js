let entities = {};
let scale = 1; //global scaling
let staticScale = 1; //doesn't count fov;
let cameraEnt, arenaEnt, playerEnt;
const inventory = new Int32Array(800);
let ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.host}`);

const drawEntity = (ent) => {
    if (!ent.hasOwnProperty('pos')) return;
    ctx.setTransform(scale,0,0,scale,canvas.width/2,canvas.height/2);
    const {x, y} = ent.pos;
    ent.pos.lerpX += 0.2 * (x - ent.pos.lerpX);
    ent.pos.lerpY += 0.2 * (y - ent.pos.lerpY);
    ctx.translate(ent.pos.lerpX - cameraEnt.camera.lerpX, ent.pos.lerpY - cameraEnt.camera.lerpY);
    ctx.globalAlpha = ent.style.opacity / 255;
    const r = ent.pos.radius;
    if (ent.mob) {
        ctx.fillStyle = getColorByRarity(ent.mob.rarity);
        const text = getNameByRarity(ent.mob.rarity);
        const name = MOB_NAMES[ent.mob.id - 1];
        ctx.strokeStyle = '#000000';
        ctx.textAlign = 'right';
        ctx.font = `15px Ubuntu`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.strokeText(text, r*1.5, r*1.1+30);
        ctx.fillText(text, r*1.5, r*1.1+30);
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.beginPath();
        ctx.strokeText(name, -r*1.5, r*1.1+8);
        ctx.fillText(name, -r*1.5, r*1.1+8);
    }
    if (ent.health) {    
        ent.health.lerpHP += 0.2 * (ent.health.health - ent.health.lerpHP);
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-r*1.5,r*1.1+15);
        ctx.lineTo(r*1.5,r*1.1+15);
        ctx.stroke();
        ctx.strokeStyle = '#00bb00';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(-r*1.5,r*1.1+15);
        ctx.lineTo(-r*1.5+3*ent.health.lerpHP/255*r,r*1.1+15);
        ctx.stroke();
    }
    ent.pos.lerpAngle = angleLerp(ent.pos.lerpAngle, ent.pos.angle, 0.2);
    ctx.rotate(ent.pos.lerpAngle);
    ctx.beginPath();
    if (ent.mob) drawMobAsEnt(ent);
    else if (ent.drop) drawDrop(ent);
    else if (ent.petal) drawPetalAsEnt(ent);
    else if (ent.playerInfo) drawPlayer(ent);
    else drawPortal(ent);
}
let last = 0;
const loop = _ => {
    console.log(performance.now() - last + "ms");
    last = performance.now();
    cameraEnt = arenaEnt = playerEnt = null;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    staticScale = Math.max(canvas.width/1920,canvas.height/1080);
    if (!entities.hasOwnProperty('arena') || !entities.hasOwnProperty('camera')) {
        ctx.font = '50px Ubuntu';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 7;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.strokeText("Not Spawned", canvas.width/2, canvas.height/2);
        ctx.fillText("Not Spawned", canvas.width/2, canvas.height/2);
    } else {
        arenaEnt = entities[entities.arena];
        cameraEnt = entities[entities.camera];
        cameraEnt.camera.lerpX += 0.2 * (cameraEnt.camera.x - cameraEnt.camera.lerpX);
        cameraEnt.camera.lerpY += 0.2 * (cameraEnt.camera.y - cameraEnt.camera.lerpY);
        cameraEnt.camera.lerpFov += 0.2 * (cameraEnt.camera.fov - cameraEnt.camera.lerpFov);
        scale = staticScale * cameraEnt.camera.lerpFov;
        ctx.fillStyle = arenaPattern;
        ctx.strokeStyle = '#471a1a';
        ctx.lineWidth = 200;
        ctx.setTransform(scale,0,0,scale,canvas.width/2,canvas.height/2);
        ctx.translate(-cameraEnt.camera.lerpX,-cameraEnt.camera.lerpY);
        ctx.beginPath();
        ctx.rect(0,0,arenaEnt.arena.width,arenaEnt.arena.height);
        ctx.stroke();
        ctx.fill();
        for (const ent of Object.values(entities)) drawEntity(ent);
        playerEnt = entities[cameraEnt.camera.player];
        if (playerEnt) {
            const { numEquipped, petalsEquipped, petalCooldowns, petalHealths } = playerEnt.playerInfo;
            ctx.setTransform(staticScale,0,0,staticScale,canvas.width/2,canvas.height);
            ctx.scale(1.2,1.2);
            ctx.translate(-40 * numEquipped,-150);
            ctx.beginPath();
            ctx.globalAlpha = 0.8;
            for (let n = 0; n < numEquipped; n++) {
                ctx.drawImage(loadoutPatternCanvas, 0, 0);
                ctx.translate(80, 0);
            }
            ctx.setTransform(staticScale,0,0,staticScale,canvas.width/2,canvas.height);
            ctx.translate(-40 * numEquipped,-90);
            ctx.beginPath();
            ctx.globalAlpha = 0.8;
            for (let n = 0; n < numEquipped; n++) {
                ctx.drawImage(loadoutPatternCanvas, 0, 0);
                ctx.translate(80, 0);
            }
            ctx.globalAlpha = 1;
            for (let n = 0; n < numEquipped; n++) {
                CLIENT_RENDER.loadout[n].baseX = canvas.width/2 + staticScale * 1.2 * 40 * (2 * n - numEquipped + 1);
                CLIENT_RENDER.loadout[n].baseY = canvas.height - staticScale * 1.2 * 110;
                CLIENT_RENDER.loadout[n].squareRadius = staticScale * 1.2 * 30;
                CLIENT_RENDER.loadout[n].cd = petalCooldowns[n];
                CLIENT_RENDER.loadout[n].hp = petalHealths[n];
                if (CLIENT_RENDER.loadout[n].selected) continue;
                CLIENT_RENDER.loadout[n].tick();
                if (!petalsEquipped[n * 2]) continue;
                CLIENT_RENDER.loadout[n].draw();
            }
            for (let n = numEquipped; n < numEquipped * 2; n++) {
                CLIENT_RENDER.loadout[n].baseX = canvas.width/2 + staticScale * 40 * (2 * n - 3 * numEquipped + 1);
                CLIENT_RENDER.loadout[n].baseY = canvas.height - staticScale * 50;
                CLIENT_RENDER.loadout[n].squareRadius = staticScale * 30;
                if (CLIENT_RENDER.loadout[n].selected) continue;
                CLIENT_RENDER.loadout[n].tick();
                if (!petalsEquipped[n * 2]) continue;
                CLIENT_RENDER.loadout[n].draw();
            }
            let pos = 0;
            for (let rarity = 7; rarity >= 0; rarity--) {
                for (let id = 1; id < 12; id++) {
                    const n = (id - 1) * 8 + rarity;
                    if (!CLIENT_RENDER.inventory[n].count || CLIENT_RENDER.inventory[n].selected) continue;
                    CLIENT_RENDER.inventory[n].baseX = staticScale * (80 * (pos & 7) + 80);
                    CLIENT_RENDER.inventory[n].baseY = staticScale * (80 * (pos >> 3) + 80);
                    CLIENT_RENDER.inventory[n].squareRadius = staticScale * 30;
                    CLIENT_RENDER.inventory[n].tick();
                    CLIENT_RENDER.inventory[n].draw();
                    ++pos;
                }
            }
            if (CLIENT_RENDER.selected) {
                CLIENT_RENDER.selected.tick();
                CLIENT_RENDER.selected.draw();
            }
        }
    }
    if (ws.readyState === 1) ws.send(new Uint8Array([1,input | (!!attack << 4) | (!!defend << 5)]));
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);