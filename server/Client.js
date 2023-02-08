import { Vector } from "./object/Vector.js";
import { Player } from "./object/player/Player.js";

/* handles packets from client and sends back */
class Reader {
    constructor(packet) {
        this.packet = packet;
        this.index = 0;
    }
    u8() { return this.packet[this.index++]; }
}
export class Client {
    constructor(server, ws) {
        this.server = server;
        this.game = null;
        this.ws = ws;
        this.map = 0;

        this.input = 0;
        this.player = null;
        this.pos = new Vector(0,0);

        this.ws.onmessage = (req) => this.onmessage(req);
        this.ws.onclose = () => {
            this.server.remove(this);
            if (this.game) this.game.remove(this);
            if (this.player) this.game.remove(this.player);
        }
    }
    tick() {
        if (this.player) {
            this.ws.send(new Uint8Array([1,this.player.pos.x,this.player.pos.y])); //clientbound packet
        } else this.pos = new Vector(0,0);
    }
    onmessage(req) {
        const reader = new Reader(new Uint8Array(req.data));
        switch(reader.u8()) {
            case 0:
                this.map = reader.u8();
                if (this.map > 0) break; 
                this.game = this.server.maps[this.map];
                this.player = new Player(this.game, 10, 10, 10, this); //client spawned, give it a player
                this.game.add(this); //add the camera
                this.game.add(this.player); //add the player of the camera
                break;
            case 1:
                this.input = reader.u8();
                break;
        }
    }
}