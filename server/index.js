import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const players = {};
const rooms = {}; // ✅ Objeto para guardar o estado de todas as salas

// Função para gerar um ID de sala aleatório e único
const generateRoomId = () => {
  let roomId;
  do {
    roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
  } while (rooms[roomId]); // Garante que o ID não exista
  return roomId;
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
  // Lógica para CRIAR uma sala
  socket.on('createRoom', () => {
    const roomId = generateRoomId();
    socket.join(roomId);
    rooms[roomId] = {
      players: [socket.id], // Adiciona o criador da sala
      // podemos adicionar o estado do jogo aqui depois, ex: "waiting", "playing"
    };
    // Avisa ao criador da sala qual é o ID
    socket.emit('roomCreated', roomId);
    console.log(`Room ${roomId} created by ${socket.id}`);
  });
  
  // Lógica para ENTRAR em uma sala
  socket.on('joinRoom', (roomId) => {
    const room = rooms[roomId];
    if (room) {
      if (room.players.length < 4) { // ✅ Checa o limite de jogadores
        socket.join(roomId);
        room.players.push(socket.id);
        // Avisa ao jogador que ele entrou com sucesso
        socket.emit('joinedRoom', roomId);
        // Avisa a TODOS os outros na sala que um novo jogador entrou
        socket.to(roomId).emit('playerJoined', socket.id);
        console.log(`${socket.id} joined room ${roomId}. Players: ${room.players.length}`);
      } else {
        socket.emit('roomFull', roomId); // Avisa que a sala está cheia
      }
    } else {
      socket.emit('roomNotFound', roomId); // Avisa que a sala não existe
    }
  });

  // A lógica de `playerUpdate` precisa ser específica da sala agora
  socket.on("playerUpdate", (data) => {
    // Encontra a sala do jogador e envia a atualização SÓ para essa sala
    const { roomId, ...playerData } = data;
    if (roomId && rooms[roomId]) {
      socket.to(roomId).emit("playerUpdate", playerData);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    delete players[socket.id]; // Mantém sua lógica antiga se precisar
    
    // ✅ Remove o jogador de qualquer sala em que ele esteja
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.indexOf(socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        console.log(`${socket.id} left room ${roomId}. Players: ${room.players.length}`);
        // Se a sala ficar vazia, podemos excluí-la
        if (room.players.length === 0) {
          delete rooms[roomId];
          console.log(`Room ${roomId} is empty and has been closed.`);
        } else {
          // Avisa os outros jogadores que alguém saiu
          socket.to(roomId).emit("playerLeft", socket.id);
        }
        break; // Sai do loop pois o jogador só pode estar em uma sala
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});