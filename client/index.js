console.log("hi");
const ws = new WebSocket(`ws${location.protocol.slice(4)}//${location.host}`);
console.log(ws);
let x = 0, y = 0;
ws.onmessage = async (e) => {
    const packet = new Uint8Array(await e.data.arrayBuffer());
    x = packet[1]; y = packet[2];
}
ws.onopen = () => {
    ws.send(new Uint8Array([0,0]));
} //init
let input = 0;
const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');
const loop = _ => {
    ctx.clearRect(0,0,1920,1080);
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.fillRect(x,y,100,100);
    if (ws.readyState === 1) ws.send(new Uint8Array([1,input]));
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
window.onkeydown = async ({ code }) => {
    switch(code) {
        case "KeyD":
            input |= 1;
            break;
        case "KeyS":
            input |= 2;
            break;
        case "KeyA":
            input |= 4;
            break;
        case "KeyW":
            input |= 8; 
    }
}
window.onkeyup = async ({ code }) => {
    switch(code) {
        case "KeyD":
            input &= ~1;
            break;
        case "KeyS":
            input &= ~2;
            break;
        case "KeyA":
            input &= ~4;
            break;
        case "KeyW":
            input &= ~8; 
    }
}