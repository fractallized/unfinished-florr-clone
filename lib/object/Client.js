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
        this.numEquipped = 8;
        this._arena = null;
        this.player = null;
        this.map = 0;
        this.input = 0;
        this.equipped = new Uint8Array(40);
        this.inventory = new Inventory_1.default();
        this.addedToArena = false;
        this.id = 0;
        this.camera = new Components_1.CameraComponent(this, 0, 0, Client.BASE_FOV, -1);
        this.server = server;
        this.ws = ws;
        //this.setPetal(0, 3, 0);
        //this.setPetal(1, 2, 0);
        this.inventory.add((3 - 1) * 8 + 7, 1);
        this.inventory.add((3 - 1) * 8 + 7, 1);
        this.inventory.add((7 - 1) * 8 + 7, 1);
        this.inventory.add((9 - 1) * 8 + 7, 1);
        this.setPetal(0, 3, 7);
        this.setPetal(1, 3, 7);
        this.setPetal(2, 7, 7);
        this.setPetal(3, 9, 7);
        this.ws.onmessage = (req) => this.onmessage(req);
        this.ws.onclose = () => {
            console.log("client left");
            this.server.remove(this);
            if (this._arena instanceof Arena_js_1.default) {
                this._arena.removeClient(this);
                if (this.player instanceof Player_1.default) {
                    this._arena.removeFromActive(this.player);
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
            return; //check if client has enough
        this.equipped[pos * 2] = id;
        this.equipped[pos * 2 + 1] = rarity;
        this.player && this.player.changePetal(pos, id, rarity);
    }
    swapPetals(pos1, pos2) {
        //no need for petal count validation
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
                if (!inView.has(entity)) {
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
                p.i32(ent.id);
            p.i32(-1);
            (0, PacketMaker_1.compileEnt)(p, this._arena, this.state);
            (0, PacketMaker_1.compileEnt)(p, this, this.state);
            for (const entity of creates)
                (0, PacketMaker_1.compileEnt)(p, entity, 2);
            for (const entity of updates)
                (0, PacketMaker_1.compileEnt)(p, entity, this.state);
            p.i32(-1);
            (0, PacketMaker_1.compileInventory)(p, this.inventory, this.state);
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
        this.player = new Player_1.default(this._arena, x, y, 25, this); //client spawned, give it a player
        this._arena.addClient(this); //add the camera
        this.addedToArena = true;
        this._arena.add(this.player); //add the player of the camera
        this.camera.player = this.player.id;
        this.enteredPortalTick = this._arena._tick; //prevent ping ponging petween portals
        this.ws.send(new Uint8Array([254]));
        this.state = 2;
    }
    onmessage(req) {
        const reader = new Reader_1.default(new Uint8Array(req.data));
        switch (reader.u8()) {
            case 0:
                if (this.player)
                    break;
                this.moveServer(0, 5000, 5000); //initial spawn
                break;
            case 1:
                this.input = reader.u8();
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
    wipeState() {
        this.state = 0;
        this.camera.reset();
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
    get angle() {
        if (this.x && this.y)
            return Math.atan2(this.y, this.x);
        return null;
    }
}
exports.Input = Input;