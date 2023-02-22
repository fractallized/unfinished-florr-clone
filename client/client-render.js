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
const PETAL_NAMES = 
['Basic','Light','Stinger','Rose','Leaf','Wing','Antennae',
'Rock','Faster','Iris'];
const MOB_NAMES = ['Baby Ant','Worker Ant','Soldier Ant','Ladybug','Bee'];
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