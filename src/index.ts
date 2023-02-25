import * as http from "http";
import * as WebSocket from "ws";
import * as fs from "fs";

import GameServer from "./game/Server";
const PORT = parseInt(process.env.PORT || "8080");

const server = http.createServer((req, res) => {
      let file: string | null = null;
      let contentType = "text/html"
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
/*
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
*/
server.listen(PORT);
const Socket = new WebSocket.Server({ server });
new GameServer(Socket);
console.log("[Server is running]");
