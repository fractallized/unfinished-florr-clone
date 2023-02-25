"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Entity_1 = __importDefault(require("../Entity"));
const Drop_1 = __importDefault(require("./Drop"));
const Helpers_js_1 = require("../../coder/Helpers.js");
const Components_1 = require("../Components");
const Player_1 = __importDefault(require("../player/Player"));
const Petal_1 = __importDefault(require("../player/Petal"));
//TODO: AI
class Mob extends Entity_1.default {
    constructor(arena, zone, x, y, angle, rarity, mobDefinition) {
        super(arena, x, y, mobDefinition.size * Helpers_js_1.MOB_SIZE_MULTIPLIER[rarity], angle);
        this.passiveSpeed = 4; //in bursts
        this.aggroSpeed = 2;
        this.lastIdle = -1;
        this.zone = zone;
        this.health = new Components_1.HealthComponent(this, mobDefinition.health * Helpers_js_1.MOB_RARITY_MULTIPLIER[rarity]);
        this.mob = new Components_1.MobComponent(this, mobDefinition.id, rarity);
        this.damage = mobDefinition.damage * Helpers_js_1.MOB_RARITY_MULTIPLIER[rarity];
        this.loot = mobDefinition.loot;
        this.ai = new (mobDefinition.AI(rarity))(this);
    }
    tick() {
        if (this.pendingDelete)
            return super.tick();
        this.ai.tick(); //sets changes in acceleration and angle as well
        const collisions = this.getCollisions();
        for (const ent of collisions) {
            if (ent === this)
                continue;
            if (ent instanceof Drop_1.default)
                continue;
            if (this.pos.distanceSq(ent.pos) > (this.pos.radius + ent.pos.radius) ** 2)
                continue;
            this.collideWith(ent);
        }
        super.tick();
    }
    onCollide(ent) {
        if ((ent.playerInfo || ent.petal) && this._arena._tick - this.health.lastDamaged > 2) {
            if (ent instanceof Player_1.default)
                this.ai.onDamage(ent);
            else if (ent instanceof Petal_1.default)
                this.ai.onDamage(ent.player);
            this.health.health -= ent.damage;
            this.health.lastDamaged = this._arena._tick;
        }
        if (this.health.health < 0.0001) {
            this.health.health = 0;
            this.delete();
        }
    }
    delete() {
        if (this.pendingDelete)
            return;
        --this.zone.mobCount;
        const drops = [];
        for (const id of Object.keys(this.loot)) {
            const rar = (0, Helpers_js_1.FROM_TABLE)(this.loot[parseInt(id)][this.mob.rarity]);
            if (rar)
                drops.push([parseInt(id), rar - 1]);
        }
        for (let n = 0; n < drops.length; ++n) {
            this._arena.add(new Drop_1.default(this._arena, this.pos.x, this.pos.y, 40, 2 * n * Math.PI / drops.length, {
                id: drops[n][0],
                rarity: drops[n][1]
            }));
        }
        return super.delete();
    }
    wipeState() {
        this.health.reset();
        this.mob.reset();
        super.wipeState();
    }
}
exports.default = Mob;
