let r;
ws.onopen = () => ws.send(new Uint8Array([0]));
ws.onmessage = async (e) => {
    const packet = new Uint8Array(await e.data.arrayBuffer());
    r = new Reader(packet);
    switch(r.u8()) {
        case 1: parseEntPacket(); break;
    }
}
function parseEntPacket() {
    let id = r.i32();
    while (id !== -1 && r.has()) {
        if (entities.hasOwnProperty(id)) delete entities[id];
        id = r.i32();
    }
    id = r.i32();
    while (id !== -1 && r.has()) {
        if (r.u8() === 0) {
            entities[id] = {};
            while(r.ru8() !== 255) {
                switch(r.u8()) {
                    case 0:
                        entities[id].pos = {
                            x: r.f32(),
                            y: r.f32(),
                            angle: r.f32(),
                            radius: r.f32()
                        }
                        break;
                    case 1:
                        entities[id].camera = {
                            x: r.f32(),
                            y: r.f32(),
                            fov: r.f32(),
                            player: r.i32()
                        }
                        entities.camera = id;
                        break;
                    case 2:
                        entities[id].arena = {
                            width: r.f32(),
                            height: r.f32()
                        }
                        entities.arena = id;
                        break;
                    case 3:
                        entities[id].style = {
                            color: r.u8(),
                            opacity: r.f32()
                        }
                        break;
                    case 4:
                        entities[id].health = {
                            health: r.u8(),
                        }
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
                        const count = entities[id].playerInfo.numEquipped;
                        getAdjustedEquipped(entities[id].playerInfo.petalsEquipped, count);
                        getAdjustedInv();
                        break;
                }
            }
        } else {
            if (!entities[id]) { console.log("error: ", id); entities[id] = {}; }
            while(r.ru8() !== 255) {
                switch(r.u8()) {
                    case 0:
                        entities[id].pos.x = r.f32(); break;
                    case 1:
                        entities[id].pos.y = r.f32(); break;
                    case 2:
                        entities[id].pos.angle = r.f32(); break;
                    case 3:
                        entities[id].pos.radius = r.f32(); break;
                    case 4:
                        entities[id].camera.x = r.f32(); break;
                    case 5:
                        entities[id].camera.y = r.f32(); break;
                    case 6:
                        entities[id].camera.fov = r.f32(); break;
                    case 7:
                        entities[id].camera.player = r.i32(); break;
                    case 8:
                        entities[id].arena.width = r.f32(); break;
                    case 9:
                        entities[id].arena.height = r.f32(); break;
                    case 10:
                        entities[id].style.color = r.u8(); break;
                    case 11:
                        entities[id].style.opacity = r.f32(); break;
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
                        entities[id].playerInfo.petalsEquipped = new Uint8Array(40).map(_ => r.u8());
                        const count = entities[id].playerInfo.numEquipped;
                        getAdjustedInv();
                        getAdjustedEquipped(entities[id].playerInfo.petalsEquipped, count);
                        break;
                    case 21:
                        entities[id].playerInfo.petalHealths = new Uint8Array(10).map(_ => r.u8()); break;
                    case 22:
                        entities[id].playerInfo.petalCooldowns = new Uint8Array(10).map(_ => r.u8()); break;
                    case 23:
                        entities[id].playerInfo.faceFlags = r.u8(); break;
                }
            }
        }
        r.u8();
        id = r.i32();
    }
    if (!r.has()) return;
    let pos = r.i32();
    while(pos !== -1 && r.has()) {
        inventory[pos] = r.i32();
        pos = r.i32();
    }
    getAdjustedInv();
}
function getAdjustedEquipped(equipped, count) {
    for (let n = 0; n < 20; n++) {
        if (equipped[n*2] === 0) return delete clientSimulation.loadout[n];
        if (!clientSimulation.loadout[n]) clientSimulation.loadout[n] = new ClientEntity(canvas.width/(2*devicePixelRatio) + (1 - count + 2 * n) * 40 * staticScale, canvas.height/devicePixelRatio - 80 * staticScale, n);
    }
}
function getAdjustedInv() {
    if (!entities.hasOwnProperty('camera') || !entities[entities.camera] || !entities[entities.camera].camera.hasOwnProperty('player')) return false;
    const equipped = entities[entities[entities.camera].camera.player].playerInfo.petalsEquipped;
    const _inventory = [...inventory];
    for (let n = 0; n < 20 * 2; n += 2) {
        if (equipped[n] === 0) continue;
        --_inventory[equipped[n] * 6 + equipped[n + 1] - 6];
    }
    let pos = 0;
    for (let n = 0; n < 60; n++) {
        if (_inventory[n] === 0) delete clientSimulation.inventoryLayout[n];
        else {
            if (clientSimulation.inventoryLayout[n]) {
                clientSimulation.inventoryLayout[n].pos = pos;
                clientSimulation.inventoryLayout[n].count = _inventory[n];
            }
            else {
                clientSimulation.inventoryLayout[n] = {
                    pos, 
                    count: _inventory[n]
                }
            }
            pos++;
        }
    }
}