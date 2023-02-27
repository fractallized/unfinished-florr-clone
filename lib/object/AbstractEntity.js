"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AbstractEntity {
    constructor() {
        this.pos = null;
        this.style = null;
        this.arena = null;
        this.drop = null;
        this.petal = null;
        this.mob = null;
        this.playerInfo = null;
        this.camera = null;
        this.health = null;
        this.id = 0;
        this.state = 2;
        this.pendingDelete = false;
        this.canCollide = false;
        this.lastQueried = 0;
    }
    tick() { }
    wipeState() {
        if (this.pos)
            this.pos.reset();
        if (this.style)
            this.style.reset();
        if (this.arena)
            this.arena.reset();
        if (this.drop)
            this.drop.reset();
        if (this.petal)
            this.petal.reset();
        if (this.mob)
            this.mob.reset();
        if (this.playerInfo)
            this.playerInfo.reset();
        if (this.camera)
            this.camera.reset();
        if (this.health)
            this.health.reset();
        this.state = 0;
    }
}
exports.default = AbstractEntity;
