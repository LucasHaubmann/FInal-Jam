import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

import MainMenu from "./game/components/MainMenu";
import LevelSelector from "./game/components/LevelSelector";
import GameCanva from "./GameCanva";
import VictoryModal from "./game/components/VictoryModal";
import RegisterMenu from "./game/components/RegisterMenu";
import LobbyMenu from './game/components/LobbyMenu';
import { setPaused } from "./game/core/sketch";

type Screen = "register" | "main" | "select" | "lobby" | "game"; 

function App() {
  const [screen, setScreen] = useState<Screen>("register");
  const [playerName, setPlayerName] = useState("");
  const [currentLevel, setCurrentLevel] = useState<string | null>("level1");
  const [showVictory, setShowVictory] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", { transports: ["websocket"] });
    const socket = socketRef.current;
    
    console.log("Socket.IO client inicializado.");

    socket.on('roomCreated', (data: { roomId: string, players: any[] }) => {
      console.log(`[Socket] Sala criada com sucesso! ID: ${data.roomId}`);
      setRoomId(data.roomId);
      setCurrentLevel("level1");
      setScreen('game');
    });

    socket.on('joinedRoom', (data: { roomId: string, players: any[] }) => {
      console.log(`[Socket] Entrou na sala com sucesso! ID: ${data.roomId}`);
      setRoomId(data.roomId);
      setCurrentLevel("level1");
      setScreen('game');
    });

    socket.on('roomNotFound', () => alert("Erro: Sala não encontrada!"));
    socket.on('roomFull', () => alert("Erro: A sala está cheia!"));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleRegister = (name: string) => {
    setPlayerName(name);
    setScreen("main");
    // ✅ Envia o nome do jogador para o servidor
    socketRef.current?.emit('registerPlayer', name); 
  };
  
  const handleStartGame = () => setScreen("select");
  const handleStartMultiplayer = () => setScreen("lobby");

  const handleCreateRoom = () => {
    socketRef.current?.emit('createRoom');
  };
  
  const handleJoinRoom = (roomIdToJoin: string) => {
    if (roomIdToJoin) {
      socketRef.current?.emit('joinRoom', roomIdToJoin);
    }
  };

  const handleSelectLevel = (level: string) => {
    setPaused(false);
    setShowVictory(false);
    setCurrentLevel(level);
    setRoomId(null);
    setGameKey((prev) => prev + 1);
    setScreen("game");
  };
  
  const handleVictory = () => {
    if (!showVictory) {
      setPaused(true);
      setShowVictory(true);
    }
  };

  const handleReplay = () => {
    setShowVictory(false);
    setPaused(false);
    setGameKey((prev) => prev + 1);
  };

  const handleBackToMenu = () => {
    setShowVictory(false);
    setPaused(false);
    setCurrentLevel(null);
    setRoomId(null);
    setScreen("main");
  };

  return (
    <>
      {screen === "register" && <RegisterMenu onContinue={handleRegister} />}
      
      {screen === "main" && (
        <MainMenu 
          playerName={playerName} 
          onStartGame={handleStartGame}
          onStartMultiplayer={handleStartMultiplayer}
        />
      )}

      {screen === "select" && (
        <LevelSelector onSelect={handleSelectLevel} onBack={() => setScreen("main")} />
      )}
      
      {screen === "lobby" && (
        <LobbyMenu 
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          onBack={() => setScreen("main")}
        />
      )}
      
      {screen === "game" && currentLevel && socketRef.current && (
        <>
          <GameCanva
            key={gameKey}
            levelName={currentLevel}
            roomId={roomId}
            onExit={handleBackToMenu}
            onVictory={handleVictory}
            socket={socketRef.current}
          />
          {showVictory && (
            <VictoryModal
              onReplay={handleReplay}
              onBackToMenu={handleBackToMenu}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;