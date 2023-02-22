import { Entity } from "../Entity.js";
import { Drop } from "./Drop.js";
import { COMPONENTS } from "../Components.js";
import { FROM_TABLE, MOB_RARITY_MULTIPLIER, MOB_SIZE_MULTIPLIER } from "../../coder/Helpers.js";
import { AI } from "./AI.js";
//TODO: AI
export class Mob extends Entity {
    constructor(arena, zone, x, y, angle, rarity, mobDefinition) {
        super(arena, x, y, mobDefinition.size * MOB_SIZE_MULTIPLIER[rarity], angle);
        this.zone = zone;
        this.style.color = 1;
        this.health = new COMPONENTS.HealthComponent(this, mobDefinition.health * MOB_RARITY_MULTIPLIER[rarity]);
        this.mob = new COMPONENTS.MobComponent(this, mobDefinition.id, rarity);
        this.damage = mobDefinition.damage * MOB_RARITY_MULTIPLIER[rarity];
        this.lastIdle = arena._tick - 100;
        this.friction = 0.8;
        this.loot = mobDefinition.loot;
        this.angle = angle;
        this.ai = new AI(this, 500);
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        this.ai.tick();
        this.accel.set2(this.ai.input.normalize().scale(2));
        this.pos.angle = this.ai.input.angle ?? this.pos.angle;
        const collisions = this.getCollisions();
        for (const ent of collisions) {
            if (ent === this) continue;
            if (ent instanceof Drop) continue;
            if (this.pos.distanceSq(ent.pos) > (this.pos.radius + ent.pos.radius) ** 2) continue;
            this.collideWith(ent);
        }
        super.tick();
    }
    onCollide(ent) {
        if (ent.playerInfo || ent.petal) {
            if (this._arena._tick - this.health.lastDamaged > 2) {
                this.health.health -= ent.damage;
                this.health.lastDamaged = this._arena._tick;
            }
        }
        if (this.health.health < 0.0001) { 
            this.health.health = 0;
            this.delete();
        }
    }
    delete() {
        if (this.pendingDelete) return;
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