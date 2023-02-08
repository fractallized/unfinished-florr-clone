import { Client } from "./Client.js";
import { Arena } from "./game/Arena.js";
export class GameServer {
    constructor(server) {
        this.wss = server;
        this.clients = new Set();
        this.maps = [new Arena(this,1000,1000)];
        this.tick = 0;

        setInterval(() => {
            for (const map of this.maps) if (map.entities.size) map.tick();
            this.tick++;
        }, 25);
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