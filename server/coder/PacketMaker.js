export function compileEnt(w, entity) {
    w.i32(entity.id);
    if (entity.pos) {
        w.u8(0);
        w.f32(entity.pos.x);
        w.f32(entity.pos.y);
        w.f32(entity.pos.angle);
    }
    if (entity.camera) {
        w.u8(1);
        w.f32(entity.camera.x);
        w.f32(entity.camera.y);
        w.f32(entity.camera.fov);
        w.i32(entity.camera.player);
    }
    if (entity.radius) {
        w.u8(2);
        w.f32(entity.radius);
    }
    if (entity.arena) {
        w.u8(3);
        w.f32(entity.arena.width);
        w.f32(entity.arena.height);
    }
    if (entity.style) {
        w.u8(4);
        w.u8(entity.style.color)
    }
    if (entity.health) {
        w.u8(5);
        w.f32(entity.health.health);
        w.f32(entity.health.maxHealth);
    }
    return w.u8(255);
}