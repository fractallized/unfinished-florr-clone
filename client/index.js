let input = 0;
let entities = {};
const ws = window.ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.host}`);
ws.onopen = () => ws.send(new Uint8Array([0]));


ws.onmessage = async (e) => {
    const packet = new Uint8Array(await e.data.arrayBuffer());
    const r = new Reader(packet);
    if (r.u8() === 1) {
        let id = r.i32();
        while (id !== -1 && r.has()) {
            if (entities.hasOwnProperty(id)) delete entities[id];
            id = r.i32();
        }
        id = r.i32();
        while (id !== -1 && r.has()) {
            const ent = {}
            while(r.ru8() !== 255) {
                switch(r.u8()) {
                    case 0:
                        ent.pos = {
                            x: r.f32(),
                            y: r.f32(),
                            angle: r.f32()
                        }
                        break;
                    case 1:
                        ent.camera = {
                            x: r.f32(),
                            y: r.f32(),
                            fov: r.f32(),
                            player: r.i32()
                        }
                        entities.camera = id;
                        break;
                    case 2:
                        ent.radius = r.f32();
                        break;
                    case 3:
                        ent.arena = {
                            width: r.f32(),
                            height: r.f32()
                        }
                        entities.arena = id;
                        break;
                    case 4:
                        ent.style = {
                            color: r.u8()
                        }
                        break;
                    case 5:
                        ent.health = {
                            health: r.f32(),
                            maxHealth: r.f32()
                        }
                        break;
                }
            }
            r.u8();
            entities[id] = ent;
            id = r.i32();
        }
    }
}

const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');
const loop = _ => {
    ctx.resetTransform();
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    if (entities.hasOwnProperty('camera') && entities.hasOwnProperty('arena')) {
        const scale = Math.max(canvas.width/1920,canvas.height/1080);
        const cameraEnt = entities[entities.camera];
        const arenaEnt = entities[entities.arena];
        ctx.setTransform(scale*cameraEnt.camera.fov,0,0,scale*cameraEnt.camera.fov,canvas.width/(2*devicePixelRatio),canvas.height/(2*devicePixelRatio))
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 10;
        ctx.beginPath()
        ctx.rect(-cameraEnt.camera.x,-cameraEnt.camera.y,arenaEnt.arena.width,arenaEnt.arena.height);
        ctx.stroke();
        for (const ent of Object.values(entities)) {
            if (!ent.hasOwnProperty('pos')) continue;
            const x = ent.pos.x-cameraEnt.camera.x, y = ent.pos.y-cameraEnt.camera.y;
            ctx.fillStyle = COLORS[ent.style? ent.style.color: 0];
            ctx.beginPath();
            ctx.arc(x,y,ent.radius,0,2*Math.PI);
            ctx.fill();
            if (ent.health) {
                ctx.strokeStyle = '#222222';
                ctx.lineWidth = ent.radius / 5;
                ctx.beginPath();
                ctx.moveTo(x - ent.radius * 0.8, y + ent.radius * 1.2);
                ctx.lineTo(x + 0.8 * ent.radius, y + ent.radius * 1.2);
                ctx.stroke();
                ctx.strokeStyle = '#00bb00';
                ctx.lineWidth = ent.radius / 10;
                ctx.beginPath();
                ctx.moveTo(x - ent.radius * 0.8, y + ent.radius * 1.2);
                ctx.lineTo(x + (1.6 * ent.health.health / ent.health.maxHealth - 0.8) * ent.radius, y + ent.radius * 1.2)
                ctx.stroke();
            }
        }
    }
    if (ws.readyState === 1) window.ws.send(new Uint8Array([1,input]));
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);