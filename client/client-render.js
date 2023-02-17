class LoadoutEntity {
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
        this.CLIENT_RENDER_TICK = 0;
    }
    set(x, y) {
        this.targetX = x;
        this.targetY = y;
        this.baseX = x;
        this.baseY = y;
    }
    tick() {
        ++this.CLIENT_RENDER_TICK;
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
        const dx = e.clientX - clientSimulation.inventory.x * staticScale;
        const dy = e.clientY - (canvas.height/devicePixelRatio + clientSimulation.inventory.y * staticScale);
        if (dy < 0 || dy > 600) return;
        if (dx < 0 || dx > 360) return;
        delete clientSimulation.loadout[this.id];
        ws.send(new Uint8Array([2,this.id,0,0]));   
    }
}
class Container extends LoadoutEntity {
    selected = false;
    hover = false;
    constructor(x, y, pId, pRar, id) {
       super(x, y, id);
       this.id = pId;
       this.rarity = pRar;
    }
    initCanvas(w, h) {
        this.canvas = new OffscreenCanvas(w, h);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.lineCap = 'round';
    }
    change() {
        this.targetY = this.baseY - this.targetY;
    }
}
const GET_ROW_COL = (obX, obY, obW, obH, x, y) => {
    return [(x - obX) / obW, (y - obY) / obH];
}
let clientSimulation = {
    loadout: {},
    inventoryLayout: [],
    inventory: {},
    selected: null,
    pendingEquip: new LoadoutEntity(0,0,0,0,'fefifofum')
};
clientSimulation.pendingEquip.onmouseup = function(e) {
    this.selected = false;
    this.x = this.targetX = this.baseX;
    this.y = this.targetY = this.baseY;
    clientSimulation.selected = null;
    const { id, rarity } = this;
    this.id = 0;
    this.rarity = 0;
    if (!entities.camera) return;
    if (!entities[entities.camera]) return;
    const playerEnt = entities[entities[entities.camera].camera.player];
    if (!playerEnt) return;
    const numEquipped = playerEnt.playerInfo.numEquipped;
    if (Math.abs(e.clientY - (canvas.height/devicePixelRatio - 80 * staticScale)) > 30 * staticScale) return;
    const pos = (e.clientX - (canvas.width/(2*devicePixelRatio) - numEquipped * 40 * staticScale)) / 80 / staticScale;
    ws.send(new Uint8Array([2,pos,id,rarity]));  
}
clientSimulation.pendingEquip.onmousedown = function(e) {
    this.selected = true;
    this.x = this.targetX = e.clientX;
    this.y = this.targetY = e.clientY;
    clientSimulation.selected = this;
    //getAdjustedInv();
}