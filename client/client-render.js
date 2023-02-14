let clientSimulation = {
    loadout: {},
    inventory: {},
    selected: null
};
class ClientEntity {
    selected = false;
    hover = false;
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.baseX = x;
        this.baseY = y;
    }
    set(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.baseX = x;
        this.baseY = y;
    }
    tick() {
        this.x += 0.2 * (this.targetX - this.x);
        this.y += 0.2 * (this.targetY - this.y);
    }
}