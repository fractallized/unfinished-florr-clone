"use strict";
let clientRender = { entities: {}, selected: null };
class ExponentialLerpValue {
    constructor(v, pct) {
        this.value = v;
        this.at = v;
        this.pct = pct;
    }
    set(v) { this.value = v }
    get lerp() { this.at += this.pct * (this.value - this.at); return this.at; }
}
class LerpValue {
    constructor(v) {
        this.last = this.value = v;
        this.lastUpdated = performance.now();
    }
    get lerp() { 
        const time = lerpTime(this.lastUpdated, MSPT);
        return lerp(this.last, this.value, time);
    }
    set(v) {
        if (this.value === v) return;
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
    get lerp() { return angleLerp(this.last, this.value, lerpTime(this.lastUpdated, MSPT)); }
    set(v) {
        if (this.value === v) return;
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
            angle: new AngleLerpValue(r.f32())
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
            fov: new ExponentialLerpValue(r.f32(), 0.2),
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
        for (let n = 0; n < this.numEquipped * 2; n++) {
            if (this.petalsEquipped[n * 2]) clientRender.entities[n] = new LoadoutPetal(n, this.numEquipped);
        }
    }
}
class ClientEntityPositionComponent {
    constructor(x, y, r) {
        this.values = {
            x: new ExponentialLerpValue(x, 0.15),
            y: new ExponentialLerpValue(y, 0.15),
            angle: new AngleLerpValue(0),
            radius: new ExponentialLerpValue(r, 0.1)
        };
    }
    get x() { return this.values.x.lerp; }
    get y() { return this.values.y.lerp; }
    get angle() { return this.values.angle.lerp; }
    get radius() { return this.values.radius.lerp; }
    set x(v) { this.values.x.set(v); }
    set y(v) { this.values.y.set(v); }
    set angle(v) { this.values.angle.set(v); }
    set radius(v) { this.values.radius.set(v); }
}
class ClientEntity {
    mousedown = false;
    hover = false;
    settled = false;
    constructor(x,y,r) {
        this.pos = new ClientEntityPositionComponent(x,y,r);
    }
    draw() {}
}
class LoadoutPetal extends ClientEntity {
    lastSettled = -1000;
    constructor(loadoutPos, totalEquipped) {
        if (loadoutPos < totalEquipped) { super(canvas.width/2 + staticScale * (loadoutPos - totalEquipped * 0.5 + 0.5) * 100,canvas.height - staticScale * 135,0); this.pos.radius = 40; }
        else { super(canvas.width/2 + staticScale * (loadoutPos - totalEquipped * 1.5 + 0.5) * 80,canvas.height - staticScale * 45, 0); this.pos.radius = 30; }
        this.loadoutPos = loadoutPos;
        this.top = loadoutPos < totalEquipped;
        this.totalEquipped = totalEquipped;
    }
    keepPosition() {
        if (this.mousedown || performance.now() - this.lastSettled < 1000) return;
        if (this.top) {
            this.pos.x = canvas.width/2 + staticScale * (this.loadoutPos - this.totalEquipped * 0.5 + 0.5) * 100;
            this.pos.y = canvas.height - staticScale * 135;
            this.pos.radius = 40;
        }
        else {
            this.pos.x = canvas.width/2 + staticScale * (this.loadoutPos - this.totalEquipped * 1.5 + 0.5) * 80;
            this.pos.y = canvas.height - staticScale * 45;
            this.pos.radius = 30;
        }
        this.pos.angle = 0;
    }
    onmousedown(e) {
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
        this.mousedown = true;
        clientRender.selected = this;
        this.pos.radius = 50;
    }
    onmousemove(e) {
        let midY = canvas.height - staticScale * 135;
        if (Math.abs(midY - e.clientY) <= 50 * staticScale) {
            for (let n = 0; n < this.totalEquipped; n++) {
                if (n === this.loadoutPos) continue;
                const midX = canvas.width/2 + staticScale * (n - this.totalEquipped * 0.5 + 0.5) * 100;
                if (Math.abs(e.clientX - midX) > 50 * staticScale) continue;
                this.pos.x = midX;
                this.pos.y = midY;
                this.pos.radius = 40;
                this.settled = n;
                return;
            }
        }
        midY = canvas.height - staticScale * 45;
        if (Math.abs(midY - e.clientY) <= 40 * staticScale) {
            for (let n = this.totalEquipped; n < this.totalEquipped*2; n++) {
                if (n === this.loadoutPos) continue;
                const midX = canvas.width/2 + staticScale * (n - this.totalEquipped * 1.5 + 0.5) * 80;
                if (Math.abs(e.clientX - midX) > 40 * staticScale) continue;
                this.pos.x = midX;
                this.pos.y = midY;
                this.pos.radius = 30;
                this.settled = n;
                return;
            }
        }
        this.settled = -1;
        this.pos.x = e.clientX;
        this.pos.y = e.clientY;
        this.pos.radius = 50;
    }
    onmouseup(e) {
        this.lastSettled = performance.now();
        clientRender.selected = null;
        this.mousedown = false;
        if (this.settled !== -1) ws.send(new Uint8Array([3,this.settled,this.loadoutPos]));
        else {
            this.pos.x = 0;
            this.pos.y = 0;
            this.pos.radius = 0;
            ws.send(new Uint8Array([2,this.loadoutPos,0,0]));
        }
    }
    draw() {
        if (!playerEnt) return;
        this.keepPosition();
        const { numEquipped, petalsEquipped, petalHealths, petalCooldowns } = playerEnt.player;
        this.totalEquipped = numEquipped;
        ctx.globalAlpha = 1;
        ctx.setTransform(staticScale*this.pos.radius/30,0,0,staticScale*this.pos.radius/30,this.pos.x, this.pos.y);
        if (this.mousedown && this.settled === -1) {
            ctx.rotate(Math.sin(this.pos.angle) * 0.1);
            this.pos.angle += 0.2;
        }
        if (this.top) drawLoadoutPetal(petalsEquipped[this.loadoutPos * 2], petalsEquipped[this.loadoutPos * 2 + 1], petalCooldowns[this.loadoutPos].lerp, petalHealths[this.loadoutPos].value === 255? 255: petalHealths[this.loadoutPos].lerp);
        else drawLoadoutPetal(petalsEquipped[this.loadoutPos * 2], petalsEquipped[this.loadoutPos * 2 + 1], 255, 0);
    }
}