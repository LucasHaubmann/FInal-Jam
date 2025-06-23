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
const playerColors = ['#00A3FF', '#FFA500', '#00C853', '#9400D3'];

const generateRoomId = () => {
  let roomId;
  do {
    roomId = Math.random().toString(36).substring(2, 7).toUpperCase();
  } while (rooms[roomId]);
  return roomId;
};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);
  
  socket.on('registerPlayer', (playerName) => {
    socket.data.playerName = playerName;
    console.log(`Player ${socket.id} registered as: ${playerName}`);
  });
  
  socket.on('createRoom', () => {
    const roomId = generateRoomId();
    socket.join(roomId);

    socket.data.color = playerColors[0];
    
    rooms[roomId] = {
      hostId: socket.id,
      mapId: 'level1',
      players: [{
        id: socket.id,
        name: socket.data.playerName || `Player 1`,
        color: socket.data.color
      }]
    };
    
    socket.emit('roomCreated', { roomId, players: rooms[roomId].players });
    console.log(`Room ${roomId} created by ${socket.id}`);
  });
  
  socket.on('joinRoom', (roomId) => {
    const room = rooms[roomId];
    if (room && room.players.length < 4) {
      socket.join(roomId);
      
      socket.data.color = playerColors[room.players.length % playerColors.length];
      
      const newPlayer = {
        id: socket.id,
        name: socket.data.playerName || `Player ${room.players.length + 1}`,
        color: socket.data.color
      };

      room.players.push(newPlayer);
      
      socket.emit('joinedRoom', { roomId, players: room.players });
      
      // ✅ CORREÇÃO: Usa io.to() para enviar para TODOS na sala, incluindo o host.
      io.to(roomId).emit('updatePlayerList', room.players);
      console.log(`${socket.id} (${newPlayer.name}) joined room ${roomId}.`);

      if (room.players.length === 4) {
          console.log(`Room ${roomId} is full, starting game automatically.`);
          io.to(roomId).emit('gameStarting', { mapId: room.mapId, players: room.players });
      }

    } else if (room) {
        socket.emit('roomFull', roomId);
    } else {
        socket.emit('roomNotFound', roomId);
    }
  });

  socket.on('mapSelected', ({ roomId, mapId }) => {
    const room = rooms[roomId];
    if (room && room.hostId === socket.id) {
      room.mapId = mapId;
      io.to(roomId).emit('mapChanged', mapId);
      console.log(`Host of room ${roomId} changed map to ${mapId}`);
    }
  });

  socket.on('startGame', ({ roomId }) => {
    const room = rooms[roomId];
    if (room && room.hostId === socket.id) {
      console.log(`Host starting game in room ${roomId} with map ${room.mapId}`);
      io.to(roomId).emit('gameStarting', { mapId: room.mapId, players: room.players });
    }
  });

  socket.on("playerUpdate", (data) => {
    const { roomId, ...playerData } = data;
    if (roomId && rooms[roomId]) {
      const fullPlayerData = { ...playerData, name: socket.data.playerName, color: socket.data.color };
      socket.to(roomId).emit("playerUpdate", fullPlayerData);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User Disconnected: ${socket.id}`);
    
    for (const roomId in rooms) {
      const room = rooms[roomId];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        console.log(`${socket.id} left room ${roomId}.`);
        
        if (room.players.length === 0) {
          delete rooms[roomId];
          console.log(`Room ${roomId} is empty and has been closed.`);
        } else {
          if (room.hostId === socket.id && room.players.length > 0) {
            room.hostId = room.players[0].id;
            console.log(`New host for room ${roomId} is ${room.hostId}`);
          }
          // ✅ Notifica todos da nova lista de jogadores e do novo host.
          io.to(roomId).emit("updatePlayerList", room.players);
        }
        break;
      }
    }
  });
});

server.listen(3001, '0.0.0.0', () => {
  console.log("Servidor rodando na porta 3001");
});