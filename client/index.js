let entities = {};
const ws = window.ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.host}`);
const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');
const loop = _ => {
    ctx.globalAlpha = 1;
    ctx.resetTransform();
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    if (entities.hasOwnProperty('camera') && entities.hasOwnProperty('arena')) {
        //init canvas draw, and draw arena
        const cameraEnt = entities[entities.camera];
        const arenaEnt = entities[entities.arena];
        const scale = Math.max(canvas.width/1920,canvas.height/1080)*cameraEnt.camera.fov;
        ctx.setTransform(scale,0,0,scale,canvas.width/(2*devicePixelRatio)-cameraEnt.camera.x*scale,canvas.height/(2*devicePixelRatio)-cameraEnt.camera.y*scale)
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ff00ff';
        ctx.lineWidth = 5;
        ctx.beginPath()
        ctx.rect(0,0,arenaEnt.arena.width,arenaEnt.arena.height);
        ctx.stroke();
        for (const ent of Object.values(entities)) {
            if (!ent.hasOwnProperty('pos')) continue;
            ctx.setTransform(scale,0,0,scale,canvas.width/(2*devicePixelRatio),canvas.height/(2*devicePixelRatio));
            const {x, y} = ent.pos;
            ctx.translate(x - cameraEnt.camera.x, y - cameraEnt.camera.y);
            ctx.globalAlpha = ent.style.opacity;
            ctx.scale(ent.pos.radius, ent.pos.radius);
            if (ent.health) {
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 1/5;
                ctx.beginPath();
                ctx.moveTo(-0.8,1.2);
                ctx.lineTo(0.8,1.2);
                ctx.stroke();
                ctx.strokeStyle = '#00bb00';
                ctx.lineWidth = 1/6;
                ctx.beginPath();
                ctx.moveTo(-0.8,1.2);
                ctx.lineTo(-0.8+1.6*ent.health.health/ent.health.maxHealth,1.2);
                ctx.stroke();
            }
            ctx.rotate(ent.pos.angle);
            if (ent.mob) drawMobAsEnt(ent);
            else if (ent.petal) drawPetalAsEnt(ent);
            else if (ent.drop) drawDrop(ent);
            else drawPlayer(ent);
        }
        //draw inventory;
        const playerEnt = entities[cameraEnt.camera.player];
        if (playerEnt) {
            ctx.setTransform(scale,0,0,scale,canvas.width/(2*devicePixelRatio),canvas.height/devicePixelRatio);
            const equipped = playerEnt.playerInfo.petalsEquipped;
            const len = playerEnt.playerInfo.numEquipped;
            ctx.translate((1 - len) * 40, -80);
            ctx.globalAlpha = 1;
            ctx.scale(60,60);
            for (let n = 0; n < len * 2; n += 2) {
                ctx.lineWidth = 0.2;
                if (equipped[n] !== 0) {
                    const base = getColorByRarity(equipped[n+1]);               
                    ctx.strokeStyle = base;
                    ctx.fillStyle = getStroke(ctx.strokeStyle);
                    ctx.beginPath();
                    ctx.rect(-0.5,-0.5,1,1);
                    ctx.stroke();
                    ctx.fill();
                    ctx.fillStyle = getStroke(base,4/3);
                    const cdRatio = playerEnt.playerInfo.petalCooldowns[n/2] / 255; 
                    ctx.beginPath();
                    ctx.rect(-0.5*cdRatio,-0.5*cdRatio,cdRatio,cdRatio);
                    ctx.fill();
                    drawPetalAsStatic(equipped[n],0);
                } else {
                }
                ctx.translate(4/3, 0);
            }
        }
    }
    if (ws.readyState === 1) window.ws.send(new Uint8Array([1,input]));
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);