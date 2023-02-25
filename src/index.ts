import * as HTTP from "http";
import * as WebSocket from "ws";
import * as fs from "fs";
import express = require("express");

import GameServer from "./game/Server";
const PORT = 1025;

class Server {
  app = express();
  constructor() {}
  addGetReq(path: string, file: string, type: string) {
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
.addGetReq("/","client/index.html","text/html")
.addGetReq("/fonts.css","client/fonts.css","text/css")
.addGetReq("/index.js","client/index.js","application/javascript")
.addGetReq("/input.js","client/input.js","application/javascript")
.addGetReq("/canvas-helpers.js","client/canvas-helpers.js","application/javascript")
.addGetReq("/client-render.js","client/client-render.js","application/javascript")
.addGetReq("/websocket.js","client/websocket.js","application/javascript");
const HTTPServer = HTTP.createServer(_server.app);
HTTPServer.listen(PORT);

const Socket = new WebSocket.Server({ server: HTTPServer });
new GameServer(Socket);
console.log("[Server is running]");