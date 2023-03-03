"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = __importDefault(require("../object/Client"));
const Arena_1 = __importDefault(require("./Arena"));
class GameServer {
    constructor(server) {
        this.tick = 0;
        this.wss = server;
        this.clients = new Set();
        this.maps = [
            new Arena_1.default(this, 3000, 3000, 0, 'Spawn'),
            new Arena_1.default(this, 3000, 3000, 1, 'Easy Garden'),
            new Arena_1.default(this, 3000, 3000, 2, 'Medium Garden')
        ];
        this.maps[0].setZones([{
                x: 0, y: 0, w: 3000, h: 3000,
                spawnTable: {
                    MOB_CAP: 10,
                    BASE_CHANCE: 0.3,
                    MOB_CHANCE: {
                        1: 0.2, 2: 0.2, 3: 0.2, 4: 0.2, 5: 0.2,
                    },
                    RARITY_CHANCE: [0.3, 0.2, 0.15, 0.1, 0.1, 0.05, 0.05, 0.05]
                }
            }]);
        setInterval(() => {
            for (const map of this.maps)
                if (map.clients.size)
                    map.tick();
            ++this.tick;
        }, 40);
        this.wss.on("connection", (ws) => this.add(ws));
    }
    add(ws) {
        this.clients.add(new Client_1.default(this, ws));
    }
    remove(client) {
        this.clients.delete(client);
    }
}
exports.default = GameServer;
