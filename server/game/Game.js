import { createServer } from "http";
import { WebSocketServer } from "ws";
import express from "express";
import { existsSync, readFileSync } from "fs";
import { GameServer } from "./Server.js";

class Server {
    constructor() {
      this.app = express();
    }
    addGetReq(path, file, type) {
      this.app.get(path, (_, res) => {
        res.setHeader("Content-Type", `${type}; charset=utf-8`);
        if (file && existsSync(file)) {
          res.writeHead(200);
          return res.end(readFileSync(file));
        }
        res.writeHead(404);
      });
      return this;
    }
    addPostReq(path, cb) {
      this.app.post(path, cb);
      return this;
    }
}
const _server = new Server()
.addGetReq("/","client/index.html","text/html")
.addGetReq("/fonts.css","client/fonts.css","text/css")
.addGetReq("/index.js","client/index.js","application/javascript")
.addGetReq("/input.js","client/input.js","application/javascript")
.addGetReq("/canvas-helpers.js","client/canvas-helpers.js","application/javascript")
.addGetReq("/client-render.js","client/client-render.js","application/javascript")
.addGetReq("/websocket.js","client/websocket.js","application/javascript");
const HTTPServer = createServer(_server.app);
HTTPServer.listen(1025);

const Socket = new WebSocketServer({ server: HTTPServer });
new GameServer(Socket);
console.log("[Server is running]");