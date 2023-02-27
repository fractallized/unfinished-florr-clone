"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
const Player_1 = __importDefault(require("./player/Player"));
const Reader_1 = __importDefault(require("../coder/Reader"));
const Writer_1 = __importDefault(require("../coder/Writer"));
const PacketMaker_1 = require("../coder/PacketMaker");
const Components_1 = require("./Components");
const Arena_js_1 = __importDefault(require("../game/Arena.js"));
const Inventory_1 = __importDefault(require("../game/Inventory"));
const Vector_1 = __importDefault(require("./Vector"));
const AbstractEntity_1 = __importDefault(require("./AbstractEntity"));
class Client extends AbstractEntity_1.default {
    constructor(server, ws) {
        super();
        this.state = 2;
        this.enteredPortalTick = -100;
        this.view = new Set();
        this.numEquipped = 10;
        this._arena = null;
        this.player = null;
        this.map = 0;
        this.input = new Input(0, 0);
        this.equipped = new Uint8Array(40);
        this.inventory = new Inventory_1.default();
        this.addedToArena = false;
        this.id = 0;
        this.camera = new Components_1.CameraComponent(this, 0, 0, Client.BASE_FOV, -1);
        this.server = server;
        this.ws = ws;
        this.inventory.add((11 - 1) * 8 + 7, 10);
        this.inventory.add((3 - 1) * 8 + 7, 1);
        this.inventory.add((7 - 1) * 8 + 7, 1);
        this.inventory.add((9 - 1) * 8 + 7, 1);
        for (let n = 0; n < 10; ++n)
            this.setPetal(n, 11, 7);
        this.ws.onmessage = (req) => this.onmessage(req);
        this.ws.onclose = () => {
            console.log("client left");
            this.server.remove(this);
            if (this._arena instanceof Arena_js_1.default) {
                this._arena.removeClient(this);
                if (this.player instanceof Player_1.default) {
                    this._arena.remove(this.player);
                    this.player = null;
                }
            }
        };
    }
    setPetal(pos, id, rarity) {
        if (this.equipped[pos * 2] === id && this.equipped[pos * 2 + 1] === rarity)
            return;
        this.equipped[pos * 2] = 0;
        this.equipped[pos * 2 + 1] = 0;
        if (!id)
            return this.player && this.player.changePetal(pos, id, rarity);
        let sameCt = 0;
        for (let n = 0; n < 40; n += 2)
            if (this.equipped[n] === id && this.equipped[n + 1] === rarity)
                ++sameCt;
        if (sameCt >= this.inventory.get((id - 1) * 8 + rarity))
            return;
        this.equipped[pos * 2] = id;
        this.equipped[pos * 2 + 1] = rarity;
        this.player && this.player.changePetal(pos, id, rarity);
    }
    swapPetals(pos1, pos2) {
        const [i1, r1] = this.equipped.slice(pos1 * 2, pos1 * 2 + 2);
        const [i2, r2] = this.equipped.slice(pos2 * 2, pos2 * 2 + 2);
        if (this.player) {
            this.player.changePetal(pos1, i2, r2);
            this.player.changePetal(pos2, i1, r1);
        }
    }
    tick() {
        if (this.camera) {
            if (this.player && this.player.pos)
                this.camera.set(this.player.pos.x, this.player.pos.y);
            if (!this._arena)
                return;
            const p = new Writer_1.default();
            const inView = this._arena.collisionGrid.getCollisions(this.camera.x, this.camera.y, 1000 / this.camera.fov, 600 / this.camera.fov);
            const creates = [], updates = [], deletes = [];
            for (const entity of this.view) {
                if (inView.indexOf(entity) === -1) {
                    this.view.delete(entity);
                    deletes.push(entity);
                }
            }
            for (const entity of inView) {
                if (!this.view.has(entity))
                    creates.push(entity);
                else
                    updates.push(entity);
                this.view.add(entity);
            }
            p.u8(1);
            for (const ent of deletes)
                p.vu(ent.id);
            p.vu(0);
            (0, PacketMaker_1.compileEnt)(p, this._arena, this.state, this);
            (0, PacketMaker_1.compileEnt)(p, this, this.state, this);
            for (const entity of creates)
                (0, PacketMaker_1.compileEnt)(p, entity, 2, this);
            for (const entity of updates)
                (0, PacketMaker_1.compileEnt)(p, entity, this.state, this);
            p.vu(0);
            (0, PacketMaker_1.compileInventory)(p, this.inventory);
            this.ws.send(p.write());
            this.inventory.reset();
        }
        this.wipeState();
    }
    moveServer(num, x, y) {
        if (this._arena instanceof Arena_js_1.default) {
            this._arena.removeClient(this);
            if (this.player instanceof Player_1.default)
                this.player.delete();
        }
        console.log("spawn");
        this.map = num;
        this._arena = this.server.maps[this.map];
        this.player = new Player_1.default(this._arena, x, y, 25, this);
        this._arena.addClient(this);
        this.addedToArena = true;
        this._arena.add(this.player);
        this.camera.player = this.player.id;
        this.enteredPortalTick = this._arena._tick;
        this.ws.send(new Uint8Array([254]));
        this.state = 2;
    }
    onmessage(req) {
        const reader = new Reader_1.default(new Uint8Array(req.data));
        switch (reader.u8()) {
            case 0:
                if (this.player)
                    break;
                this.moveServer(0, 30, 30);
                break;
            case 1:
                this.input.input = reader.u8();
                break;
            case 2:
                if (!this.player)
                    return;
                this.setPetal(reader.u8(), reader.u8(), reader.u8());
                break;
            case 3:
                if (!this.player)
                    return;
                this.swapPetals(reader.u8(), reader.u8());
        }
    }
}
exports.default = Client;
Client.BASE_FOV = 1;
class Input extends Vector_1.default {
    constructor(x, y) {
        super(x, y);
        this.input = 0;
        this.targetX = x;
        this.targetY = y;
    }
    setTarget(v) {
        this.targetX = v.x;
        this.targetY = v.y;
    }
    tick() {
        this.x += 0.1 * (this.targetX - this.x);
        this.y += 0.1 * (this.targetY - this.y);
    }
}
exports.Input = Input;
