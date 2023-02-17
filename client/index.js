let entities = {};
const inventory = new Int32Array(80);

const ws = window.ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.host}`);

const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');
let scale = 1; //global scaling
let staticScale = 1; //doesn't count fov;
let cameraEnt, arenaEnt, playerEnt;
clientSimulation.inventory = new Container(50, -660);
clientSimulation.inventory.initCanvas(400,760);
const loop = _ => {
    ctx.globalAlpha = 1;
    ctx.resetTransform();
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    if (entities.hasOwnProperty('camera') && entities.hasOwnProperty('arena')) {
        //init canvas draw, and draw arena
        cameraEnt = entities[entities.camera];
        arenaEnt = entities[entities.arena];
        staticScale = Math.max(canvas.width/1920,canvas.height/1080) / devicePixelRatio;
        scale = staticScale * cameraEnt.camera.fov;
        ctx.setTransform(scale,0,0,scale,canvas.width/(2*devicePixelRatio)-cameraEnt.camera.x*scale,canvas.height/(2*devicePixelRatio)-cameraEnt.camera.y*scale)
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#ff00ff';
        ctx.fillStyle = '#00aa0080';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.rect(0,0,arenaEnt.arena.width,arenaEnt.arena.height);
        ctx.fill();
        ctx.stroke();
        for (const ent of Object.values(entities)) {
            drawEntity(ent);
        }
        //draw inventory and loadout;
        playerEnt = entities[cameraEnt.camera.player];
        if (playerEnt) {
            ctx.globalAlpha = 1;
            const equipped = playerEnt.playerInfo.petalsEquipped;
            const count = playerEnt.playerInfo.numEquipped;
            let pos = 0;
            const invCtx = clientSimulation.inventory.ctx;
            invCtx.canvas.width = invCtx.canvas.width; //reset state
            invCtx.fillStyle = "#aaaaaa";
            invCtx.strokeStyle = getStroke(invCtx.fillStyle);
            invCtx.lineWidth = 12;
            invCtx.beginPath();
            invCtx.rect(20,20,360,600);
            invCtx.stroke();
            invCtx.fill();
            pos = 0;
            for (const petal of clientSimulation.inventoryLayout) {
                invCtx.setTransform(50,0,0,50,50,50);
                const col = pos % 6;
                const row = (pos - col) / 6;
                invCtx.translate(col * 6/5, row * 6/5);
                const base = getColorByRarity(petal.rarity);               
                invCtx.strokeStyle = base;
                invCtx.fillStyle = getStroke(invCtx.strokeStyle, 4/3);
                invCtx.lineWidth = 1/6;
                invCtx.beginPath();
                invCtx.rect(-0.5,-0.5,1,1);
                invCtx.stroke();
                invCtx.fill();
                invCtx.translate(0,-0.1);
                drawPetalAsStatic(petal.petalID,petal.rarity,invCtx);
                invCtx.scale(0.02,0.02);
                invCtx.font = '10px Ubuntu';
                invCtx.textAlign = 'center';
                invCtx.lineWidth = 2;
                invCtx.fillStyle = '#ffffff';
                invCtx.strokeStyle = '#000000';
                invCtx.beginPath();
                invCtx.strokeText(`${PETAL_NAMES[petal.petalID - 1] || ""}`, 0, 25);
                invCtx.fillText(`${PETAL_NAMES[petal.petalID - 1] || ""}`, 0, 25);
                ++pos;
                if (petal.count === 1) continue;
                invCtx.translate(20,-15);
                invCtx.rotate(0.5);
                invCtx.beginPath();
                invCtx.strokeText(`x${petal.count}`, 0, 0);
                invCtx.fillText(`x${petal.count}`, 0, 0);
            }
            clientSimulation.inventory.tick();
            ctx.setTransform(staticScale,0,0,staticScale,0,canvas.height/devicePixelRatio);
            ctx.drawImage(clientSimulation.inventory.canvas, clientSimulation.inventory.x, clientSimulation.inventory.y);
            for (let pos = 0; pos < count; pos++) {
                const val = clientSimulation.loadout[pos];
                ctx.setTransform(staticScale,0,0,staticScale,canvas.width/(2*devicePixelRatio) + (1 - count + 2 * pos) * 40 * staticScale,
                canvas.height/devicePixelRatio - 80 * staticScale);
                ctx.globalAlpha = 0.8;
                ctx.fillStyle = '#aaaaaa';
                ctx.strokeStyle = getStroke(ctx.fillStyle);
                ctx.lineWidth = 8;
                ctx.beginPath();
                ctx.rect(-30,-30,60,60);
                ctx.stroke();
                ctx.fill();
                ctx.globalAlpha = 1;
                if (!val) continue;
                if (!val.selected) {
                    val.set(canvas.width/(2*devicePixelRatio) + (1 - count + 2 * pos) * 40 * staticScale,
                    canvas.height/devicePixelRatio - 80 * staticScale);
                }
                val.tick();
                ctx.setTransform(staticScale,0,0,staticScale,val.x,val.y);
                const base = getColorByRarity(equipped[pos*2+1]);               
                ctx.strokeStyle = base;
                ctx.fillStyle = getStroke(ctx.strokeStyle);
                ctx.beginPath();
                ctx.rect(-30,-30,60,60);
                ctx.stroke();
                ctx.fill();
                ctx.fillStyle = getStroke(base,4/3);
                const cdRatio = playerEnt.playerInfo.petalCooldowns[pos] / 255; 
                ctx.beginPath();
                ctx.rect(-30*cdRatio,-30*cdRatio,60*cdRatio,60*cdRatio);
                ctx.fill();
                ctx.translate(0,-5);
                ctx.scale(60,60);
                drawPetalAsStatic(equipped[pos * 2],equipped[pos * 2 + 1], ctx);
                ctx.scale(1/60,1/60);
                ctx.font = '10px Ubuntu';
                ctx.textAlign = 'center';
                ctx.lineWidth = 2;
                ctx.fillStyle = '#ffffff';
                ctx.strokeStyle = '#000000';
                ctx.beginPath();
                ctx.strokeText(`${PETAL_NAMES[equipped[pos * 2] - 1] || ''}`, 0, 30);
                ctx.fillText(`${PETAL_NAMES[equipped[pos * 2] - 1] || ''}`, 0, 30);
            }
        }
        const val = clientSimulation.pendingEquip;
        if (val.id) {
            val.tick();
            ctx.globalAlpha = 1;
            ctx.setTransform(staticScale,0,0,staticScale,val.x,val.y);
            const base = getColorByRarity(val.rarity);
            ctx.lineWidth = 8;               
            ctx.strokeStyle = base;
            ctx.fillStyle = getStroke(ctx.strokeStyle, 4/3);
            ctx.beginPath();
            ctx.rect(-30,-30,60,60);
            ctx.stroke();
            ctx.fill();
            ctx.fillStyle = getStroke(base,4/3);
            ctx.scale(60,60);
            ctx.translate(0,-0.1);
            drawPetalAsStatic(val.id,val.rarity, ctx);
            ctx.scale(1/60,1/60);
            ctx.lineWidth = 2;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#000000';
            ctx.beginPath();
            ctx.strokeText(`${PETAL_NAMES[val.id - 1] || ''}`, 0, 30);
            ctx.fillText(`${PETAL_NAMES[val.id - 1] || ''}`, 0, 30);
    }
    }
    if (ws.readyState === 1) window.ws.send(new Uint8Array([1,input]));
    requestAnimationFrame(loop);
}
const drawEntity = (ent) => {
    if (!ent.hasOwnProperty('pos')) return;
    ctx.setTransform(scale,0,0,scale,canvas.width/(2*devicePixelRatio),canvas.height/(2*devicePixelRatio));
    const {x, y} = ent.pos;
    ctx.translate(x - cameraEnt.camera.x, y - cameraEnt.camera.y);
    ctx.globalAlpha = ent.style.opacity;
    const r = ent.pos.radius;
    if (ent.mob) {
        ctx.fillStyle = getColorByRarity(ent.mob.rarity);
        const text = getNameByRarity(ent.mob.rarity);
        ctx.strokeStyle = '#000000';
        ctx.textAlign = 'right';
        ctx.font = '8px Ubuntu';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.strokeText(text, r, r+25);
        ctx.fillText(text, r, r+25);
    }
    if (ent.health) {
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-r,r+15);
        ctx.lineTo(r,r+15);
        ctx.stroke();
        ctx.strokeStyle = '#00bb00';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.moveTo(-r,r+15);
        ctx.lineTo(-r+2*ent.health.health/255*r,r+15);
        ctx.stroke();
    }
    ctx.scale(ent.pos.radius, ent.pos.radius);
    ctx.rotate(ent.pos.angle);
    if (ent.mob) drawMobAsEnt(ent);
    else if (ent.petal) drawPetalAsEnt(ent);
    else if (ent.drop) drawDrop(ent);
    else if (ent.playerInfo) drawPlayer(ent);
    else drawPortal(ent);
}
requestAnimationFrame(loop);