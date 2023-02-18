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
    if (rarity === 4) return '#b31214';
    if (rarity === 5) return '#1ee7e4';
    if (rarity === 6) return '#f7147e';
    if (rarity === 7) return '#21cd8a';
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
function drawPortal(portal) {
    if (!portal.CLIENT_RENDER_TICK) portal.CLIENT_RENDER_TICK = 0;
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.3;
    for (let n = 3; n > 0; n--) {
        ctx.rotate(portal.CLIENT_RENDER_TICK / (30 * n));
        ctx.beginPath();
        ctx.fillRect(-0.5*n,-0.5*n,n,n);
    }
    portal.CLIENT_RENDER_TICK++;
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
    ctx.translate(0,-0.1);
    drawPetalAsStatic(drop.drop.id,drop.drop.rarity, ctx);
    ctx.scale(0.02,0.02);
    ctx.font = '10px Ubuntu';
    ctx.textAlign = 'center';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.beginPath();
    ctx.strokeText(`${PETAL_NAMES[drop.drop.id - 1] || 'hi'}`, 0, 25);
    ctx.fillText(`${PETAL_NAMES[drop.drop.id - 1] || 'hi'}`, 0, 25);
}
function drawPetalAsEnt(petal) {
    if (!petal.CLIENT_RENDER_TICK) petal.CLIENT_RENDER_TICK = Math.random() * 400 * Math.PI;
    ctx.rotate(petal.CLIENT_RENDER_TICK / 200);
    petal.CLIENT_RENDER_TICK++;
    let path;
    switch(petal.petal.id) {
        case 1:
            ctx.fillStyle = '#eeeeee';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/6;
            ctx.beginPath();
            ctx.arc(0,0,1,0,2*Math.PI);
            ctx.stroke();
            ctx.fill();
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
        case 5:
            ctx.fillStyle = '#17c821'
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/6;
            path = new Path2D('M-1 1-.5.5Q-1-1 1-1 1 1-.5.5');
            ctx.beginPath();
            ctx.stroke(path);
            ctx.fill(path);
            ctx.stroke(new Path2D('M-.3.3Q0-.5.8-.8'));
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
            if (rarity === 0) {
                ctx.fillStyle = '#eeeeee';
                ctx.strokeStyle = getStroke(ctx.fillStyle);
                ctx.lineWidth = 1/6;
                ctx.beginPath();
                ctx.arc(0,0,0.125,0,2*Math.PI);
                ctx.stroke();
                ctx.fill();
                break;
            }
            count = [1,2,2,3,3,5,5,7][rarity];
            for (let n = 0; n < count; n++) {
                const angle = n / count * 2 * Math.PI;
                ctx.fillStyle = '#eeeeee';
                ctx.strokeStyle = getStroke(ctx.fillStyle);
                ctx.lineWidth = 1/6;
                ctx.beginPath();
                ctx.arc(Math.cos(angle)/4,Math.sin(angle)/4,0.125,0,2*Math.PI);
                ctx.stroke();
                ctx.fill();
            }
            break;
        case 3:
            ctx.fillStyle = '#222222';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/8;
            if (rarity < 4) {
                ctx.beginPath();
                ctx.moveTo(0.05, 0);
                ctx.lineTo(-0.025, 0.043301270189);
                ctx.lineTo(-0.025,-0.043301270189);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
            } else if (rarity === 4) {
                for (let n = 0; n < 3; n++) {
                    ctx.beginPath();
                    ctx.moveTo(0.25, 0);
                    ctx.lineTo(0.175, 0.043301270189);
                    ctx.lineTo(0.175,-0.043301270189);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill();
                    ctx.rotate(2 * Math.PI / 3);
                }
            } else {
                for (let n = 0; n < 5; n++) {
                    ctx.beginPath();
                    ctx.moveTo(0.15, 0);
                    ctx.lineTo(0.225, 0.043301270189);
                    ctx.lineTo(0.225,-0.043301270189);
                    ctx.closePath();
                    ctx.stroke();
                    ctx.fill();
                    ctx.rotate(2 * Math.PI / 5);
                }
            }
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
        case 5:
            ctx.fillStyle = '#17c821'
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 1/12;
            path = new Path2D('M-.25.25-.125.125Q-.25-.25.25-.25.25.25-.125.125');
            ctx.beginPath();
            ctx.stroke(path);
            ctx.fill(path);
            ctx.lineWidth = 1/24;
            ctx.stroke(new Path2D('M-.075.075Q0-.125.2-.2'));
    }
}
function drawMobAsEnt(mob) {
    if (!mob.CLIENT_RENDER_TICK) mob.CLIENT_RENDER_TICK = 0;
    mob.CLIENT_RENDER_TICK++;
    drawMob(mob.mob.id, mob.CLIENT_RENDER_TICK);
}
function drawMob(id, clientRenderTick) {
    let path, secondaryAngle;
    switch (id) {
        case 1:
            secondaryAngle = Math.sin(clientRenderTick / 6) / 10;
            ctx.fillStyle = '#666666';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.ellipse(0.7,0.3,0.5,0.1,secondaryAngle,0.2,3);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0.7,-0.3,0.5,0.1,-secondaryAngle,-3,-0.2);
            ctx.stroke();
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.arc(0,0,0.75,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
            break;
        case 2:
            secondaryAngle = Math.sin(clientRenderTick / 6) / 10;
            ctx.fillStyle = '#666666';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.ellipse(1.1,0.3,0.5,0.1,secondaryAngle,0.2,3);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(1.1,-0.3,0.5,0.1,-secondaryAngle,-3,-0.2);
            ctx.stroke();
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.arc(-0.4,0,0.6,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0.4,0,0.75,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
            break;
        case 3:
            secondaryAngle = Math.sin(clientRenderTick / 6) / 10;
            ctx.fillStyle = '#666666';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.ellipse(1.1,0.3,0.5,0.1,secondaryAngle,0.2,3);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(1.1,-0.3,0.5,0.1,-secondaryAngle,-3,-0.2);
            ctx.stroke();
            ctx.lineWidth = 0.4;
            ctx.beginPath();
            ctx.arc(-0.4,0,0.6,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
            ctx.translate(0.4,0);
            secondaryAngle = Math.sin(clientRenderTick / 7) / 10;
            ctx.fillStyle = '#aaaaaa80';
            ctx.rotate(secondaryAngle + 0.5);
            ctx.beginPath();
            ctx.ellipse(-0.5,0,1,0.5,0,0,2*Math.PI);
            ctx.fill();
            ctx.rotate(-2 * (secondaryAngle + 0.5));
            ctx.beginPath();
            ctx.ellipse(-0.5,0,1,0.5,0,0,2*Math.PI);
            ctx.fill();
            ctx.fillStyle = '#666666';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.beginPath();
            ctx.arc(0,0,0.75,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
            break;
        case 4:
            ctx.strokeStyle = '#f71414';
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.arc(0,0,0.9,0.6,-0.6);
            ctx.stroke();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(0.55,0,0.5,0,2*Math.PI);
            ctx.fill();
            ctx.fillStyle = getStroke(ctx.strokeStyle);
            ctx.beginPath();
            ctx.arc(0,0,0.9,0,2*Math.PI);
            ctx.fill();
            break;
        case 5:
            ctx.save();
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(-1,-0.4);
            ctx.lineTo(-1.8,0);
            ctx.lineTo(-1,0.4);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = '#f3e715';
            ctx.strokeStyle = getStroke(ctx.fillStyle);
            ctx.lineWidth = 0.3;
            path = new Path2D();
            path.ellipse(0,0,1.2,0.8,0,0,2*Math.PI);
            ctx.stroke(path);
            ctx.lineWidth = 0.15;
            ctx.strokeStyle = '#000000';
            ctx.beginPath();
            ctx.ellipse(0.8,0.5,0.8,0.3,0,-Math.PI/2,0);
            ctx.stroke();
            ctx.beginPath();
            ctx.ellipse(0.8,-0.5,0.8,0.3,0,0,Math.PI/2);
            ctx.stroke();
            ctx.fill(path);
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.arc(1.6,0.5,0.2,0,2*Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(1.6,-0.5,0.2,0,2*Math.PI);
            ctx.fill();
            ctx.clip(path);
            ctx.beginPath();
            ctx.fillRect(-0.7,-1,0.4,2);
            ctx.beginPath();
            ctx.fillRect(0.1,-1,0.4,2);
            ctx.restore();
            break;
    }
}
const PETAL_NAMES = ['Basic','Light','Stinger','Rose','Leaf'];
const MOB_NAMES = ['Baby Ant','Worker Ant','Soldier Ant','Ladybug','Bee']