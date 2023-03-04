import Client from "../object/Client";
import { Server } from "ws";
import Arena from "./Arena";

export default class GameServer {
    wss: Server;
    clients: Set<Client>;
    maps: Arena[];
    tick = 0;
    constructor(server: Server) {
        this.wss = server;
        this.clients = new Set();
        this.maps = [
            new Arena(this,3000,3000,0,'Spawn'),
            new Arena(this,400,400,1,'Easy Garden'),
            new Arena(this,3000,3000,2,'Medium Garden')
        ];
        this.maps[0].setZones([{
            x: 0, y: 0, w: 3000, h: 3000,
            spawnTable: {
                MOB_CAP: 10,
                BASE_CHANCE: 0.3,
                MOB_CHANCE: {
                    1: 0.2, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.2,
                },
                RARITY_CHANCE: [0.8,0.15,0.05]
            }
        }]).setPortals([[50,50,100,100,1]]);

        setInterval(() => {
            for (const map of this.maps) if (map.clients.size) map.tick();
            ++this.tick;
        }, 40);
        this.wss.on("connection", (ws : WebSocket) => this.add(ws));
    }
    add(ws: WebSocket) {
        this.clients.add(new Client(this, ws));
    }
    remove(client: Client) {
        this.clients.delete(client);
    }
}