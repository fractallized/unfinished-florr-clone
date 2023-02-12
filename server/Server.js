import { Client } from "./Client.js";
import { Arena } from "./game/Arena.js";
export class GameServer {
    constructor(server) {
        this.wss = server;
        this.clients = new Set();
        this.maps = [new Arena(this,2000,2000)];
        this.tick = 0;

        setInterval(() => {
            for (const map of this.maps) if (Object.keys(map.entities).length) map.tick();
            this.tick++;
        }, 40);
        this.wss.on("connection", (ws, req) => {
            this.add(ws);
        })
    }
    add(ws) {
        this.clients.add(new Client(this, ws));
    }
    remove(client) {
        this.clients.delete(client);
    }
}