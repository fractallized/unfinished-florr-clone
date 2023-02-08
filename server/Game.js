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
      console.log(path, file, type);
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
.addGetReq("/index.js","client/index.js","application/javascript");
const HTTPServer = createServer(_server.app);
HTTPServer.listen(3000);

const Socket = new WebSocketServer({ server: HTTPServer });
const Game = new GameServer(Socket);
console.log("started");
