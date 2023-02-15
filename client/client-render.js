let clientSimulation = {
    loadout: {},
    inventoryLayout: {}, //initialized elsewhere
    inventory: {},
    selected: null
};
class ClientEntity {
    selected = false;
    hover = false;
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.targetX = x;
        this.targetY = y;
        this.baseX = x;
        this.baseY = y;
        this.id = id;
    }
    set(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.baseX = x;
        this.baseY = y;
    }
    initCanvas(w, h) {
        this.canvas = new OffscreenCanvas(w, h);
        this.ctx = this.canvas.getContext('2d');
    }
    tick() {
        this.x += 0.2 * (this.targetX - this.x);
        this.y += 0.2 * (this.targetY - this.y);
    }
    onmousedown(e) {
        this.selected = true;
        this.targetX = e.clientX;
        this.targetY = e.clientY;
        clientSimulation.selected = this;
    }
    onmousemove(e) {
        this.targetX = e.clientX;
        this.targetY = e.clientY;
    }
    onmouseup(e) {
        this.selected = false;
        this.targetX = this.baseX;
        this.targetY = this.baseY;
        clientSimulation.selected = null;
        if (Math.abs(canvas.height/devicePixelRatio - 260 * staticScale - e.clientY) / staticScale > 240) return;
        if (Math.abs(170 * staticScale - e.clientX) / staticScale > 120) return;
        delete clientSimulation.loadout[this.id];
        ws.send(new Uint8Array([2,this.id,0,0]));   
    }
}