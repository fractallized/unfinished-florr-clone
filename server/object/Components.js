import { Vector } from "./Vector.js";

class PositionComponent extends Vector {
    constructor(x, y, angle, radius) {
        super(x, y);
        this.angle = angle;
        this.radius = radius;
    }
}
class CameraComponent extends Vector {
    constructor(x, y, fov, player) {
        super(x, y);
        this.fov = fov;
        this.player = player;

    }
}
class ArenaComponent {
    constructor(width, height, name) {
        this.width = width;
        this.height = height;
        this.name = name;
    }
}
class StyleComponent {
    constructor(color, opacity) {
        this.color = color;
        this.opacity = opacity;
    }
}
class HealthComponent {
    constructor(health, maxHealth, lastDamaged) {
        this.health = health;
        this.maxHealth = maxHealth;
        this.lastDamaged = lastDamaged;
    }
}
class DropComponent {
    constructor(id, rarity) {
        this.id = id;
        this.rarity = rarity;
        this.hidden = false;
    }
}
class PlayerInfoComponent {
    constructor(petalsEquipped) {
        this.numEquipped = 0;
        this.petalsEquipped = petalsEquipped;
        this.petalCooldowns = new Uint8Array(10);
        this.petalHealths = new Uint8Array(10);
        this.faceFlags = 0;
    }
}
class MobComponent {
    constructor(id, rarity) {
        this.id = id;
        this.rarity = rarity;
    }
}
class PetalComponent {
    constructor(id, rarity) {
        this.id = id;
        this.rarity = rarity;
    }
}
export const COMPONENTS = {
    PositionComponent,
    CameraComponent,
    ArenaComponent,
    StyleComponent,
    HealthComponent,
    DropComponent,
    PlayerInfoComponent,
    MobComponent,
    PetalComponent
}