import { COMPONENTS } from "../Components.js";
import { Entity } from "../Entity.js";
import { OneDimensionalVector, Vector } from "../Vector.js";
import { Mob } from "../mob/Mob.js";

//TODO: FIX UP FIELD GROUPS AND FINALIZE NECESSARY ONES

export class Petal extends Entity {
    constructor(arena, player, x, y, outerPos, innerPos, pos, rarity, petalDefinition) {
        super(arena, x, y, petalDefinition.radius, 0);

        this.health = new COMPONENTS.HealthComponent(petalDefinition.health,petalDefinition.health,-1);
        this.petal = new COMPONENTS.PetalComponent(petalDefinition.id, rarity);
        this.damage = petalDefinition.damage;
        this.weight = 0.5;

        this.player = player;
        this.rotationPos = pos;
        this.outerPos = outerPos;
        this.innerPos = innerPos;
        this.holdingRadius = new OneDimensionalVector(0,20,0);
        this.pos.add(Vector.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc))
    }
    tick() {
        const input = this.player.owner.input;
        const hoverRadius = 100 + (((input >> 4) & 1) - ((input >> 5) & 1)) * 60;
        if (this.pendingDelete) return super.tick();
        if (this.player.pendingDelete || this.player !== this._arena.entities[this.player.id]) return this.delete();
        this.holdingRadius.accel = ((hoverRadius - this.holdingRadius.pos) * 0.04);
        this.holdingRadius.vel *= 0.8;
        this.holdingRadius.tick();

        this.pos.set2(Vector.fromPolar(this.holdingRadius.pos, this.player.rotationAngle + this.rotationPos * 2 * Math.PI / this.player.numSpacesAlloc).add(this.player.pos));
        super.tick();
    }
    onCollide(ent) {
        if (ent instanceof Mob) {
            if (this._arena.server.tick - this.health.lastDamaged > 0) {
                this.health.health -= ent.damage;
                this.health.lastDamaged = this._arena.server.tick;
            }
        }
        if (this.health.health < 0.0001) {
            this.health.health = 0;
            this.player.onPetalLoss(this.outerPos, this.innerPos);
            this.delete();
        }
    }
}