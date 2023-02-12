import { Player } from "./object/player/Player.js";
import { Reader } from "./coder/Reader.js";
import { Writer } from "./coder/Writer.js";
import { compileEnt } from "./coder/PacketMaker.js";
import { COMPONENTS } from "./object/Components.js";
import { Arena } from "./game/Arena.js";

export class Client {
    constructor(server, ws) {
        this.server = server;
        this._arena = null;
        this.ws = ws;

        this.map = 0;
        this.input = 0;
        this.camera = new COMPONENTS.CameraComponent(0,0,0.4,-1);
        this.equipped = new Uint8Array(40).fill(1).map((_,i) => i&1?Math.random() * 3: (4));
        this.numEquipped = 5;

        this.inventory = {
            0:5
        }; //separate packet send

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
            p.u8(1);
            for (const id of Object.keys(this._arena.deletions)) p.i32(id);
            p.i32(-1);
            compileEnt(p, this._arena);
            compileEnt(p, this);
            for (const entity of Object.values(this._arena.entities)) compileEnt(p, entity);
            p.i32(-1);
            this.ws.send(p.write()); //clientbound
        }
    }
    onmessage(req) {
        const reader = new Reader(new Uint8Array(req.data));
        switch(reader.u8()) {
            case 0:
                if (this.player) break;
                console.log("spawn");
                this.map = 0;
                this._arena = this.server.maps[this.map];
                this.player = new Player(this._arena, 500, 500, 25, this); //client spawned, give it a player
                this._arena.addClient(this); //add the camera
                this._arena.add(this.player); //add the player of the camera
                this.camera.player = this.player.id;
                break;
            case 1:
                this.input = reader.u8();
                break;
            case 2:
                break;
        }
    }
}