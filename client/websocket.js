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
            while(r.ru8() !== 255) {
                if (!entities[id]) entities[id] = {};
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
                            health: r.f32(),
                            maxHealth: r.f32()
                        }
                        break;
                    case 5:
                        entities[id].drop = {
                            id: r.u8(),
                            rar: r.u8()
                        }
                        break;
                    case 6:
                        entities[id].mob = {
                            id: r.u8(),
                            rar: r.u8()
                        }
                        break;
                    case 7:
                        entities[id].petal = {
                            id: r.u8(),
                            rar: r.u8()
                        }
                        break;
                    case 8:
                        entities[id].playerInfo = {
                            numEquipped: r.u8(),
                            petalsEquipped: new Uint8Array(40).map(_ => r.u8()),
                            petalHealths: new Uint8Array(10).map(_ => r.u8()),
                            petalCooldowns: new Uint8Array(10).map(_ => r.u8())
                        }
                        break; 
                }
            }
            r.u8();
            id = r.i32();
        }
    }
}