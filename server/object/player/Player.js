import { Object } from "../Object.js";

export class Player extends Object {
    constructor(arena, x, y, r, camera) {
        super(arena, x, y, r, 0);
        this.owner = camera;
        this.inventory = [];
    }
    tick() {
        this.owner.pos = this.pos;
        const x = (this.owner.input & 1) - ((this.owner.input >> 2) & 1),
        y = ((this.owner.input >> 1) & 1) - ((this.owner.input >> 3) & 1);
        const scale = (x&&y? Math.SQRT1_2: x||y?1:0) * 0.4; //sets player speed
        this.accel.set(x,y);
        this.accel.scale(scale);
        super.tick();
    }
}