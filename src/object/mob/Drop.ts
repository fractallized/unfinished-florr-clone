import Entity from "../Entity.js";
import Vector from "../Vector.js";
import { OneDimensionalVector } from "../Vector.js";
import Player from "../player/Player.js";
import { DropComponent } from "../Components.js";
import Arena from "../../game/Arena.js";

export default class Drop extends Entity {
    static BASE_VELOCITY = 12;
    collectedBy: Player | null = null;
    creationTick: number;
    angle: OneDimensionalVector;
    drop: DropComponent;
    canCollide = false;
    constructor(arena: Arena, x: number, y: number, r: number, moveAngle: number, dropDefinition: any, moreThanOne = true) {
        super(arena, x, y, r, 0);

        this.drop = new DropComponent(this,dropDefinition.id,dropDefinition.rarity); //id,rar

        this.angle = new OneDimensionalVector(0,3.8,0);
        this.friction = 0.9;
        this.creationTick = this._arena._tick;
        if (moreThanOne) this.vel.add(Vector.fromPolar(Drop.BASE_VELOCITY, moveAngle));
    }
    tick() {
        if (this._arena._tick - this.creationTick > (1 + this.drop.rarity) * 25 * 10) this.delete();
        if (this._arena._tick - this.creationTick === 15) this.canCollide = true;
        if (this.pendingDelete) return super.tick();
        if (this.collectedBy) {
            if (this.pos.distanceSq(this.collectedBy.pos) <= (this.pos.radius + this.collectedBy.pos.radius) ** 2) {
                this.collectedBy.owner.inventory.add((this.drop.id - 1) * 8 + this.drop.rarity, 1);
                this.delete();
                //add to loadout if possible
                for (let n = 0; n < 2 * this.collectedBy.owner.numEquipped; n += 2) {
                    if (this.collectedBy.playerInfo.petalsEquipped.values[n]) continue;
                    this.collectedBy.changePetal(n >> 1, this.drop.id, this.drop.rarity);
                    return;
                }
                for (let n = 2 * this.collectedBy.owner.numEquipped; n < 4 * this.collectedBy.owner.numEquipped; n += 2) {
                    if (this.collectedBy.playerInfo.petalsEquipped.values[n]) continue;
                    this.collectedBy.changePetal(n >> 1, this.drop.id, this.drop.rarity);
                    return;
                }
                return;
            }
            this.vel.add(Vector.sub(this.collectedBy.pos, this.pos).normalize().scale(8));
            this.pos.angle += 0.4;
            return super.tick();
        }
        this.angle.tick();
        this.angle.vel *= 0.8;
        this.pos.angle = this.angle.pos;
        super.tick();
    }
    wipeState() {
        this.state = 0;
        this.drop.reset();
        super.wipeState();
    }
}