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
const HTTP = __importStar(require("http"));
const WebSocket = __importStar(require("ws"));
const fs = __importStar(require("fs"));
const express = require("express");
const Server_1 = __importDefault(require("./game/Server"));
const PORT = 1025;
class Server {
    constructor() {
        this.app = express();
    }
    addGetReq(path, file, type) {
        this.app.get(path, (_, res) => {
            res.setHeader("Content-Type", `${type}; charset=utf-8`);
            if (file && fs.existsSync(file)) {
                res.writeHead(200);
                return res.end(fs.readFileSync(file));
            }
            res.writeHead(404);
        });
        return this;
    }
}
const _server = new Server()
    .addGetReq("/", "client/index.html", "text/html")
    .addGetReq("/fonts.css", "client/fonts.css", "text/css")
    .addGetReq("/index.js", "client/index.js", "application/javascript")
    .addGetReq("/input.js", "client/input.js", "application/javascript")
    .addGetReq("/canvas-helpers.js", "client/canvas-helpers.js", "application/javascript")
    .addGetReq("/client-render.js", "client/client-render.js", "application/javascript")
    .addGetReq("/websocket.js", "client/websocket.js", "application/javascript");
const HTTPServer = HTTP.createServer(_server.app);
HTTPServer.listen(PORT);
const Socket = new WebSocket.Server({ server: HTTPServer });
new Server_1.default(Socket);
console.log("[Server is running]");
