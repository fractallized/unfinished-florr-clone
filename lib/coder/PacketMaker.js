"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compileInventory = exports.compileEnt = void 0;
function compileEnt(w, entity, cameraState, camera) {
    if ((entity.state & 2) || (cameraState & 2))
        return compileCreate(w, entity);
    else if (entity.state & 1)
        return compileUpdate(w, entity, camera);
}
exports.compileEnt = compileEnt;
function compileInventory(w, inventory) {
    if (inventory.grandState & 1) {
        let at = -1;
        for (let n = 0; n < inventory.state.length; n++) {
            if (!(inventory.state[n] & 1))
                continue;
            w.vu(n - at);
            at = n;
            w.vu(inventory.values[n]);
        }
        w.vu(0);
    }
}
exports.compileInventory = compileInventory;
function compileCreate(w, entity) {
    w.vu(entity.id);
    w.u8(0);
    if (entity.pos) {
        w.u8(0);
        w.vi(entity.pos.x);
        w.vi(entity.pos.y);
        w.f32(entity.pos.angle);
        w.f32(entity.pos.radius);
    }
    if (entity.camera) {
        w.u8(1);
        w.f32(entity.camera.x);
        w.f32(entity.camera.y);
        w.f32(entity.camera.fov);
        w.vu(entity.camera.player);
    }
    if (entity.arena) {
        w.u8(2);
        w.vu(entity.arena.width);
        w.vu(entity.arena.height);
    }
    if (entity.style) {
        w.u8(3);
        w.u8(entity.style.color);
        w.u8(entity.style.opacity * 255);
    }
    if (entity.health && !entity.petal) {
        w.u8(4);
        w.u8(255 * entity.health.health / entity.health.maxHealth);
    }
    if (entity.drop) {
        w.u8(5);
        w.u8(entity.drop.id);
        w.u8(entity.drop.rarity);
    }
    if (entity.mob) {
        w.u8(6);
        w.u8(entity.mob.id);
        w.u8(entity.mob.rarity);
    }
    if (entity.petal) {
        w.u8(7);
        w.u8(entity.petal.id);
        w.u8(entity.petal.rarity);
    }
    if (entity.playerInfo) {
        w.u8(8);
        w.u8(entity.playerInfo.numEquipped);
        for (const v of entity.playerInfo.petalsEquipped.values)
            w.u8(v);
        for (const v of entity.playerInfo.petalCooldowns.values)
            w.u8(v);
        for (const v of entity.playerInfo.petalHealths.values)
            w.u8(v);
        w.u8(entity.playerInfo.faceFlags);
    }
    return w.u8(255);
}
function compileUpdate(w, entity, camera) {
    w.vu(entity.id);
    w.u8(1);
    if (entity.pos) {
        if (entity.pos.state[0] & 1) {
            w.u8(0);
            w.vi(entity.pos.x);
        }
        if (entity.pos.state[1] & 1) {
            w.u8(1);
            w.vi(entity.pos.y);
        }
        if (entity.pos.state[2] & 1) {
            w.u8(2);
            w.f32(entity.pos.angle);
        }
        if (entity.pos.state[3] & 1) {
            w.u8(3);
            w.f32(entity.pos.radius);
        }
    }
    if (entity.camera) {
        if (entity.camera.state[0] & 1) {
            w.u8(4);
            w.f32(entity.camera.x);
        }
        if (entity.camera.state[1] & 1) {
            w.u8(5);
            w.f32(entity.camera.y);
        }
        if (entity.camera.state[2] & 1) {
            w.u8(6);
            w.f32(entity.camera.fov);
        }
        if (entity.camera.state[3] & 1) {
            w.u8(7);
            w.vu(entity.camera.player);
        }
    }
    if (entity.arena) {
        if (entity.arena.state[0] & 1) {
            w.u8(8);
            w.vi(entity.arena.width);
        }
        if (entity.arena.state[1] & 1) {
            w.u8(9);
            w.vi(entity.arena.height);
        }
    }
    if (entity.style) {
        if (entity.style.state[0] & 1) {
            w.u8(10);
            w.u8(entity.style.color);
        }
        if (entity.style.state[1] & 1) {
            w.u8(11);
            w.u8(entity.style.opacity * 255);
        }
    }
    if (entity.health && !entity.petal) {
        if (entity.health.state[0] & 1) {
            w.u8(12);
            w.u8(255 * entity.health.health / entity.health.maxHealth);
        }
    }
    if (entity.drop) {
        if (entity.drop.state[0] & 1) {
            w.u8(13);
            w.u8(entity.drop.id);
        }
        if (entity.drop.state[1] & 1) {
            w.u8(14);
            w.u8(entity.drop.rarity);
        }
    }
    if (entity.mob) {
        if (entity.mob.state[0] & 1) {
            w.u8(15);
            w.u8(entity.mob.id);
        }
        if (entity.mob.state[1] & 1) {
            w.u8(16);
            w.u8(entity.mob.rarity);
        }
    }
    if (entity.petal) {
        if (entity.petal.state[0] & 1) {
            w.u8(17);
            w.u8(entity.petal.id);
        }
        if (entity.petal.state[1] & 1) {
            w.u8(18);
            w.u8(entity.petal.rarity);
        }
    }
    if (entity.playerInfo) {
        if (entity.playerInfo.state[0] & 1) {
            w.u8(19);
            w.u8(entity.playerInfo.numEquipped);
        }
        if (entity === camera.player && entity.playerInfo.state[1] & 1) {
            w.u8(20);
            for (let n = 0; n < entity.playerInfo.petalsEquipped.values.length; ++n) {
                if (entity.playerInfo.petalsEquipped.state[n] & 1) {
                    w.u8(n);
                    w.u8(entity.playerInfo.petalsEquipped.values[n]);
                }
                ;
            }
            w.u8(255);
        }
        if (entity === camera.player && entity.playerInfo.state[2] & 1) {
            w.u8(21);
            for (let n = 0; n < entity.playerInfo.petalHealths.values.length; ++n) {
                if (entity.playerInfo.petalHealths.state[n] & 1) {
                    w.u8(n);
                    w.u8(entity.playerInfo.petalHealths.values[n]);
                }
                ;
            }
            w.u8(255);
        }
        if (entity === camera.player && entity.playerInfo.state[3] & 1) {
            w.u8(22);
            for (let n = 0; n < entity.playerInfo.petalCooldowns.values.length; ++n) {
                if (entity.playerInfo.petalCooldowns.state[n] & 1) {
                    w.u8(n);
                    w.u8(entity.playerInfo.petalCooldowns.values[n]);
                }
                ;
            }
            w.u8(255);
        }
        if (entity.playerInfo.state[4] & 1) {
            w.u8(23);
            w.u8(entity.playerInfo.faceFlags);
        }
    }
    return w.u8(255);
}
