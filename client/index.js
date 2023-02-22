let entities = {};
let scale = 1; //global scaling
let staticScale = 1; //doesn't count fov;
let cameraEnt, arenaEnt, playerEnt;
const inventory = new Int32Array(80);
let ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.host}`);

const drawEntity = (ent) => {
    if (!ent.hasOwnProperty('pos')) return;
    ctx.setTransform(scale,0,0,scale,canvas.width/2,canvas.height/2);
    const {x, y} = ent.pos;
    ent.pos.lerpX += 0.2 * (x - ent.pos.lerpX);
    ent.pos.lerpY += 0.2 * (y - ent.pos.lerpY);
    ctx.translate(ent.pos.lerpX - cameraEnt.camera.lerpX, ent.pos.lerpY - cameraEnt.camera.lerpY);
    ctx.globalAlpha = ent.style.opacity;
    const r = ent.pos.radius;
    if (ent.mob) {
        ctx.fillStyle = getColorByRarity(ent.mob.rarity);
        const text = getNameByRarity(ent.mob.rarity);
        const name = MOB_NAMES[ent.mob.id - 1];
        ctx.strokeStyle = '#000000';
        ctx.textAlign = 'right';
        ctx.font = '8px Ubuntu';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.strokeText(text, r*1.5, r*1.1+25);
        ctx.fillText(text, r*1.5, r*1.1+25);
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
    ent.pos.lerpAngle += 0.2 * (ent.pos.angle - ent.pos.lerpAngle);
    ctx.rotate(ent.pos.lerpAngle);
    ctx.beginPath();
    if (ent.mob) drawMobAsEnt(ent);
    else if (ent.drop) drawDrop(ent);
    else if (ent.petal) drawPetalAsEnt(ent);
    else if (ent.playerInfo) drawPlayer(ent);
    else drawPortal(ent);
}
const loop = _ => {
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
        scale = staticScale * cameraEnt.camera.fov;
        const matrix = new DOMMatrix([1,0,0,1,0,0]);
        arenaPattern.setTransform(matrix);
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
            ctx.setTransform(staticScale,0,0,staticScale,canvas.width/2,canvas.height);
            ctx.scale(1.2,1.2);
            ctx.translate(40 * (- numEquipped - 1),-110);
            for (let n = 0; n < numEquipped; n++) {
                ctx.translate(80,0);
                if (!petalsEquipped[n * 2]) continue;
                ctx.save();
                drawLoadoutPetal(petalsEquipped[n * 2],petalsEquipped[n * 2 + 1],petalCooldowns[n],petalHealths[n])
                ctx.restore();
            }
            ctx.setTransform(staticScale,0,0,staticScale,canvas.width/2,canvas.height);
            ctx.translate(40 * (- numEquipped - 1),-50);
            for (let n = numEquipped; n < numEquipped * 2; n++) {
                ctx.translate(80,0);
                if (!petalsEquipped[n * 2]) continue;
                ctx.save();
                drawLoadoutPetal(petalsEquipped[n * 2],petalsEquipped[n * 2 + 1],255,0)
                ctx.restore();
            }
            let pos = 0;
            for (let rarity = 7; rarity >= 0; rarity--) {
                for (let id = 1; id < 10; id++) {
                    if (!inventory[(id - 1) * 8 + rarity]) continue;
                    ctx.setTransform(staticScale,0,0,staticScale,0,0);
                    ctx.translate(80 * (pos & 7) + 80, 80 * (pos >> 3) + 80);
                    ctx.save();
                    drawLoadoutPetal(id, rarity, 255, 0);
                    ctx.restore();
                    ++pos;
                    if (inventory[(id - 1) * 8 + rarity] === 1) continue;
                    ctx.translate(20,-20);
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#000000';
                    ctx.font = '15px Ubuntu';
                    ctx.textAlign = 'center';
                    ctx.lineWidth = 3;
                    ctx.rotate(0.5);
                    ctx.beginPath();
                    ctx.strokeText(`x${inventory[(id - 1) * 8 + rarity]}`, 0, 0)
                    ctx.fillText(`x${inventory[(id - 1) * 8 + rarity]}`, 0, 0)
                }
            }
        }
    }
    if (ws.readyState === 1) ws.send(new Uint8Array([1,input]));
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);