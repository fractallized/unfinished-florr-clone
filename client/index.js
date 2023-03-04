function drawEnt(ent) {
    if (!ent.pos) return;
    ctx.setTransform(scale,0,0,scale,canvas.width/2,canvas.height/2);
    ctx.translate(ent.pos.x-cameraEnt.camera.x, ent.pos.y-cameraEnt.camera.y);
    ctx.rotate(ent.pos.angle);
    ctx.globalAlpha = ent.style.opacity / 255;
    if (ent.player) drawPlayer(ent);
    else if (ent.petal) drawPetalAsEnt(ent);
    else if (ent.mob) drawMobAsEnt(ent);
    else if (ent.drop) drawDrop(ent);
    else drawPortal(ent);
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
    }
    if (ws.readyState === 1) ws.send(new Uint8Array([1,input | (attack << 4) | (defend << 5)]))
    requestAnimationFrame(animate);
})();
