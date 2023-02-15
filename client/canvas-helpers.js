function getStroke(color, black = 0.75) {
    return "#" +
    (Math.min(parseInt(color.slice(1,3), 16) * black | 0, 255)).toString(16).padStart(2, '0') + 
    (Math.min(parseInt(color.slice(3,5), 16) * black | 0, 255)).toString(16).padStart(2, '0') + 
    (Math.min(parseInt(color.slice(5,7), 16) * black | 0, 255)).toString(16).padStart(2, '0');
}
function getColorByRarity(rarity) {
    if (rarity === 0) return '#0edb32';
    if (rarity === 1) return '#f2e338';
    if (rarity === 2) return '#3c41e6';
    if (rarity === 3) return '#a420e6';
    else return '#999999';
}
function getNameByRarity(rarity) {
    if (rarity === 0) return 'Common';
    if (rarity === 1) return 'Unusual';
    if (rarity === 2) return 'Rare';
    if (rarity === 3) return 'Epic';
    else return 'Legendary';
}
function drawPlayer(player) {
    ctx.fillStyle = '#ddbb22';
    ctx.strokeStyle = getStroke(ctx.fillStyle);
    ctx.lineWidth = 1/5;
    ctx.beginPath();
    ctx.arc(0,0,1,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
}
function drawDrop(drop) {
    ctx.fillStyle = getColorByRarity(drop.drop.rarity);
    ctx.strokeStyle = getStroke(ctx.fillStyle);
    ctx.lineWidth = 1/5;
    ctx.beginPath();
    ctx.rect(-0.5,-0.5,1,1);
    ctx.stroke();
    ctx.fill();
    drawPetalAsStatic(drop.drop.id,drop.drop.rarity, ctx);
}
function drawPetalAsEnt(petal) {
    if (!petal.CLIENT_RENDER_TICK) petal.CLIENT_RENDER_TICK = 0;
    ctx.rotate(petal.CLIENT_RENDER_TICK / 500);
    petal.CLIENT_RENDER_TICK++;
    switch(petal.petal.id) {
        case 1:
        case 2:
            ctx.fillStyle = '#eeeeee';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/6;
            ctx.beginPath();
            ctx.arc(0,0,1,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();
            break;
        case 3:
            ctx.fillStyle = '#222222';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/6;
            ctx.beginPath();
            ctx.moveTo(1, 0);
            ctx.lineTo(-0.5, 0.8660254037);
            ctx.lineTo(-0.5,-0.8660254037);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            break;
        case 4:
            ctx.fillStyle = '#eeaaaa';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/6;
            ctx.beginPath();
            ctx.arc(0,0,1,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();
            break;
    }
}
function drawPetalAsStatic(id, rarity, ctx) {
    switch(id) {
        case 1:
            ctx.fillStyle = '#eeeeee';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/6;
            ctx.beginPath();
            ctx.arc(0,0,0.25,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();
            break;
        case 2:
            ctx.fillStyle = '#eeeeee';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/6;
            ctx.beginPath();
            ctx.arc(0,0,0.125,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();
            break;
        case 3:
            ctx.fillStyle = '#222222';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/6;
            ctx.beginPath();
            ctx.moveTo(0.1, 0);
            ctx.lineTo(-0.05, 0.08660254037);
            ctx.lineTo(-0.05,-0.08660254037);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            break;
        case 4:
            ctx.fillStyle = '#eeaaaa';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/6;
            ctx.beginPath();
            ctx.arc(0,0,0.25,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();
            break;
    }
}
function drawMobAsEnt(mob) {
    if (!mob.CLIENT_RENDER_TICK) mob.CLIENT_RENDER_TICK = 0;
    mob.CLIENT_RENDER_TICK++;
    drawMob(mob.mob.id, mob.CLIENT_RENDER_TICK);
}
function drawMob(id, clientRenderTick) {
    let path;
    switch (id) {
        case 0:
            const secondaryAngle = Math.sin(clientRenderTick / 14) / 10;
            ctx.fillStyle = '#334433';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1 / 8;
            path = new Path2D(MOBSVG[0][0]);
            ctx.beginPath();
            ctx.fill(path);
            ctx.stroke(path);
            ctx.fillStyle = '#22bbdd33';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.translate(0.9,-0.1);
            ctx.rotate(secondaryAngle);
            path = new Path2D(MOBSVG[0][1]);
            ctx.beginPath();
            ctx.fill(path);
            ctx.stroke(path);
            ctx.rotate(-2 * secondaryAngle);
            ctx.translate(0,0.2);
            path = new Path2D(MOBSVG[0][2]);
            ctx.beginPath();
            ctx.fill(path);
            ctx.stroke(path);
            break;
        case 1:
            ctx.fillStyle = '#000000';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1 / 8;
            path = new Path2D(MOBSVG[1][1]);
            ctx.beginPath();
            ctx.stroke(path);
            ctx.fill(path);
            ctx.fillStyle = '#662266';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1 / 8;
            path = new Path2D(MOBSVG[1][0]);
            ctx.beginPath();
            ctx.stroke(path);
            ctx.fill(path);
            break;
    }
}
const MOBSVG = [
    ['M1.1 0A.8.3 0 01-.5 0 .8.3 0 011.1 0','M-0 0Q-1.2-1.2-1.8-.6-1.2 0-0 0','M-0 0Q-1.2 1.2-1.8.6-1.2 0-0 0'],
    ['M.8 0A.8.4 0 01-.8 0 .8.4 0 01.8 0','M1.2.4Q.8 0 .4 0 .8 0 1.2-.4L.4 0 1.2.4']
]