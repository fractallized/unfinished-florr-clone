import Player from "./player/Player";
import Reader from "../coder/Reader";
import Writer from "../coder/Writer";
import { compileEnt, compileInventory } from "../coder/PacketMaker";
import { CameraComponent, Inventory } from "./Components";
import Arena from "../game/Arena.js";
import Vector, { VectorLike } from "./Vector";
import GameServer from "../game/Server.js";
import Entity from "./Entity";
import AbstractEntity from "./AbstractEntity";

export default class Client extends AbstractEntity {
    static BASE_FOV = 1;
    state = 2;
    enteredPortalTick = -100;
    view: Set<Entity> = new Set();
    numEquipped = 10;
    server: GameServer;
    _arena: Arena | null = null;
    player: Player | null = null;
    ws: WebSocket;
    map = 0;
    input = new Input(0,0);
    camera: CameraComponent;

    equipped = new Uint8Array(40);
    inventory = new Inventory();
    addedToArena = false;
    id = 0;
    
    constructor(server: GameServer, ws: WebSocket) {
        super();
        this.camera = new CameraComponent(this,0,0,Client.BASE_FOV,-1);
        this.server = server;
        this.ws = ws;

        this.inventory.add((11 - 1) * 8 + 7, 10);
        this.inventory.add((3 - 1) * 8 + 7, 1);
        this.inventory.add((7 - 1) * 8 + 7, 1);
        this.inventory.add((9 - 1) * 8 + 7, 1);
        for (let n = 0; n < 10; ++n) this.setPetal(n, 11, 7);
        this.ws.onmessage = (req: any) => this.onmessage(req);
        this.ws.onclose = () => {
            console.log("client left")
            this.server.remove(this);
            if (this._arena instanceof Arena) {
                this._arena.removeClient(this);
                if (this.player instanceof Player) {
                    this._arena.remove(this.player);
                    this.player = null;
                }
            }
        }
    }
    setPetal(pos: number, id: number, rarity: number) {
        if (this.equipped[pos * 2] === id && this.equipped[pos * 2 + 1] === rarity) return;
        this.equipped[pos * 2] = 0;
        this.equipped[pos * 2 + 1] = 0;
        if (!id) return this.player && this.player.changePetal(pos, id, rarity);
        let sameCt = 0;
        for (let n = 0; n < 40; n += 2) if (this.equipped[n] === id && this.equipped[n + 1] === rarity) ++sameCt;
        if (sameCt >= this.inventory.get((id - 1) * 8 + rarity)) return; //check if client has enough
        this.equipped[pos * 2] = id;
        this.equipped[pos * 2 + 1] = rarity;
        this.player && this.player.changePetal(pos, id, rarity);
    }
    swapPetals(pos1: number, pos2: number) {
        //no need for petal count validation
        if (pos1 === pos2) return; //no need to swap lol
        const [i1, r1] = this.equipped.slice(pos1 * 2, pos1 * 2 + 2);
        const [i2, r2] = this.equipped.slice(pos2 * 2, pos2 * 2 + 2);
        if (this.player) {
            this.player.changePetal(pos1, i2, r2);
            this.player.changePetal(pos2, i1, r1);
        } 
    }
    tick() {
        if (this.camera) {
            if (this.player && this.player.pos) this.camera.set(this.player.pos.x, this.player.pos.y);
            if (!this._arena) return;
            const p = new Writer();
            const inView = this._arena.collisionGrid.getCollisions(this.camera.x, this.camera.y, 1000 / this.camera.fov, 600 / this.camera.fov);
            const creates = [], updates = [], deletes = [];
            for (const entity of this.view) {
                if (inView.indexOf(entity) === -1) {
                    this.view.delete(entity);
                    deletes.push(entity);
                }
            }
            for (const entity of inView) {
                if (!this.view.has(entity)) creates.push(entity);
                else updates.push(entity);
                this.view.add(entity);
            }
            p.u8(1);
            for (const ent of deletes) p.vu(ent.id);
            p.vu(0);
            compileEnt(p, this._arena, this.state, this);
            compileEnt(p, this, this.state, this);
            for (const entity of creates) compileEnt(p, entity, 2, this);
            for (const entity of updates) compileEnt(p, entity, this.state, this);
            p.vu(0);
            compileInventory(p, this.inventory);
            this.ws.send(p.write());
            this.inventory.reset();
        }
        this.wipeState();
    }
    moveServer(num: number, x: number, y: number) {
        if (this._arena instanceof Arena) {
            this._arena.removeClient(this);
            if (this.player instanceof Player) this.player.delete();
        }
        console.log("spawn");
        this.map = num;
        this._arena = this.server.maps[this.map];
        this.player = new Player(this._arena, x, y, 25, this); //client spawned, give it a player
        this._arena.addClient(this); //add the camera
        this.addedToArena = true;
        this._arena.add(this.player); //add the player of the camera
        this.camera.player = this.player.id;
        this.enteredPortalTick = this._arena._tick; //prevent ping ponging petween portals
        this.ws.send(new Uint8Array([254]));
        this.state = 2;
    }
    findSpawn() {
        for (let n = 0; n < 10; n++) {
            const potentialX = Math.random() * 1000 + 1000;
            const potentialY = Math.random() * 1000 + 1000;
            if (this._arena?.collisionGrid.getCollisions(potentialX, potentialY, 25, 25).length) continue;
            return this.moveServer(0, potentialX, potentialY);
        }
        return this.moveServer(0, 1500, 1500);
    }
    onmessage(req: any) {
        const reader = new Reader(new Uint8Array(req.data));
        switch(reader.u8()) {
            case 0:
                if (this.player) break;
                this.findSpawn();
                break;
            case 1:
                this.input.input = reader.u8();
                break;
            case 2:
                if (!this.player) return;
                this.setPetal(reader.u8(), reader.u8(), reader.u8());
                break;
            case 3:
                if (!this.player) return;
                this.swapPetals(reader.u8(), reader.u8())
        }
    }
}

export class Input extends Vector {
    targetX: number;
    targetY: number;
    input = 0
    constructor(x: number, y: number) {
        super(x, y);
        this.targetX = x;
        this.targetY = y;
    }
    setTarget(v: VectorLike) {
        this.targetX = v.x;
        this.targetY = v.y;
    }
    tick() {
        this.x += 0.1 * (this.targetX - this.x);
        this.y += 0.1 * (this.targetY - this.y);
    }
}