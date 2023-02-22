import { Player } from "./player/Player.js";
import { Reader } from "../coder/Reader.js";
import { Writer } from "../coder/Writer.js";
import { compileEnt, compileInventory } from "../coder/PacketMaker.js";
import { COMPONENTS } from "./Components.js";
import { Arena } from "../game/Arena.js";
import { Inventory } from "../game/Inventory.js";

export class Client {
    static BASE_FOV = 1;
    state = 2;
    enteredPortalTick = -100;
    view = new Set();
    numEquipped = 8;
    
    constructor(server, ws) {
        this.server = server;
        this._arena = null;
        this.ws = ws;

        this.map = 0;
        this.input = 0;
        this.camera = new COMPONENTS.CameraComponent(this,0,0,Client.baseFov,-1);
        this.equipped = new Uint8Array(40);

        this.inventory = new Inventory(this); //sent after ent upcreates
        //this.setPetal(0, 3, 0);
        //this.setPetal(1, 2, 0);
        ++this.inventory[(5 - 1) * 8 + 2];
        ++this.inventory[(7 - 1) * 8 + 2];
        this.setPetal(0, 5, 2);
        this.setPetal(1, 7, 2);
        this.setPetal(2, 3, 6);
        this.setPetal(3, 9, 7);
        this.ws.onmessage = (req) => this.onmessage(req);
        this.ws.onclose = () => {
            console.log("client left")
            this.server.remove(this);
            if (this._arena instanceof Arena) {
                this._arena.removeClient(this);
                if (this.player instanceof Player) {
                    this._arena.removeFromActive(this.player);
                    this.player = null;
                }
            }
        }
    }
    setPetal(pos, id, rarity) {
        //++this.inventory[(id - 1) * 8 + rarity];
        if (this.equipped[pos * 2] === id && this.equipped[pos * 2 + 1] === rarity) return;
        let sameCt = 0;
        for (let n = 0; n < 40; n += 2) if (this.equipped[n] === id && this.equipped[n + 1] === rarity) ++sameCt;
        if (sameCt >= this.inventory[((id - 1) << 3) + rarity]) return; //check if client has enough
        this.equipped[pos * 2] = id;
        this.equipped[pos * 2 + 1] = rarity;
        this.player && this.player.changePetal(pos, id, rarity);
    }
    tick() {
        if (this.camera) {
            if (this.player) this.camera.set(this.player.pos.x, this.player.pos.y);
            if (!this._arena) return;
            const p = new Writer();
            const inView = this._arena.collisionGrid.getCollisions(this.camera.x, this.camera.y, 1000 / this.camera.fov, 600 / this.camera.fov);
            const creates = [], updates = [], deletes = [];
            for (const entity of this.view) {
                if (!inView.has(entity)) {
                    this.view.delete(entity);
                    deletes.push(entity);
                }
            }
            for (const entity of inView) {
                if (!this.view.has(entity)) creates.push(entity);
                else updates.push(entity);
                this.view.add(entity);
            }
            p.u8(1);
            for (const ent of deletes) p.i32(ent.id);
            p.i32(-1);
            compileEnt(p, this._arena, this.state);
            compileEnt(p, this, this.state);
            for (const entity of creates) compileEnt(p, entity, 2);
            for (const entity of updates) compileEnt(p, entity, this.state);
            p.i32(-1);
            compileInventory(p, this.inventory, this.state);
            this.ws.send(p.write());
            this.inventory.reset();
        }
        this.wipeState();
    }
    moveServer(num, x, y) {
        if (this._arena instanceof Arena) {
            this._arena.removeClient(this);
            if (this.player instanceof Player) this.player.delete();
        }
        console.log("spawn");
        this.map = num;
        this._arena = this.server.maps[this.map];
        this.player = new Player(this._arena, 500, 500, 25, this); //client spawned, give it a player
        this.player.pos.set(x, y);
        this._arena.addClient(this); //add the camera
        this.addedToArena = true;
        this._arena.add(this.player); //add the player of the camera
        this.camera.player = this.player.id;
        this.enteredPortalTick = this._arena._tick; //prevent ping ponging petween portals
        this.ws.send(new Uint8Array([254]));
        this.state = 2;
    }
    onmessage(req) {
        const reader = new Reader(new Uint8Array(req.data));
        switch(reader.u8()) {
            case 0:
                if (this.player) break;
                this.moveServer(0, 5000, 5000);
                break;
            case 1:
                this.input = reader.u8();
                break;
            case 2:
                if (!this.player) return;
                this.setPetal(this.u8(), this.u8(), this.u8());
                break;
        }
    }
    wipeState() {
        this.state = 0;
        this.camera.reset();
    }
}