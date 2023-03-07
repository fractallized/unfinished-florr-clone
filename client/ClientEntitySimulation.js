"use strict";
let clientRender = { static: {}, entities: {}, selected: null, inventory: new Int32Array(100) };
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
        this._health = new ExponentialLerpValue(r.u8(), 0.2);
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
    constructor(x,y,r) {
        this.pos = new ClientEntityPositionComponent(x,y,r);
    }
    get x() { return this.pos.x }
    get y() { return this.pos.y }
    draw() {}
}
class Background extends ClientEntity {
    constructor(x,y,w,h) {
        super(x,y,0);
        this.baseX = x;
        this.baseY = y;
        this.width = w;
        this.height = h;
    }
    keepPosition() {
        this.pos.x = this.baseX * staticScale;
        this.pos.y = this.baseY * staticScale;
    }
    draw() {
        this.keepPosition();
        ctx.fillStyle = '#aaaaaa';
        ctx.strokeStyle = '#555555';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 15;
        ctx.setTransform(staticScale,0,0,staticScale,this.pos.x,this.pos.y);
        ctx.strokeRect(0,0,this.width,this.height);
        ctx.fillRect(0,0,this.width,this.height);
    }
}
class IntermediatePetal extends ClientEntity {
    settled = -1;
    lastSettled = -1000;
    constructor(spawnedFrom) {
        super(spawnedFrom.x, spawnedFrom.y, spawnedFrom.pos.radius);
        this.spawnedFrom = spawnedFrom;
        this.mousedown = true;
        this.id = spawnedFrom.id;
        this.rarity = spawnedFrom.rarity;
        this.totalEquipped = 10; //need fix;
        clientRender.selected = this;
        this.pos.radius = 50;
    }
    onmousemove(e) {
        let midY = canvas.height - staticScale * 135;
        if (Math.abs(midY - e.clientY) <= 50 * staticScale) {
            for (let n = 0; n < this.totalEquipped; n++) {
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
        clientRender.selected = null;
        this.mousedown = false;
        this.lastSettled = performance.now();
        if (this.settled === -1) {
            this.pos.x = this.spawnedFrom.x;
            this.pos.y = this.spawnedFrom.y;
            this.pos.radius = 0;
        } else {
            ws.send(new Uint8Array([2,this.settled,this.id,this.rarity]));
        }
    }
    draw() {
        if (!playerEnt) return;
        const { numEquipped, petalsEquipped } = playerEnt.player;
        this.totalEquipped = numEquipped;
        ctx.setTransform(staticScale*this.pos.radius/30,0,0,staticScale*this.pos.radius/30,this.pos.x,this.pos.y);
        ctx.globalAlpha = 1;
        if (this.settled === -1 && this.mousedown) {
            ctx.rotate(Math.sin(this.pos.angle) * 0.1);
            this.pos.angle += 0.2;
        }
        if (this.mousedown) drawLoadoutPetal(this.id, this.rarity, 255, 0);
        else { 
            if (this.settled !== -1) drawLoadoutPetal(this.id, this.rarity, 0.01, 0);
            else drawLoadoutPetal(this.id, this.rarity, 255, 0);
            if (performance.now() - this.lastSettled > 1000 || (petalsEquipped[this.settled * 2] === this.id && petalsEquipped[this.settled * 2 + 1] === this.rarity)) delete clientRender.entities[-1];
        }
    }
}
class InventoryPetal extends ClientEntity {
    constructor(id, rarity, count, invPos) {
        super((clientRender.static.inventoryBG.pos.x + 75 * (1 + invPos % 5)) * staticScale,(clientRender.static.inventoryBG.pos.y + 75 * (1 + (invPos / 5) | 0)) * staticScale,0);
        this.id = id;
        this.rarity = rarity;
        this.count = count;
        this.invPos = invPos;
        this.pos.radius = 30;
    }
    get x() { return this.pos.values.x.value }
    get y() { return this.pos.values.y.value }
    onmousedown() {
        clientRender.entities[-1] = new IntermediatePetal(this);
    }
    keepPosition() {
        this.pos.x = clientRender.static.inventoryBG.pos.x + (75 * (this.invPos % 5 + 1)) * staticScale//(25 + (this.invPos % 6) * 60) * staticScale;
        this.pos.y = clientRender.static.inventoryBG.pos.y + (75 * (1 + (this.invPos / 5) | 0)) * staticScale//canvas.height + ( - 200) * staticScale;
    }
    draw() {
        this.keepPosition();
        ctx.setTransform(staticScale*this.pos.radius/30,0,0,staticScale*this.pos.radius/30,this.x,this.y);
        ctx.globalAlpha = 1;
        drawLoadoutPetal(this.id, this.rarity, 255, 0);
        if (this.count === 1) return;
        ctx.translate(24,-18);
        ctx.rotate(0.5);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'center';
        ctx.font = '15px Ubuntu';
        ctx.lineWidth = 3;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.strokeText(`x${this.count}`,0,0);
        ctx.fillText(`x${this.count}`,0,0);
    }
}
class LoadoutPetal extends ClientEntity {
    lastSettled = -1000;
    settled = -1;
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
clientRender.static.inventoryBG = new Background(25,400,450,300);