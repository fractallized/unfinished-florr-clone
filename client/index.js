function drawEnt(ent) {
    if (!ent.pos) return;
    ctx.save();
    ctx.setTransform(scale,0,0,scale,canvas.width/2,canvas.height/2);
    ctx.translate(ent.pos.x-cameraEnt.camera.x, ent.pos.y-cameraEnt.camera.y);
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
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(-r*1.5,r*1.1+15);
        ctx.lineTo(r*1.5,r*1.1+15);
        ctx.stroke();
        ctx.strokeStyle = '#00bb00';
        ctx.lineWidth = 4.8;
        ctx.beginPath();
        ctx.moveTo(-r*1.5,r*1.1+15);
        ctx.lineTo(-r*1.5+3*ent.health.health/255*r,r*1.1+15);
        ctx.stroke();
    }
    ctx.rotate(ent.pos.angle);
    if (ent.player) drawPlayer(ent);
    else if (ent.petal) drawPetalAsEnt(ent);
    else if (ent.mob) drawMobAsEnt(ent);
    else if (ent.drop) drawDrop(ent);
    else drawPortal(ent);
    ctx.restore();
}
(function animate() {
    window.devicePixelRatio = 1;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    staticScale = Math.max(canvas.width / 1920, canvas.height / 1080);
    cameraEnt = null; arenaEnt = null;
    if (!entities[1] || !clientRender.camera) {
        ctx.fillStyle = '#000000';
        ctx.font = '100px Ubuntu';
        ctx.textBaseline = 'center';
        ctx.textAlign = 'center';
        ctx.fillText("Not Spawned", canvas.width / 2, canvas.height / 2);
    } else {
        cameraEnt = entities[clientRender.camera];
        scale = staticScale * cameraEnt.camera.fov;
        ctx.fillStyle = '#888888';
        ctx.setTransform(scale,0,0,scale,canvas.width/2,canvas.height/2);
        ctx.translate(-cameraEnt.camera.x,-cameraEnt.camera.y);
        ctx.beginPath();
        ctx.fillRect(0,0,entities[1].arena.width,entities[1].arena.height);
        for (const ent of Object.values(entities)) drawEnt(ent);
        //render the game
        playerEnt = entities[cameraEnt.camera.player] || null;
        if (playerEnt) {
            let press = null;
            for (const ent of Object.values(clientRender.entities)) {
                if (!ent.mousedown) ent.draw();
                else press = ent;
            }
            press && press.draw();
        }
    }
    if (ws.readyState === 1) ws.send(new Uint8Array([1,input | (attack << 4) | (defend << 5)]))
    requestAnimationFrame(animate);
})();
