export function compileEnt(w, entity) {
    w.i32(entity.id);
    if (entity.pos) {
        w.u8(0);
        w.f32(entity.pos.x);
        w.f32(entity.pos.y);
        w.f32(entity.pos.angle);
        w.f32(entity.pos.radius);
    }
    if (entity.camera) {
        w.u8(1);
        w.f32(entity.camera.x);
        w.f32(entity.camera.y);
        w.f32(entity.camera.fov);
        w.i32(entity.camera.player);
    }
    if (entity.arena) {
        w.u8(2);
        w.f32(entity.arena.width);
        w.f32(entity.arena.height);
    }
    if (entity.style) {
        w.u8(3);
        w.u8(entity.style.color);
        w.f32(entity.style.opacity);
    }
    if (entity.health) {
        w.u8(4);
        w.f32(entity.health.health);
        w.f32(entity.health.maxHealth);
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
        for (const i of entity.playerInfo.petalsEquipped) w.u8(i);
        for (const i of entity.playerInfo.petalHealths) w.u8(i);
        for (const i of entity.playerInfo.petalCooldowns) w.u8(i);
    }
    return w.u8(255);
}