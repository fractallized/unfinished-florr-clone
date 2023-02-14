let entities = {};
const inventory = new Int32Array(60);

const ws = window.ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.host}`);

const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');
let scale = 1; //global scaling
let staticScale = 1; //doesn't count fov;
const loop = _ => {
    ctx.globalAlpha = 1;
    ctx.resetTransform();
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    if (entities.hasOwnProperty('camera') && entities.hasOwnProperty('arena')) {
        //init canvas draw, and draw arena
        const cameraEnt = entities[entities.camera];
        const arenaEnt = entities[entities.arena];
        staticScale = Math.max(canvas.width/1920,canvas.height/1080);
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
            if (!ent.hasOwnProperty('pos')) continue;
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
                ctx.strokeText(text, r, 1.8*r+10);
                ctx.fillText(text, r, 1.8*r+10);
            }
            if (ent.health) {
                ctx.strokeStyle = '#111111';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(-r,1.8*r);
                ctx.lineTo(r,1.8*r);
                ctx.stroke();
                ctx.strokeStyle = '#00bb00';
                ctx.lineWidth = 3.2;
                ctx.beginPath();
                ctx.moveTo(-r,1.8*r);
                ctx.lineTo(-r+2*ent.health.health/255*r,1.8*r);
                ctx.stroke();
            }
            ctx.scale(ent.pos.radius, ent.pos.radius);
            ctx.rotate(ent.pos.angle);
            if (ent.mob) drawMobAsEnt(ent);
            else if (ent.petal) drawPetalAsEnt(ent);
            else if (ent.drop) drawDrop(ent);
            else drawPlayer(ent);
        }
        //draw inventory;
        const playerEnt = entities[cameraEnt.camera.player];
        if (playerEnt) {
            ctx.globalAlpha = 1;
            const equipped = playerEnt.playerInfo.petalsEquipped;
            const count = playerEnt.playerInfo.numEquipped;
            for (const [pos, val] of Object.entries(clientSimulation.loadout)) {
                if (!val.selected) {
                    val.set(canvas.width/(2*devicePixelRatio) - (1 - count + 2 * pos) * 40 * staticScale,
                    canvas.height/devicePixelRatio - 80 * staticScale);
                }
                val.tick();
                ctx.setTransform(staticScale,0,0,staticScale,val.x,val.y);
                const base = getColorByRarity(equipped[pos*2+1]);               
                ctx.strokeStyle = base;
                ctx.fillStyle = getStroke(ctx.strokeStyle);
                ctx.lineWidth = 12;
                ctx.beginPath();
                ctx.rect(-30,-30,60,60);
                ctx.stroke();
                ctx.fill();
                ctx.fillStyle = getStroke(base,4/3);
                const cdRatio = playerEnt.playerInfo.petalCooldowns[pos] / 255; 
                ctx.beginPath();
                ctx.rect(-30*cdRatio,-30*cdRatio,60*cdRatio,60*cdRatio);
                ctx.fill();
                ctx.scale(60,60);
                drawPetalAsStatic(equipped[pos * 2],equipped[pos * 2 + 1]);
            }
            /*
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
                    ctx.fillStyle = '#aaaaaa';
                    ctx.strokeStyle = getStroke(ctx.fillStyle);
                    ctx.beginPath();
                    ctx.rect(-0.5,-0.5,1,1);
                    ctx.stroke();
                    ctx.fill();
                }
                ctx.translate(4/3, 0);
            }
            */
            let pos = 0;
            const _inventory = [...inventory];
            for (let n = 0; n < 20 * 2; n += 2) {
                if (equipped[n] === 0) continue;
                --_inventory[equipped[n] * 6 + equipped[n + 1] - 6];
            }
            for (let n = 0; n < 60; n++) {
                if (_inventory[n] !== 0) {
                    ctx.setTransform(scale,0,0,scale,0,canvas.height/devicePixelRatio);
                    ctx.scale(60,60);
                    const col = pos % 5;
                    const row = (pos - col) / 5;
                    ctx.translate(col * 4/3 + 3, row * 4/3 - 5);
                    const base = getColorByRarity(n % 6);               
                    ctx.strokeStyle = base;
                    ctx.fillStyle = getStroke(ctx.strokeStyle, 4/3);
                    ctx.lineWidth = 1/5;
                    ctx.beginPath();
                    ctx.rect(-0.5,-0.5,1,1);
                    ctx.stroke();
                    ctx.fill();
                    drawPetalAsStatic(1 + ((n / 6) | 0),n % 6);
                    ++pos;
                    if (_inventory[n] === 1) continue;
                    ctx.translate(0.4,-0.4);
                    ctx.rotate(0.5);
                    ctx.textAlign = 'center';
                    ctx.font = '0.2px Ubuntu';
                    ctx.lineWidth = 0.04;
                    ctx.fillStyle = '#ffffff';
                    ctx.strokeStyle = '#000000';
                    ctx.beginPath();
                    ctx.strokeText(`x${_inventory[n]}`, 0, 0);
                    ctx.fillText(`x${_inventory[n]}`, 0, 0);
                }
            }
        }
    }
    if (ws.readyState === 1) window.ws.send(new Uint8Array([1,input]));
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);