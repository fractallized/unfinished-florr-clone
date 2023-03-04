import { HealthComponent, PetalComponent } from "../Components";
import Entity from "../Entity";
import Vector, { OneDimensionalVector } from "../Vector";
import { PETAL_RARITY_MULTIPLIER, PI_2 } from "../../consts/Helpers";
import Player, { PlayerPetal } from "./Player";
import Arena from "../../game/Arena";

export default class Petal extends Entity {
    static BASE_FRICTION = 0.5;
    static BASE_WEIGHT = 0.01;
    
    ROTATION_FIRMNESS = 0.4;

    petal: PetalComponent;
    health: HealthComponent;
    player: Player;

    rotationPos: number;
    outerPos: number;
    innerPos: number;
    count: number;
    damage: number;
    petalDefinition: PlayerPetal;
    clump: boolean;
    creationTick: number;
    isFriendly = true;
    poison: { dpt: number, ticks: number} | null;
    holdingRadius = 0;
    followNormalRotation = true;
    constructor(arena: Arena, player: Player, outerPos: number, innerPos: number, pos: number, rarity: number, petal: PlayerPetal) {
        const petalDefinition = petal.definition;
        super(arena, player.pos.x, player.pos.y, petalDefinition.radius, 0);

        this.petal = new PetalComponent(this, petalDefinition.id, rarity);
        this.health = new HealthComponent(this, petalDefinition.health * PETAL_RARITY_MULTIPLIER[rarity]);
        
        this.weight = Petal.BASE_WEIGHT;
        this.friction = Petal.BASE_FRICTION;

        this.player = player;
        this.rotationPos = pos;
        this.outerPos = outerPos;
        this.innerPos = innerPos;
        this.petalDefinition = petal;
        
        this.count = petalDefinition.repeat? petalDefinition.repeat[rarity]: 1;
        this.damage = petalDefinition.damage * PETAL_RARITY_MULTIPLIER[rarity] / this.count;
        this.poison = petalDefinition.poison ?? null;
        this.clump = petalDefinition.clump || false;
        
        this.creationTick = this._arena._tick;
    }
    tick() {
        if (this.pendingDelete) return super.tick();
        if (this.player.pendingDelete || this.player !== this._arena.entities.get(this.player.id)) return this.delete();
        this.doOrbitMechanics();
        super.tick();
    }
    doOrbitMechanics() {
        if (this.followNormalRotation) {
            const input = this.player.owner.input.input;
            this.holdingRadius = 75;
            if (this.petalDefinition.definition.preventExtend) {
                if (input & 32) this.holdingRadius = 37.5;
            } else {
                if (input & 16) this.holdingRadius = 150;
                else if (input & 32) this.holdingRadius = 37.5;
            }
        }
        if (this.clump) this.accel.set2(Vector.fromPolar(this.holdingRadius, this.player.rotationAngle + this.rotationPos * PI_2 / this.player.numSpacesAlloc).add(Vector.fromPolar(10, this.innerPos * PI_2 / this.count + this.player.rotationAngle * 0.2)).add(this.player.pos).sub(this.pos)).scale(this.ROTATION_FIRMNESS);
        else this.accel.set2(Vector.fromPolar(this.holdingRadius, this.player.rotationAngle + this.rotationPos * PI_2 / this.player.numSpacesAlloc).add(this.player.pos).sub(this.pos)).scale(this.ROTATION_FIRMNESS);
    }
    onCollide(ent: Entity) {
        if (ent.isFriendly !== this.isFriendly) {
            if (this._arena._tick - this.health.lastDamaged > 2) {
                this.doDamage(ent.damage);
                this.health.lastDamaged = this._arena._tick;
                this.style.flags ^= 2;
            }
        }
        if (this.health.health === 0) this.delete();
    }
    delete() {
        this.player.onPetalLoss(this.outerPos, this.innerPos);
        super.delete();
    }
}