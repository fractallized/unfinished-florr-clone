const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');
//creates arena grid pattern
const patternCanvas = new OffscreenCanvas(100,100);
const pCtx = patternCanvas.getContext('2d');
pCtx.fillStyle = '#0da333';
pCtx.strokeStyle = '#000000';
pCtx.lineWidth = 0.5;
pCtx.rect(0,0,100,100);
pCtx.fill();
pCtx.stroke();
const arenaPattern = ctx.createPattern(patternCanvas, 'repeat');
const loadoutPatternCanvas = new OffscreenCanvas(800,80);
const eCtx = loadoutPatternCanvas.getContext('2d');
eCtx.fillStyle = '#ffffff';
eCtx.strokeStyle = '#cfcfcf';
eCtx.lineCap = 'round';
eCtx.lineJoin = 'round';
eCtx.lineWidth = 10;
eCtx.beginPath();
eCtx.rect(10, 10, 60, 60);
eCtx.stroke();
eCtx.fill();
const petalCanvas = new Array(100).fill(null);
const PETAL_NAMES = 
['Basic','Light','Stinger','Rose','Leaf','Wing','Antennae',
'Rock','Faster','Iris','Missile'];
const MOB_NAMES = ['Baby Ant','Worker Ant','Soldier Ant','Ladybug','Bee'];
const MOB_SIZE_MULTIPLIER = [1, 1.2, 1.5, 2, 3, 4, 6, 10];
const angleLerp = (curr, target, pct) => {
    if (Math.abs(curr - target) > PI_2 / 2) {
        if (target > curr) curr += PI_2;
        else target += PI_2;
    }
    curr = curr * (1 - pct) + target * pct;
    if (curr > PI_2 / 2) curr -= PI_2;
    return curr;
}
function getStroke(color, black = 0.64) {
    return "#" +
    (Math.min(Math.round(parseInt(color.slice(1,3), 16) * black), 255)).toString(16).padStart(2, '0') + 
    (Math.min(Math.round(parseInt(color.slice(3,5), 16) * black), 255)).toString(16).padStart(2, '0') + 
    (Math.min(Math.round(parseInt(color.slice(5,7), 16) * black), 255)).toString(16).padStart(2, '0');
}
function getColorByRarity(rarity) {
    if (rarity === 0) return '#7eef6d';
    if (rarity === 1) return '#ffe65d';
    if (rarity === 2) return '#4d52e3';
    if (rarity === 3) return '#861fde';
    if (rarity === 4) return '#de1f1f';
    if (rarity === 5) return '#1fdbde';
    if (rarity === 6) return '#ff2b75';
    if (rarity === 7) return '#2bffa3';
    else return '#999999';
}
function getNameByRarity(rarity) {
    if (rarity === 0) return 'Common';
    if (rarity === 1) return 'Unusual';
    if (rarity === 2) return 'Rare';
    if (rarity === 3) return 'Epic';
    if (rarity === 4) return 'Legendary';
    if (rarity === 5) return 'Mythic';
    if (rarity === 6) return 'Ultra';
    if (rarity === 7) return 'Super';
    else return '???';
}
class LoadoutPetal {
    selected = false;
    squareRadius = 0;
    cd = 255;
    hp = 0;
    constructor(pos) {
        this.pos = pos;
        this.id = 0;
        this.rarity = 0;
        this.x = this.targetX = this.baseX = 0;
        this.y = this.targetY = this.baseY = 0;
    }
    tick() {
        if (!this.selected) {
            this.targetX = this.baseX;
            this.targetY = this.baseY;
        }
        this.x += 0.2 * (this.targetX - this.x);
        this.y += 0.2 * (this.targetY - this.y);
    }
    onmousedown(e) {
        this.selected = true;
        this.targetX = e.clientX;
        this.targetY = e.clientY;
        CLIENT_RENDER.selected = this;
    }
    onmousemove(e) {
        this.targetX = e.clientX;
        this.targetY = e.clientY; 
    }
    onmouseup(e) {
        this.selected = false;
        this.targetX = this.baseX;
        this.targetY = this.baseY;
        CLIENT_RENDER.selected = null;
        if (ws.readyState === 1) {
            let swap = null;
            for (const ent of CLIENT_RENDER.loadout) {
                if (Math.abs(ent.baseX - e.clientX) > ent.squareRadius) continue;
                if (Math.abs(ent.baseY - e.clientY) > ent.squareRadius) continue;
                swap = ent;
                break;
            }
            if (swap) {
                ws.send(new Uint8Array([3,this.pos,swap.pos]));
            }
            else ws.send(new Uint8Array([2,this.pos,0,0]));
        }
    }
    draw() {
        ctx.setTransform(this.squareRadius/30,0,0,this.squareRadius/30,this.x,this.y);
        ctx.save();
        drawLoadoutPetal(this.id,this.rarity,this.cd,this.hp);
        ctx.restore();
    }
}
class IntermediatePetal extends LoadoutPetal {
    constructor(pos,id,rarity,x,y) {
        super(pos);
        this.id = id;
        this.rarity = rarity;
        this.x = this.targetX = this.baseX = x;
        this.y = this.targetY = this.baseY = y;
        this.selected = true;
    }
    onmouseup(e) {
        this.selected = false;
        this.targetX = this.baseX;
        this.targetY = this.baseY;
        CLIENT_RENDER.selected = null;
        if (ws.readyState === 1) {
            let swap = null;
            for (const ent of CLIENT_RENDER.loadout) {
                if (Math.abs(ent.baseX - e.clientX) > ent.squareRadius) continue;
                if (Math.abs(ent.baseY - e.clientY) > ent.squareRadius) continue;
                swap = ent;
                break;
            }
            if (swap) {
                ws.send(new Uint8Array([2,swap.pos,this.id,this.rarity]));
            }
        }
    }
    draw() {
        super.draw(255,0);
    }
    tick() {
        this.squareRadius = 30 * staticScale;
        super.tick();
    }
}
class InventoryPetal extends LoadoutPetal {
    count = 0;
    constructor(pos) {
        super(pos);
        this.id = (pos >>> 3) + 1;
        this.rarity = pos & 7;
        this.x = this.targetX = this.baseX = 80;
        this.y = this.targetY = this.baseY = 80;
    }
    onmousedown(){
        CLIENT_RENDER.selected = new IntermediatePetal(this.pos,this.id,this.rarity,this.x,this.y);
    }
    onmousemove(){}
    onmouseup() {}
    draw() {
        super.draw();
        if (this.count === 1) return;
        ctx.translate(20,-20);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#000000';
        ctx.font = '15px Ubuntu';
        ctx.textAlign = 'center';
        ctx.lineWidth = 3;
        ctx.rotate(0.5);
        ctx.beginPath();
        ctx.strokeText(`x${this.count}`, 0, 0)
        ctx.fillText(`x${this.count}`, 0, 0)
    }
}
const CLIENT_RENDER = {
    loadout: new Array(20).fill(0).map((_,i) => new LoadoutPetal(i)),
    inventory: new Array(100).fill(0).map((_,i) => new InventoryPetal(i)),
    selected: null
};