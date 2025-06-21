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

const rooms = {};

// ✅ Lista de cores para atribuir aos jogadores
const playerColors = ['#00A3FF', '#FFA500', '#00C853', '#9400D3']; // Azul, Laranja, Verde, Roxo

const generateRoomId = () => {
  let roomId;
  do {
    roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
  } while (rooms[roomId]);
  return roomId;
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
  // ✅ Ouve o evento onde o cliente envia seu nome
  socket.on('registerPlayer', (playerName) => {
    // Guarda os dados customizados diretamente no objeto do socket
    socket.data.playerName = playerName;
    console.log(`Player ${socket.id} registered as: ${playerName}`);
  });
  
  socket.on('createRoom', () => {
    const roomId = generateRoomId();
    socket.join(roomId);

    // ✅ O primeiro jogador (host) pega a primeira cor
    socket.data.color = playerColors[0];
    
    // ✅ A sala agora guarda objetos de jogador, não apenas IDs
    rooms[roomId] = {
      players: [{
        id: socket.id,
        name: socket.data.playerName || `Player 1`,
        color: socket.data.color
      }]
    };
    
    // Avisa ao criador da sala o ID e a lista inicial de jogadores
    socket.emit('roomCreated', { roomId, players: rooms[roomId].players });
    console.log(`Room ${roomId} created by ${socket.id}`);
  });
  
  socket.on('joinRoom', (roomId) => {
    const room = rooms[roomId];
    if (room) {
      if (room.players.length < 4) {
        socket.join(roomId);
        
        // ✅ Atribui a próxima cor disponível da lista
        socket.data.color = playerColors[room.players.length % playerColors.length];
        
        const newPlayer = {
          id: socket.id,
          name: socket.data.playerName || `Player ${room.players.length + 1}`,
          color: socket.data.color
        };

        room.players.push(newPlayer);
        
        // Envia a lista completa de jogadores para quem acabou de entrar
        socket.emit('joinedRoom', { roomId, players: room.players });
        
        // Envia os dados do NOVO jogador para os que JÁ ESTAVAM na sala
        socket.to(roomId).emit('playerJoined', newPlayer);
        console.log(`${socket.id} (${newPlayer.name}) joined room ${roomId}. Players: ${room.players.length}`);
      } else {
        socket.emit('roomFull', roomId);
      }
    } else {
      socket.emit('roomNotFound', roomId);
    }
  });

  socket.on("playerUpdate", (data) => {
    const { roomId, ...playerData } = data;
    if (roomId && rooms[roomId]) {
      // ✅ Inclui os dados mais recentes de nome e cor no broadcast
      const fullPlayerData = {
        ...playerData,
        name: socket.data.playerName,
        color: socket.data.color,
      };
      socket.to(roomId).emit("playerUpdate", fullPlayerData);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    
    for (const roomId in rooms) {
      const room = rooms[roomId];
      // ✅ Procura o jogador pelo ID no array de objetos
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        console.log(`${socket.id} left room ${roomId}. Players remaining: ${room.players.length}`);
        
        if (room.players.length === 0) {
          delete rooms[roomId];
          console.log(`Room ${roomId} is empty and has been closed.`);
        } else {
          socket.to(roomId).emit("playerLeft", socket.id);
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});