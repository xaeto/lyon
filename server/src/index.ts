import * as express from "express";
import * as http from "http";
import * as WebSocket from "ws";

const app = express();

//initialize a simple http server
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

//initialize the WebSocket server instance
const wssServer = new WebSocket.Server({ server: server, path: "/server" });

wssServer.on("connection", (ws: WebSocket) => {
  ws.on("message", (message: string) => {
    console.log("received: %s", message);
    ws.send(`Hello, you sent -> ${message}`);
  });

  ws.send("Hi there, I am a WebSocket server");
});

//start our server
server.listen(process.env.PORT || 8999, () => {
  console.log(`Server started on port http://localhost:${process.env.PORT || 8999}`);
});
