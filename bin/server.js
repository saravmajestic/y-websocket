#!/usr/bin/env node

/**
 * @type {any}
 */
const WebSocket = require("ws");
const http = require("http");
const port = process.env.PORT || 1234;
const WS_PORT = 3001;
const wss = new WebSocket.Server({ port: WS_PORT }, () => {
  console.log(`Listening on PORT ${WS_PORT} for websockets`);
});
const setupWSConnection = require("./utils.js").setupWSConnection;

const host = process.env.HOST || "localhost";

const server = http.createServer((request, response) => {
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end("okay");
});

wss.on("connection", setupWSConnection);

server.on("upgrade", (request, socket, head) => {
  // You may check auth of request here..
  // See https://github.com/websockets/ws#client-authentication
  /**
   * @param {any} ws
   */
  const handleAuth = (ws) => {
    wss.emit("connection", ws, request);
  };
  wss.handleUpgrade(request, socket, head, handleAuth);
});

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`);
});
