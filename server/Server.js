import { Client } from "./Client.js";
import { Arena } from "./game/Arena.js";
export class GameServer {
    constructor(server) {
        this.wss = server;
        this.clients = new Set();
        this.maps = [
            new Arena(this,2000,2000,0,'Spawn'),
            new Arena(this,1000,1000,1,'Test'),
            new Arena(this,1000,1000,2,'Test2')
        ];
        this.maps[0].setZones([100,100,100,100,{
            BASE_CHANCE: 0.05,
            MOB_CHANCE: {5: 1},
            RARITY_CHANCE: [0,0,0,0,0,0,0.5,0.5] 
        }],
        [1800,1800,100,100,{
            BASE_CHANCE: 0.02,
            MOB_CHANCE: {1: 0.2, 2: 0.2, 3: 0.4, 4: 0.2},
            RARITY_CHANCE: [0.2,0.2,0.3,0.3] 
        }],
        [100,1800,100,100,{
            BASE_CHANCE: 0.03,
            MOB_CHANCE: {1: 0.5, 2: 0.1, 3: 0.2, 4: 0.2},
            RARITY_CHANCE: [0,0,0,0,0.5,0.5] 
        }]).setPortals([100,500,1,900,500],[100,1500,2,900,500]);

        this.maps[1].setZones([100,100,100,100,{
            BASE_CHANCE: 0.1,
            MOB_CHANCE: {1: 0.25, 2: 0.25, 4: 0.5},
            RARITY_CHANCE: [0.1,0.1,0.2,0.1,0.2,0.3] 
        }]).setPortals([900,500,0,100,500],[500,900,2,500,100]);
        
        this.maps[2].setZones([100,100,100,100,{
            BASE_CHANCE: 0.1,
            MOB_CHANCE: {1: 1},
            RARITY_CHANCE: [0,0.01,0.29,0.2,0.2,0.3] 
        }]).setPortals([900,500,0,100,500],[500,100,1,500,900]);

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