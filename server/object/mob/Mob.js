import { Entity } from "../Entity.js";
import { Drop } from "./Drop.js";
import { COMPONENTS } from "../Components.js";
import { interpolate } from "../Vector.js";
import { FROM_TABLE, MOB_RARITY_MULTIPLIER, MOB_SIZE_MULTIPLIER } from "../../coder/Helpers.js";
//TODO: AI
export class Mob extends Entity {
    constructor(arena, zone, x, y, angle, rarity, mobDefinition) {
        super(arena, x, y, mobDefinition.size * MOB_SIZE_MULTIPLIER[rarity], angle);
        this.zone = zone;
        this.style.color = 1;
        this.health = new COMPONENTS.HealthComponent(this, mobDefinition.health * MOB_RARITY_MULTIPLIER[rarity]);
        this.mob = new COMPONENTS.MobComponent(this, mobDefinition.id, rarity);
        this.damage = mobDefinition.damage * MOB_RARITY_MULTIPLIER[rarity];
        this.lastIdle = arena.server.tick - 100;
        this.friction = 0.97;
        this.loot = mobDefinition.loot;
        this.angle = angle;
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this._arena.server.tick - this.lastIdle > 100) {
            if (Math.random() < 0.05) {
                this.angle = Math.random() * 2 * Math.PI;
                this.lastIdle = this._arena.server.tick;
            }
        }
        if (this._arena.server.tick - this.lastIdle < 25) this.pos.angle = interpolate(this.pos.angle, this.angle, 0.1);
        else if (this._arena.server.tick - this.lastIdle === 25) this.vel.set(Math.cos(this.pos.angle) * 8, Math.sin(this.pos.angle) * 8);
        const collisions = this.getCollisions();
        for (const ent of collisions) {
            if (ent === this) continue;
            if (ent instanceof Drop) continue;
            if (ent.pendingDelete) continue;
            if (this.pos.distanceSq(ent.pos) > (this.pos.radius + ent.pos.radius) ** 2) continue;
            this.collideWith(ent);
        }
        super.tick();
    }
    onCollide(ent) {
        if (ent.playerInfo || ent.petal) {
            if (this._arena.server.tick - this.health.lastDamaged > 2) {
                this.health.health -= ent.damage;
                this.health.lastDamaged = this._arena.server.tick;
            }
        }
        if (this.health.health < 0.0001) { 
            this.health.health = 0;
            this.delete();
        }
    }
    delete() {
        --this.zone.mobCount;
        const drops = [];
        for (const [id, table] of Object.entries(this.loot)) {
            const rar = FROM_TABLE(table[this.mob.rarity]);
            if (rar) drops.push([id, rar - 1]);
        }
        for (let n = 0; n < drops.length; ++n) {
            this._arena.add(new Drop(this._arena, this.pos.x, this.pos.y, 40, 2 * n * Math.PI / drops.length, {
                id: parseInt(drops[n][0]),
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