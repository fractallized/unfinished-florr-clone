import { Player } from "./object/player/Player.js";
import { Reader } from "./coder/Reader.js";
import { Writer } from "./coder/Writer.js";
import { compileEnt, compileInventory } from "./coder/PacketMaker.js";
import { COMPONENTS } from "./object/Components.js";
import { Arena } from "./game/Arena.js";
import { Inventory } from "./game/Inventory.js";

export class Client {
    state = 2;
    enteredPortalTick = -100;
    view = new Set();

    constructor(server, ws) {
        this.server = server;
        this._arena = null;
        this.ws = ws;

        this.map = 0;
        this.input = 0;
        this.camera = new COMPONENTS.CameraComponent(this,0,0,1,-1);
        this.equipped = new Uint8Array(40).fill(0).map((_,i) => i<10?1-(i&1):0);
        this.numEquipped = 8;

        this.inventory = new Inventory(this); //separate packet send
        this.inventory[0] = 5; //init inv;

        this.ws.onmessage = (req) => this.onmessage(req);
        this.ws.onclose = () => {
            console.log("client left")
            this.server.remove(this);
            if (this._arena instanceof Arena) {
                this._arena.removeClient(this);
                if (this.player instanceof Player) this._arena.removeFromActive(this.player);
            }
        }
    }
    tick() {
        if (this.camera) {
            if (this.player) this.camera.set(this.player.pos.x, this.player.pos.y);
            const p = new Writer();
            //const renders = [];
            p.u8(1);
            for (const id of Object.keys(this._arena.deletions)) p.i32(id);
            p.i32(-1);
            compileEnt(p, this._arena, this.state);
            compileEnt(p, this, this.state);
            for (const entity of Object.values(this._arena.entities)) compileEnt(p, entity, this.state);
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
            if (this.player instanceof Player) this._arena.removeFromActive(this.player);
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
        this.enteredPortalTick = this.server.tick; //prevent ping ponging petween portals
        this.ws.send(new Uint8Array([254]));
        this.state = 2;
    }
    onmessage(req) {
        const reader = new Reader(new Uint8Array(req.data));
        switch(reader.u8()) {
            case 0:
                if (this.player) break;
                this.moveServer(0, 1800, 1000);
                break;
            case 1:
                this.input = reader.u8();
                break;
            case 2:
                if (!this.player) return;
                const index = reader.u8() << 1;
                const id = reader.u8(), rarity = reader.u8();
                if (this.player.playerInfo.petalsEquipped[index] === id && this.player.playerInfo.petalsEquipped[index + 1] === rarity) return;
                let sameCt = 0;
                for (let n = 0; n < 40; n += 2) if (this.equipped[n] === id && this.equipped[n + 1] === rarity) ++sameCt;
                if (sameCt >= this.inventory[((id - 1) << 3) + rarity]) return; //check if client has enough
                this.player.changePetal(index >> 1, id, rarity);
                for (let n = 0; n < 40; ++n) this.equipped[n] = this.player.playerInfo.petalsEquipped[n];
                break;
        }
    }
    wipeState() {
        this.state = 0;
        this.camera.reset();
    }
}