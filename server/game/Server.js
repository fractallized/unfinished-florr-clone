import Client from "../object/Client.js";
import Arena from "./Arena.js";
export default class GameServer {
    constructor(server) {
        this.wss = server;
        this.clients = new Set();
        this.maps = [
            new Arena(this,3000,3000,0,'Spawn'),
            new Arena(this,3000,3000,1,'Easy Garden'),
            new Arena(this,3000,3000,2,'Medium Garden')
        ];
        this.maps[0].setZones([0,0,1000,1000,{
            MOB_CHANCE: {1: 0.2, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.2},
            RARITY_CHANCE: [0,0,0,0,0,0,0,1],
            BASE_CHANCE: 0.01 // 1 per 100 ticks, or 4 seconds
        }]).setPortals([3000,100,1,3000,5900],[100,3000,2,5900,3000]);
        this.maps[1].setZones([0,0,6000,4000,{
            MOB_CHANCE: {1: 0.3, 2: 0.2, 3: 0.1, 4: 0.1, 5: 0.3},
            RARITY_CHANCE: [0.6,0.3,0.09,0.01],
            BASE_CHANCE: 0.005 // 1 per 200 ticks, or 8 seconds
        }]).setPortals([3000,5900,0,3000,100]);
        this.maps[2].setZones([0,0,4000,6000,{
            MOB_CHANCE: {2: 0.2, 3: 0.1, 4: 0.4, 5: 0.3},
            RARITY_CHANCE: [0.2,0.4,0.3,0.09,0.01],
            BASE_CHANCE: 0.01 // 1 per 200 ticks, or 8 seconds
        }]).setPortals([5900,3000,0,100,3000]);
        this.tick = 0;

        setInterval(() => {
            for (const map of this.maps) if (map.clients.size) map.tick();
            ++this.tick;
        }, 40);
        this.wss.on("connection", ws => this.add(ws));
    }
    add(ws) {
        this.clients.add(new Client(this, ws));
    }
    remove(client) {
        this.clients.delete(client);
    }
}