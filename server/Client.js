import { Vector } from "./object/Vector.js";
import { Player } from "./object/player/Player.js";
import { Reader } from "./coder/Reader.js";
import { Writer } from "./coder/Writer.js";
import { compileEnt } from "./coder/PacketMaker.js";

export class Client {
    constructor(server, ws) {
        this.server = server;
        this._arena = null;
        this.ws = ws;
        this.map = 0;

        this.input = 0;
        this.camera = new Vector(0,0);
        this.camera.fov = 1;
        this.camera.player = -1;

        this.ws.onmessage = (req) => this.onmessage(req);
        this.ws.onclose = () => {
            this.server.remove(this);
            if (this._arena) {
                this._arena.remove(this);
                if (this.player) this._arena.remove(this.player);
            }
        }
    }
    tick() {
        if (this.camera) {
            if (this.player) this.camera.set(this.player.pos.x, this.player.pos.y);
            const p = new Writer();
            p.u8(1);
            for (const id of this._arena.deletions) p.i32(id);
            p.i32(-1);
            compileEnt(p, this._arena);
            for (const entity of Object.values(this._arena.entities)) !entity.pendingDelete && compileEnt(p, entity);
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
                this.player = new Player(this._arena, 500, 500, 30, this); //client spawned, give it a player
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