"use strict";
class LerpValue {
    constructor(v) {
        this.last = this.value = v;
        this.lastUpdated = performance.now();
    }
    get lerp() { return lerp(this.last, this.value, lerpTime(this.lastUpdated)); }
    set(v) {
        this.last = this.value;
        this.value = v;
        this.lastUpdated = performance.now();
    }
}
class AngleLerpValue {
    constructor(v) {
        this.last = this.value = v;
        this.lastUpdated = performance.now();
    }
    get lerp() { return angleLerp(this.last, this.value, lerpTime(this.lastUpdated)); }
    set(v) {
        this.last = this.value;
        this.value = v;
        this.lastUpdated = performance.now();
    }
}
class PositionComponent {
    constructor() {
        this.values = {
            x: new LerpValue(r.vi()),
            y: new LerpValue(r.vi()),
            angle: new AngleLerpValue(r.f32()),
        };
        this.radius = r.f32();
    }
    get x() { return this.values.x.lerp; }
    get y() { return this.values.y.lerp; }
    get angle() { return this.values.angle.lerp; }
    set x(v) { this.values.x.set(v); }
    set y(v) { this.values.y.set(v); }
    set angle(v) { this.values.angle.set(v); }
}
class CameraComponent {
    constructor() {
        this.values = {
            x: new LerpValue(r.f32()),
            y: new LerpValue(r.f32()),
            fov: new LerpValue(r.f32()),
            player: r.vu()
        };
    }
    get x() { return this.values.x.lerp; }
    get y() { return this.values.y.lerp; }
    get fov() { return this.values.fov.lerp; }
    get player() { return this.values.player; }
    set x(v) { this.values.x.set(v); }
    set y(v) { this.values.y.set(v); }
    set fov(v) { this.values.fov.set(v); }
    set player(v) { this.values.player = v; clientRender.player = v; }
}
class StyleComponent {
    constructor() {
        this.values = {
            flags: r.u8(),
            opacity: new LerpValue(r.u8())
        };
    }
    get flags() { return this.values.flags; }
    get opacity() { return this.values.opacity.lerp; }
    set flags(v) { this.values.flags = v; }
    set opacity(v) { this.values.opacity.set(v); }
}
class ArenaComponent {
    constructor() {
        this.width = r.vu();
        this.height = r.vu();
        this.name = '';
    }
}
class HealthComponent {
    constructor() {
        this._health = new LerpValue(r.u8());
    }
    get health() { return this._health.lerp; }
    set health(v) { this._health.set(v); }
}
class DropComponent {
    constructor() {
        this.id = r.u8();
        this.rarity = r.u8();
    }
}
class MobComponent {
    constructor() {
        this.id = r.u8();
        this.rarity = r.u8();
    }
}
class PetalComponent {
    constructor() {
        this.id = r.u8();
        this.rarity = r.u8();
    }
}
class PlayerComponent {
    constructor() {
        this.numEquipped = r.u8();
        this.petalsEquipped = new Uint8Array(10 * 4).map(_ => r.u8());
        this.petalHealths = new Array(10).fill(0).map(_ => new LerpValue(r.u8()));
        this.petalCooldowns = new Array(10).fill(0).map(_ => new LerpValue(r.u8()));
        this.faceFlags = r.u8();
    }
}
