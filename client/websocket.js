let r;
ws.onmessage = async (e) => {
    const packet = new Uint8Array(await e.data.arrayBuffer());
    r = new Reader(packet);
    console.log(packet.length, " length update packet");
    switch(r.u8()) {
        case 1: parseEntPacket(); break;
        case 254: entities = {}; break;
    }
}
ws.onclose = _ => setTimeout(() => {ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.host}`)}, 1000);
function parseEntPacket() {
    let needInvAdjust = false;
    let id = r.vu();
    while (id && r.has()) {
        if (entities.hasOwnProperty(id)) delete entities[id];
        id = r.vu();
    }
    id = r.vu();
    while (id && r.has()) {
        if (r.u8() === 0) {
            entities[id] = {};
            while(r.ru8() !== 255) {
                switch(r.u8()) {
                    case 0:
                        entities[id].pos = {
                            x: r.vi(),
                            y: r.vi(),
                            angle: r.f32(),
                            radius: r.f32()
                        }
                        entities[id].pos.lerpX = entities[id].pos.x;
                        entities[id].pos.lerpY = entities[id].pos.y;
                        entities[id].pos.lerpAngle = entities[id].pos.angle;
                        break;
                    case 1:
                        entities[id].camera = {
                            x: r.vi(),
                            y: r.vi(),
                            fov: r.f32(),
                            player: r.vu()
                        }
                        entities[id].camera.lerpX = entities[id].camera.x;
                        entities[id].camera.lerpY = entities[id].camera.y;
                        entities[id].camera.lerpFov = entities[id].camera.fov;
                        entities.camera = id;
                        break;
                    case 2:
                        entities[id].arena = {
                            width: r.vi(),
                            height: r.vi()
                        }
                        entities.arena = id;
                        break;
                    case 3:
                        entities[id].style = {
                            color: r.u8(),
                            opacity: r.u8()
                        }
                        break;
                    case 4:
                        entities[id].health = {
                            health: r.u8(),
                        }
                        entities[id].health.lerpHP = entities[id].health.health;
                        break;
                    case 5:
                        entities[id].drop = {
                            id: r.u8(),
                            rarity: r.u8()
                        }
                        break;
                    case 6:
                        entities[id].mob = {
                            id: r.u8(),
                            rarity: r.u8()
                        }
                        break;
                    case 7:
                        entities[id].petal = {
                            id: r.u8(),
                            rarity: r.u8()
                        }
                        break;
                    case 8:
                        entities[id].playerInfo = {
                            numEquipped: r.u8(),
                            petalsEquipped: new Uint8Array(40).map(_ => r.u8()),
                            petalHealths: new Uint8Array(10).map(_ => r.u8()),
                            petalCooldowns: new Uint8Array(10).map(_ => r.u8()),
                            faceFlags: r.u8()
                        }
                        entities[id].playerInfo.lerpEyeAngle = entities[id].playerInfo.faceFlags & 7;
                        if (id !== entities[entities.camera].camera.player) break;
                        const count = entities[id].playerInfo.numEquipped;
                        for (let n = 0; n < count; n++) {
                            CLIENT_RENDER.loadout[n].x = CLIENT_RENDER.loadout[n].targetX = CLIENT_RENDER.loadout[n].baseX = canvas.width/2 + staticScale * 1.2 * 40 * (2 * n - count);
                            CLIENT_RENDER.loadout[n].y = CLIENT_RENDER.loadout[n].targetY = CLIENT_RENDER.loadout[n].baseY = canvas.height - staticScale * 1.2 * 110;
                            CLIENT_RENDER.loadout[n].id = entities[id].playerInfo.petalsEquipped[n*2];
                            CLIENT_RENDER.loadout[n].rarity = entities[id].playerInfo.petalsEquipped[n*2+1];
                        }
                        for (let n = count; n < count * 2; n++) {
                            CLIENT_RENDER.loadout[n].x = CLIENT_RENDER.loadout[n].targetX = CLIENT_RENDER.loadout[n].baseX = canvas.width/2 + staticScale * 40 * (2 * n - count);
                            CLIENT_RENDER.loadout[n].y = CLIENT_RENDER.loadout[n].targetY = CLIENT_RENDER.loadout[n].baseY = canvas.height - staticScale * 90;
                            CLIENT_RENDER.loadout[n].id = entities[id].playerInfo.petalsEquipped[n*2];
                            CLIENT_RENDER.loadout[n].rarity = entities[id].playerInfo.petalsEquipped[n*2+1];
                        }
                        needInvAdjust = true;
                        break;
                }
            }
        } else {
            while(r.ru8() !== 255) {
                let pos;
                switch(r.u8()) {
                    case 0:
                        entities[id].pos.x = r.vi(); break;
                    case 1:
                        entities[id].pos.y = r.vi(); break;
                    case 2:
                        entities[id].pos.angle = r.f32(); break;
                    case 3:
                        entities[id].pos.radius = r.f32(); break;
                    case 4:
                        entities[id].camera.x = r.vi(); break;
                    case 5:
                        entities[id].camera.y = r.vi(); break;
                    case 6:
                        entities[id].camera.fov = r.f32(); break;
                    case 7:
                        entities[id].camera.player = r.vu(); break;
                    case 8:
                        entities[id].arena.width = r.vu(); break;
                    case 9:
                        entities[id].arena.height = r.vu(); break;
                    case 10:
                        entities[id].style.color = r.u8(); break;
                    case 11:
                        entities[id].style.opacity = r.u8(); break;
                    case 12:
                        entities[id].health.health = r.u8(); break;
                    case 13:
                        entities[id].drop.id = r.u8(); break;
                    case 14:
                        entities[id].drop.rarity = r.u8(); break;
                    case 15:
                        entities[id].mob.id = r.u8(); break;
                    case 16:
                        entities[id].mob.rarity = r.u8(); break;
                    case 17:
                        entities[id].petal.id = r.u8(); break;
                    case 18:
                        entities[id].petal.rarity = r.u8(); break;
                    case 19:
                        entities[id].playerInfo.numEquipped = r.u8(); break;
                    case 20:
                        while((pos = r.u8()) !== 255) {
                            if (pos & 1) CLIENT_RENDER.loadout[pos >> 1].rarity = entities[id].playerInfo.petalsEquipped[pos] = r.u8()
                            else CLIENT_RENDER.loadout[pos >> 1].id = entities[id].playerInfo.petalsEquipped[pos] = r.u8();
                        }
                        needInvAdjust = true;
                        break;
                    case 21:
                        while((pos = r.u8()) !== 255) {
                            entities[id].playerInfo.petalHealths[pos] = r.u8();
                        }
                        break;                    
                    case 22:
                        while((pos = r.u8()) !== 255) {
                            entities[id].playerInfo.petalCooldowns[pos] = r.u8();
                        }
                        break;
                    case 23:
                        entities[id].playerInfo.faceFlags = r.u8(); break;
                }
            }
        }
        r.u8();
        id = r.vu();
    }
    if (!r.has()) {
        if (needInvAdjust) getAdjustedInv();
        return;
    }
    let at = -1;
    let pos = r.vu();
    while(pos && r.has()) {
        needInvAdjust = true;
        inventory[at += pos] = r.vu();
        pos = r.vu();
    }
    if (needInvAdjust) getAdjustedInv();
}
function getAdjustedInv() {
    const _inv = [...inventory];
    if (!entities.camera) return;
    if (!entities[entities.camera].camera) return;
    const pEnt = entities[entities[entities.camera].camera.player];
    if (!pEnt) return;
    const loadout = pEnt.playerInfo.petalsEquipped;
    for (let n = 0; n < 40; n += 2) {
        if (!loadout[n]) continue;
        --_inv[(loadout[n] - 1) * 8 + loadout[n+1]];
    }
    for (let n = 0; n < 100; n++) CLIENT_RENDER.inventory[n].count = _inv[n];
}
class Reader {
    constructor(p) {
        this.p = p;
        this.i = 0;
    } 
    has() { return this.p.length > this.i }
    ru8() { return this.p[this.i] }
    u8() { return this.p[this.i++] }
    vu() {
        let out = 0, at = 0;
        while (this.p[this.i] & 0x80) {
            out |= (this.u8() & 0x7f) << at;
            at += 7;
        }
        out |= this.u8() << at;
        return out;
    }
    vi() { return this.vu() | 0; }
    f32() { return new Float32Array(this.p.slice(this.i, this.i += 4).buffer)[0] }
}