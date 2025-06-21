// server/index.js
import express from "express"; // Mude de require para import
import http from "http";     // Mude de require para import
import { Server } from "socket.io"; // Mude de require para import
import cors from "cors";     // Mude de require para import

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const players = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  players[socket.id] = {
    x: 0,
    y: 500,
    id: socket.id,
  };
  socket.emit("currentPlayers", players);
  socket.broadcast.emit("playerConnected", socket.id, players[socket.id].x, players[socket.id].y);

  socket.on("playerUpdate", (playerData) => {
    if (players[socket.id]) {
      players[socket.id].x = playerData.x;
      players[socket.id].y = playerData.y;
    }
    socket.broadcast.emit("playerUpdate", playerData);
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    delete players[socket.id];
    socket.broadcast.emit("playerDisconnected", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});