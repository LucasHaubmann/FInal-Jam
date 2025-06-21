// server/index.js
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Ou coloque a URL exata do seu frontend, ex: "http://localhost:5173"
    methods: ["GET", "POST"]
  }
});

const players = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  // 🔴 NOVO: Inicializa a posição do novo jogador no servidor
  // É crucial que a posição inicial no servidor seja a mesma que a posição inicial do player no cliente.
  // No seu GameLoop.ts, o player começa em (0, 500).
  players[socket.id] = {
    x: 0,
    y: 500,
    id: socket.id,
    // Você pode adicionar outras propriedades iniciais aqui, como playerName, cor, etc.
    // playerName: "Jogador " + socket.id.substring(0, 4),
    // color: "#00FF00" // Exemplo de cor
  };

  // 🟢 ALTERADO: Envia a lista de TODOS os jogadores existentes para o jogador que acabou de se conectar
  socket.emit("currentPlayers", players); // Envia o objeto 'players' completo

  // 🟢 ALTERADO: Avisa a TODOS os outros jogadores que um novo jogador conectou,
  // enviando os dados completos desse novo jogador
  socket.broadcast.emit("newPlayer", players[socket.id]); // Alterado de playerConnected para newPlayer e enviando o objeto

  socket.on("playerUpdate", (playerData) => {
    // Atualiza a posição do jogador que enviou a atualização
    if (players[socket.id]) {
      players[socket.id].x = playerData.x;
      players[socket.id].y = playerData.y;
      // Certifique-se de atualizar outras propriedades se estiverem sendo sincronizadas
      // players[socket.id].state = playerData.state;
    }
    // Emite a atualização para todos os outros clientes, exceto o remetente
    socket.broadcast.emit("playerUpdate", players[socket.id]); // Garante que envia o estado mais recente do servidor
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