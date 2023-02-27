const PI_2 = Math.PI * 2;
function drawPortal(portal) {
    if (!portal.CLIENT_RENDER_TICK) portal.CLIENT_RENDER_TICK = 0;
    ctx.scale(30,30);
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.3;
    for (let n = 3; n > 0; n--) {
        ctx.rotate(portal.CLIENT_RENDER_TICK / (30 * n));
        ctx.beginPath();
        ctx.fillRect(-0.5*n,-0.5*n,n,n);
    }
    portal.CLIENT_RENDER_TICK++;
}
function drawDrop(drop) {
    ctx.save();
    ctx.scale(0.8,0.8);
    drawLoadoutPetal(drop.drop.id,drop.drop.rarity,255,0)
    ctx.restore();
}
function drawPetalAsEnt(petal) {
    if (!petal.CLIENT_RENDER_TICK) petal.CLIENT_RENDER_TICK = 0;
    if (petal.petal.id === 6) ctx.rotate(petal.CLIENT_RENDER_TICK / 8);
    else if (petal.petal.id !== 11) ctx.rotate(petal.CLIENT_RENDER_TICK / 40);
    ctx.save();
    drawPetal(petal.petal.id, ctx);
    ctx.restore();
    ++petal.CLIENT_RENDER_TICK;
}
function drawPetal(id, ctx) {
    let path;
    switch(id) {
        case 1: //basic
            ctx.fillStyle = '#cfcfcf';
            ctx.beginPath();
            ctx.arc(0,0,10+1.5,0,PI_2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0,0,10-1.5,0,PI_2);
            ctx.fill();
            break;
        case 2: //light
            ctx.fillStyle = '#cfcfcf';
            ctx.beginPath();
            ctx.arc(0,0,7+1.5,0,PI_2);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0,0,7-1.5,0,PI_2);
            ctx.fill();
            break;
        case 3: //stinger
            ctx.fillStyle = '#333333';
            ctx.strokeStyle = '#292929';
            ctx.lineWidth = 3;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(7,0);
            ctx.lineTo(-3.500000476837158,6.062177658081055);
            ctx.lineTo(-3.4999992847442627,-6.062178134918213);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 4: //rose
            ctx.fillStyle = '#cf78a3';
            ctx.beginPath();
            ctx.arc(0,0,10+1.5,0,PI_2);
            ctx.fill();
            ctx.fillStyle = '#ff94c9';
            ctx.beginPath();
            ctx.arc(0,0,10-1.5,0,PI_2);
            ctx.fill();
            break;
        case 5: //leaf
            ctx.rotate(-1);
            ctx.strokeStyle = '#2e933c';
            ctx.lineWidth = 3;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(-15,0);
            ctx.lineTo(-20,0);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-15,0);
            ctx.bezierCurveTo(-10,-12,5,-12,15,0);
            ctx.bezierCurveTo(5,12,-10,12,-15,0);
            ctx.closePath();
            ctx.fillStyle = '#39b54a';
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-9,0);
            ctx.quadraticCurveTo(0,-1.5,7.5,0);
            ctx.stroke();
            break;
        case 6: //wing
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#cfcfcf';
            ctx.lineWidth = 3;
            ctx.rotate(1);
            ctx.beginPath();
            ctx.arc(0,0,15,-1.5707963267948966,1.5707963267948966,false);
            ctx.quadraticCurveTo(10,0,0,-15);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 7: //antennae
            ctx.fillStyle = '#333333';
            ctx.strokeStyle = '#333333';
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = 3;
            ctx.rotate(-PI_2 / 4);
            ctx.beginPath();
            ctx.moveTo(-10,-5);
            ctx.quadraticCurveTo(5,-10,15,-15);
            ctx.quadraticCurveTo(5,-5,-10,-5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-10,5);
            ctx.quadraticCurveTo(5,10,15,15);
            ctx.quadraticCurveTo(5,5,-10,5);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 8: //rock
            path = new Path2D();
            path.lineTo(3.8414306640625,12.377452850341797);
            path.lineTo(-11.311542510986328,7.916932582855225);
            path.lineTo(-11.461170196533203,-7.836822032928467);
            path.lineTo(4.538298606872559,-13.891617774963379);
            path.lineTo(12.138091087341309,0);
            path.closePath();
            ctx.fillStyle = '#777777';
            ctx.strokeStyle = '#606060';
            ctx.lineWidth = 6;
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.stroke(path);
            ctx.fill(path);
            break;
        case 9: //faster
            ctx.fillStyle = '#cecfa3';
            ctx.beginPath();
            ctx.arc(0,0,8.5,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#feffc9';
            ctx.beginPath();
            ctx.arc(0,0,5.5,0,6.283185307179586,false);
            ctx.fill();
            break;
        case 10: //iris
            ctx.fillStyle = '#a760b1';
            ctx.beginPath();
            ctx.arc(0,0,7.5,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#ce76db';
            ctx.beginPath();
            ctx.arc(0,0,4.5,0,6.283185307179586,false);
            ctx.fill();
            break;
        case 11: //missile
            ctx.fillStyle = '#333333';
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 5;
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(11,0);
            ctx.lineTo(-11,-6);
            ctx.lineTo(-11,6);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
    }
}
function drawPetalAsStatic(id, rarity) {
    if (petalCanvas[(id - 1) * 8 + rarity])  ctx.drawImage(petalCanvas[(id - 1) * 8 + rarity], -30, -30);
    else {
        petalCanvas[(id - 1) * 8 + rarity] = new OffscreenCanvas(60,60);
        const tempCtx = petalCanvas[(id - 1) * 8 + rarity].getContext('2d');
        tempCtx.translate(30,30);
        if (id === 2 && rarity > 0) {
            const repeat = [2,2,3,3,5,5,7][rarity-1];
            for (let n = 0; n < repeat; n++) {
                tempCtx.translate(10,0);
                drawPetal(id, tempCtx);
                tempCtx.translate(-10,0);
                tempCtx.rotate(PI_2 / repeat);
            }
        } else if (id === 3 && rarity > 4) {
            if (rarity === 5) {
                for (let n = 0; n < 3; n++) {
                    tempCtx.translate(10,0);
                    drawPetal(id, tempCtx);
                    tempCtx.translate(-10,0);
                    tempCtx.rotate(PI_2 / 3);
                } 
            } else {
                for (let n = 0; n < 5; n++) {
                    tempCtx.save()
                    tempCtx.translate(10,0);
                    tempCtx.rotate(PI_2 / 2);
                    drawPetal(id, tempCtx);
                    tempCtx.restore();
                    tempCtx.rotate(PI_2 / 5);
                } 
            }
        } else return drawPetal(id, tempCtx);
    }
}
function drawMobAsEnt(mob) {
    if (!mob.CLIENT_RENDER_TICK) mob.CLIENT_RENDER_TICK = 0;
    ctx.save();
    ctx.scale(MOB_SIZE_MULTIPLIER[mob.mob.rarity],MOB_SIZE_MULTIPLIER[mob.mob.rarity]);
    let path, secondaryAngle;
    switch(mob.mob.id) {
        case 1:
            secondaryAngle = Math.sin(mob.CLIENT_RENDER_TICK * 0.1) * 0.05;
            ctx.fillStyle = '#454545';
            ctx.strokeStyle = '#292929';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.rotate(-secondaryAngle);
            ctx.beginPath();
            ctx.moveTo(0,-7);
            ctx.quadraticCurveTo(11,-10,22,-5);
            ctx.stroke();
            ctx.rotate(secondaryAngle*2);
            ctx.beginPath();
            ctx.moveTo(0,7);
            ctx.quadraticCurveTo(11,10,22,5);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0,0,17.5,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#555555';
            ctx.beginPath();
            ctx.arc(0,0,10.5,0,6.283185307179586,false);
            ctx.fill();
            break;
        case 2:
            ctx.fillStyle = '#454545';
            ctx.strokeStyle = '#292929';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(-13.5,0,13.5,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#555555';
            ctx.beginPath();
            ctx.arc(-13.5,0,6.5,0,6.283185307179586,false);
            ctx.fill();
            secondaryAngle = Math.sin(mob.CLIENT_RENDER_TICK * 0.1) * 0.05;
            ctx.fillStyle = '#454545';
            ctx.strokeStyle = '#292929';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.rotate(-secondaryAngle);
            ctx.beginPath();
            ctx.moveTo(0,-7);
            ctx.quadraticCurveTo(11,-10,22,-5);
            ctx.stroke();
            ctx.rotate(secondaryAngle * 2);
            ctx.beginPath();
            ctx.moveTo(0,7);
            ctx.quadraticCurveTo(11,10,22,5);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0,0,17.5,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#555555';
            ctx.beginPath();
            ctx.arc(0,0,10.5,0,6.283185307179586,false);
            ctx.fill();
            break;
        case 3:     
            secondaryAngle = Math.sin(mob.CLIENT_RENDER_TICK * 0.1) * 0.05;
            ctx.fillStyle = '#454545';
            ctx.strokeStyle = '#292929';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.arc(-13.5,0,13.5,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#555555';
            ctx.beginPath();
            ctx.arc(-13.5,0,6.5,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#eeeeee80';
            ctx.beginPath();
            ctx.ellipse(-12.5,-8,15,7,secondaryAngle*4+0.3141592741012573,0,6.283185307179586,false);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(-12.5,8,15,7,-secondaryAngle*4-0.3141592741012573,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#454545';
            ctx.strokeStyle = '#292929';
            ctx.lineWidth = 7;
            ctx.lineCap = 'round';
            ctx.rotate(-secondaryAngle);
            ctx.beginPath();
            ctx.moveTo(0,-7);
            ctx.quadraticCurveTo(11,-10,22,-5);
            ctx.stroke();
            ctx.rotate(secondaryAngle * 2);
            ctx.beginPath();
            ctx.moveTo(0,7);
            ctx.quadraticCurveTo(11,10,22,5);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0,0,17.5,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#555555';
            ctx.beginPath();
            ctx.arc(0,0,10.5,0,6.283185307179586,false);
            ctx.fill();
            break;
        case 4:
            ctx.fillStyle = '#0e0e0e';
            ctx.beginPath();
            ctx.arc(15,0,25.5,0,6.283185307179586,false);
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(15,0,18.5,0,6.283185307179586,false);
            ctx.fill();
            ctx.fillStyle = '#eb4034';
            path = new Path2D();
            path.moveTo(24.760068893432617,16.939273834228516);
            path.quadraticCurveTo(17.74359130859375,27.195226669311523,5.530136585235596,29.485883712768555);
            path.quadraticCurveTo(-6.683317184448242,31.77654457092285,-16.939273834228516,24.760068893432617);
            path.quadraticCurveTo(-27.195226669311523,17.74359130859375,-29.485883712768555,5.530136585235596);
            path.quadraticCurveTo(-31.77654457092285,-6.683317184448242,-24.760068893432617,-16.939273834228516);
            path.quadraticCurveTo(-17.74359130859375,-27.195226669311523,-5.530136585235596,-29.485883712768555);
            path.quadraticCurveTo(6.683317184448242,-31.77654457092285,16.939273834228516,-24.760068893432617);
            path.quadraticCurveTo(19.241104125976562,-23.185302734375,21.213199615478516,-21.213205337524414);
            path.quadraticCurveTo(23.1852970123291,-19.241111755371094,24.76006507873535,-16.939281463623047);
            path.quadraticCurveTo(10,0,24.760068893432617,16.939273834228516);
            path.closePath();
            ctx.fill(path);
            ctx.save();
            ctx.clip(path);
            ctx.fillStyle = '#111111';
            ctx.beginPath();
            ctx.arc(-24.998876571655273,-20.74837875366211,7.209468364715576,0,6.283185307179586,false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(19.580562591552734,23.397785186767578,4.327828407287598,0,6.283185307179586,false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0.7487926483154297,-5.099580764770508,4.840342998504639,0,6.283185307179586,false);
            ctx.fill();
            ctx.restore();
            ctx.fillStyle = '#be342a';
            path = new Path2D();
            path.moveTo(27.64874267578125,18.915523529052734);
            path.quadraticCurveTo(19.813682556152344,30.36800765991211,6.175320625305176,32.925907135009766);
            path.quadraticCurveTo(-7.463029861450195,35.48381042480469,-18.91551971435547,27.648746490478516);
            path.quadraticCurveTo(-30.36800765991211,19.813682556152344,-32.925907135009766,6.175320625305176);
            path.quadraticCurveTo(-35.48381042480469,-7.463029861450195,-27.648746490478516,-18.91551971435547);
            path.quadraticCurveTo(-19.813682556152344,-30.36800765991211,-6.175320625305176,-32.925907135009766);
            path.quadraticCurveTo(7.463029861450195,-35.48381042480469,18.91551971435547,-27.648746490478516);
            path.quadraticCurveTo(24.10110092163086,-24.101102828979492,27.648740768432617,-18.915529251098633);
            path.quadraticCurveTo(28.323867797851562,-17.928699493408203,28.25410270690918,-16.73506736755371);
            path.quadraticCurveTo(28.184337615966797,-15.541434288024902,27.398849487304688,-14.639973640441895);
            path.quadraticCurveTo(14.642288208007812,0,27.398853302001953,14.639965057373047);
            path.quadraticCurveTo(28.184343338012695,15.541427612304688,28.254106521606445,16.735061645507812);
            path.quadraticCurveTo(28.323869705200195,17.928693771362305,27.64874267578125,18.9155216217041);
            path.lineTo(27.64874267578125,18.915523529052734);
            path.closePath();
            path.moveTo(21.871395111083984,14.963025093078613);
            path.lineTo(24.760068893432617,16.939273834228516);
            path.lineTo(22.12128448486328,19.238582611083984);
            path.quadraticCurveTo(5.3577117919921875,0,22.121280670166016,-19.238590240478516);
            path.lineTo(24.76006507873535,-16.939281463623047);
            path.lineTo(21.871389389038086,-14.963033676147461);
            path.quadraticCurveTo(19.065046310424805,-19.0650577545166,14.96302318572998,-21.871395111083984);
            path.quadraticCurveTo(5.903592586517334,-28.06928253173828,-4.884955406188965,-26.045866012573242);
            path.quadraticCurveTo(-15.673511505126953,-24.022449493408203,-21.871395111083984,-14.96302318572998);
            path.quadraticCurveTo(-28.06928253173828,-5.903592586517334,-26.045866012573242,4.884955406188965);
            path.quadraticCurveTo(-24.022449493408203,15.673511505126953,-14.96302318572998,21.871395111083984);
            path.quadraticCurveTo(-5.903592586517334,28.06928253173828,4.884955406188965,26.045866012573242);
            path.quadraticCurveTo(15.673511505126953,24.022449493408203,21.871395111083984,14.963025093078613);
            path.closePath();
            ctx.fill(path);
            break;
        case 5:
            ctx.fillStyle = '#333333';
            ctx.strokeStyle = '#292929';
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.beginPath();
            ctx.moveTo(-37,0);
            ctx.lineTo(-25,-9);
            ctx.lineTo(-25,9);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffe763';
            ctx.beginPath();
            ctx.ellipse(0,0,30,20,0,0,6.283185307179586,false);
            ctx.fill();
            ctx.save();
            ctx.clip();
            ctx.fillStyle = '#333333';
            ctx.fillRect(-30,-20,10,40);
            ctx.fillRect(-10,-20,10,40);
            ctx.fillRect(10,-20,10,40);
            ctx.restore();
            ctx.strokeStyle = '#d3bd46';
            ctx.beginPath();
            ctx.ellipse(0,0,30,20,0,0,6.283185307179586,false);
            ctx.stroke();
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(25,-5);
            ctx.quadraticCurveTo(35,-5,40,-15);
            ctx.stroke();
            ctx.fillStyle = '#333333';
            ctx.beginPath();
            ctx.arc(40,-15,5,0,6.283185307179586,false);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(25,5);
            ctx.quadraticCurveTo(35,5,40,15);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(40,15,5,0,6.283185307179586,false);
            ctx.fill();
            break;
    }
    ctx.restore();
    ++mob.CLIENT_RENDER_TICK;
}
function drawPlayer(player) {
    if (player.playerInfo.faceFlags & 16) {
        ctx.save();
        ctx.translate(0,-35);
        ctx.scale(player.pos.radius*0.05,player.pos.radius*0.05);
        drawPetal(7,ctx);
        ctx.restore();
    }
    ctx.fillStyle = '#cfbb50';
    ctx.beginPath();
    ctx.arc(0,0,player.pos.radius+1.5,0,PI_2);
    ctx.fill();
    ctx.fillStyle = '#ffe763';
    ctx.beginPath();
    ctx.arc(0,0,player.pos.radius-1.5,0,PI_2);
    ctx.fill();
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(0,0,10,0,PI_2);
    ctx.fill();
    ctx.clip();
    ctx.fillStyle = '#ffffff';
    const flags = player.playerInfo.faceFlags & 7;
    player.playerInfo.lerpEyeAngle += 0.2 * (flags - player.playerInfo.lerpEyeAngle);
    ctx.rotate(player.playerInfo.lerpEyeAngle * PI_2 / 8);
    ctx.beginPath();
    ctx.arc(10, 0, 10, 0, PI_2);
    ctx.fill();
    ctx.restore();
}
function drawLoadoutPetal(id, rarity, cd, hp) {
    ctx.fillStyle = getColorByRarity(rarity);
    ctx.strokeStyle = getStroke(ctx.fillStyle);
    ctx.lineWidth = 10;
    ctx.lineJoin = 'round';
    ctx.save();
    ctx.beginPath();
    ctx.rect(-30,-30,60,60);
    ctx.stroke();
    ctx.fill();
    ctx.clip();
    ctx.fillStyle = '#00000040';
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.arc(0,0,50, -PI_2 / 4 + 6 * cd * PI_2 / 255, -PI_2 / 4 + 5 * cd * PI_2 / 255);
    ctx.closePath();
    ctx.fill();
    if (hp) {
        ctx.beginPath();
        ctx.fillRect(-30,-30,60,60*(1-hp/255));
    }
    ctx.restore();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.font = '1px Ubuntu';
    const name = PETAL_NAMES[id - 1];
    const { width } = ctx.measureText(name);
    ctx.font = `${Math.min(50 / width, 15)}px Ubuntu`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.strokeText(name, 0, 25);
    ctx.fillText(name, 0, 25);
    ctx.translate(0,-5);
    drawPetalAsStatic(id,rarity);
}