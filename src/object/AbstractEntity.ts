import { ArenaComponent, CameraComponent, DropComponent, HealthComponent, MobComponent, PetalComponent, PlayerInfoComponent, PositionComponent, StyleComponent } from "./Components";

export default class AbstractEntity {
    pos: PositionComponent | null = null;
    style: StyleComponent | null = null;
    arena: ArenaComponent | null = null;
    drop: DropComponent | null = null;
    petal: PetalComponent | null = null;
    mob: MobComponent | null = null;
    playerInfo: PlayerInfoComponent | null = null;
    camera: CameraComponent | null = null;
    health: HealthComponent | null = null;
    id = 0;
    state = 2;
    pendingDelete = false;
    isDeleted = false;
    canCollide = false;
    constructor() {}
    tick() {}
    wipeState() {
        if (this.pos) this.pos.reset();
        if (this.style) this.style.reset();
        if (this.arena) this.arena.reset();
        if (this.drop) this.drop.reset();
        if (this.petal) this.petal.reset();
        if (this.mob) this.mob.reset();
        if (this.playerInfo) this.playerInfo.reset();
        if (this.camera) this.camera.reset();
        if (this.health) this.health.reset();
        this.state = 0;
    }
}