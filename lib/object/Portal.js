"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("./Client"));
const Components_1 = require("./Components");
const Entity_1 = __importDefault(require("./Entity"));
const Player_js_1 = __importDefault(require("./player/Player.js"));
class Portal extends Entity_1.default {
    constructor(arena, def) {
        super(arena, def[0], def[1], 50, 0);
        this.canCollide = false;
        this.sX = def[2];
        this.sY = def[3];
        this._arena = arena;
        this.style = new Components_1.StyleComponent(this, 0, 1);
        this.to = def[4];
    }
    tick() {
        const collisions = this._arena.collisionGrid.getEntityCollisions(this);
        for (const ent of collisions) {
            if (ent instanceof Player_js_1.default) {
                if (!(ent.owner instanceof Client_1.default))
                    continue;
                if (this._arena.server.tick - ent.owner.enteredPortalTick < 100)
                    continue;
                if (this.pos.distanceSq(ent.pos) > (this.pos.radius + ent.pos.radius) ** 2)
                    continue;
                ent.owner.moveServer(this.to, this.sX, this.sY);
            }
        }
    }
    wipeState() { }
}
exports.default = Portal;
