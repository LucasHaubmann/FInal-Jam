import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import type { PlayerData } from "./game/core/GameLoop";

// Seus Componentes
import MainMenu from "./game/components/MainMenu";
import LevelSelector from "./game/components/LevelSelector";
import GameCanva from "./GameCanva";
import VictoryModal from "./game/components/VictoryModal";
import RegisterMenu from "./game/components/RegisterMenu";
import LobbyMenu from './game/components/LobbyMenu';
import WaitingRoom from './game/components/WaitingRoom';
import { setPaused } from "./game/core/sketch";

type Screen = "register" | "main" | "select" | "lobby" | "waiting_room" | "game"; 

function App() {
  const [screen, setScreen] = useState<Screen>("register");
  const [playerName, setPlayerName] = useState("");
  const [currentLevel, setCurrentLevel] = useState<string | null>("level1");
  const [showVictory, setShowVictory] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [playersInRoom, setPlayersInRoom] = useState<PlayerData[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://192.168.72.152:3001", { transports: ["websocket"] });
    const socket = socketRef.current;
    
    socket.on('roomCreated', (data: { roomId: string, players: PlayerData[] }) => {
      console.log(`[Socket] Sala criada. Indo para a sala de espera como HOST. Sala: ${data.roomId}`);
      setIsHost(true);
      setRoomId(data.roomId);
      setPlayersInRoom(data.players);
      setScreen('waiting_room');
    });

    socket.on('joinedRoom', (data: { roomId: string, players: PlayerData[] }) => {
      console.log(`[Socket] Entrou na sala. Indo para a sala de espera. Sala: ${data.roomId}`);
      setIsHost(false);
      setRoomId(data.roomId);
      setPlayersInRoom(data.players);
      setScreen('waiting_room');
    });

    socket.on('updatePlayerList', (updatedPlayers: PlayerData[]) => {
      console.log("[Socket] Lista de jogadores na sala atualizada:", updatedPlayers);
      setPlayersInRoom(updatedPlayers);
    });

    // ✅ LÓGICA CORRIGIDA: Recebe a lista final de jogadores antes de iniciar o jogo
    socket.on('gameStarting', ({ mapId, players }: { mapId: string, players: PlayerData[] }) => {
      console.log(`[Socket] Jogo iniciando com a lista de jogadores final:`, players);
      setCurrentLevel(mapId);
      setPlayersInRoom(players); // Garante que a lista de jogadores está atualizada
      setGameKey(prev => prev + 1);
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
    socketRef.current?.emit('registerPlayer', name); 
  };
  
  const handleStartGame = () => setScreen("select");
  const handleStartMultiplayer = () => setScreen("lobby");
  const handleCreateRoom = () => socketRef.current?.emit('createRoom');
  const handleJoinRoom = (roomIdToJoin: string) => {
    if (roomIdToJoin) socketRef.current?.emit('joinRoom', roomIdToJoin);
  };
  const handleSelectMapInLobby = (mapId: string) => {
    socketRef.current?.emit('mapSelected', { roomId, mapId });
  };
  const handleStartGameFromLobby = () => {
    socketRef.current?.emit('startGame', { roomId });
  };
  const handleSelectLevel = (level: string) => {
    setPaused(false);
    setShowVictory(false);
    setCurrentLevel(level);
    setRoomId(null);
    setGameKey((prev) => prev + 1);
    setScreen("game");
  };
  const handleVictory = () => { if (!showVictory) { setPaused(true); setShowVictory(true); } };
  const handleReplay = () => { setShowVictory(false); setPaused(false); setGameKey((prev) => prev + 1); };
  const handleBackToMenu = () => {
    setShowVictory(false);
    setPaused(false);
    setCurrentLevel(null);
    setRoomId(null);
    setIsHost(false);
    setPlayersInRoom([]);
    setScreen("main");
  };

  return (
    <>
      {screen === "register" && <RegisterMenu onContinue={handleRegister} />}
      {screen === "main" && <MainMenu playerName={playerName} onStartGame={handleStartGame} onStartMultiplayer={handleStartMultiplayer}/>}
      {screen === "select" && <LevelSelector onSelect={handleSelectLevel} onBack={() => setScreen("main")} />}
      {screen === "lobby" && <LobbyMenu onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} onBack={() => setScreen("main")}/>}
      
      {screen === "waiting_room" && (
        <WaitingRoom
          isHost={isHost}
          roomId={roomId!}
          players={playersInRoom}
          onStartGame={handleStartGameFromLobby}
          onSelectMap={handleSelectMapInLobby}
          onBack={handleBackToMenu}
        />
      )}
      
      {screen === "game" && currentLevel && socketRef.current && (
        <>
          <GameCanva
            key={gameKey}
            levelName={currentLevel}
            roomId={roomId}
            initialPlayers={playersInRoom} 
            onExit={handleBackToMenu}
            onVictory={handleVictory}
            socket={socketRef.current}
          />
          {showVictory && <VictoryModal onReplay={handleReplay} onBackToMenu={handleBackToMenu}/>}
        </>
      )}
    </>
  );
}

export default App;
