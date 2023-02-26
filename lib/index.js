"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const fs = __importStar(require("fs"));
const Server_1 = __importDefault(require("./game/Server"));
const PORT = 1025;
const server = http.createServer((req, res) => {
    let file = null;
    let contentType = "text/html";
    switch (req.url) {
        case "/":
            file = "./client/index.html";
            contentType = "text/html";
            break;
        case "/index.js":
            file = "./client/index.js";
            contentType = "application/javascript";
            break;
        case "/input.js":
            file = "./client/input.js";
            contentType = "application/javascript";
            break;
        case "/client-render.js":
            file = "./client/client-render.js";
            contentType = "application/javascript";
            break;
        case "/canvas-helpers.js":
            file = "./client/canvas-helpers.js";
            contentType = "application/javascript";
            break;
        case "/websocket.js":
            file = "./client/websocket.js";
            contentType = "application/javascript";
            break;
        case "/fonts.css":
            file = "./client/fonts.css";
            contentType = "text/css";
            break;
    }
    res.setHeader("Content-Type", contentType + "; charset=utf-8");
    if (file && fs.existsSync(file)) {
        res.writeHead(200);
        return res.end(fs.readFileSync(file));
    }
    res.writeHead(404);
});
server.listen(PORT);
const Socket = new WebSocket.Server({ server });
new Server_1.default(Socket);
console.log("[Server is running]");
