import { Entity } from "../Entity.js";
import { Player } from "../player/Player.js";
import { Drop } from "./Drop.js";
import { COMPONENTS } from "../Components.js";
import { Petal } from "../player/Petal.js";
import { interpolate } from "../Vector.js";

export class Mob extends Entity {
    constructor(arena, x, y, r, angle, rarity, mobDefinition) {
        super(arena, x, y, r, angle);
        this.style.color = 1;
        this.health = new COMPONENTS.HealthComponent(mobDefinition.health,mobDefinition.health,-1);
        this.mob = new COMPONENTS.MobComponent(mobDefinition.id, rarity);
        this.damage = mobDefinition.damage;
        this.lastIdle = arena.server.tick - 100;
        this.friction = 0.97;
        this.loot = mobDefinition.loot;
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this._arena.server.tick - this.lastIdle > 100) {
            if (Math.random() < 0.05) {
                this.angle = Math.random() * 2 * Math.PI;
                this.pos.angle = interpolate(this.pos.angle, this.angle, 0.03);
                this.vel.set(Math.cos(this.pos.angle) * 8, Math.sin(this.pos.angle) * 8);
                this.lastIdle = this._arena.server.tick;
            }
        }
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
        if (ent instanceof Player || ent instanceof Petal) {
            if (this._arena.server.tick - this.health.lastDamaged > 0) {
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
        const drops = [];
        for (const [id, table] of Object.entries(this.loot)) {
            let rand = Math.random();
            for (let n = 0; n < table.length; n++) {
                rand -= table[n];
                if (rand < 0) {
                    if (n > 0) drops.push([id, n-1]);
                    break;
                }
            }
        }
        for (let n = 0; n < drops.length; n++) {
            this._arena.add(new Drop(this._arena, this.pos.x, this.pos.y, 25, 2 * n * Math.PI / drops.length, {
                id: drops[n][0],
                rarity: drops[n][1]
            }));
        }
        return super.delete();
    }
}