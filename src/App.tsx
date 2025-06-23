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

// Tipo para os resultados da corrida
type RaceResult = {
  id: string;
  name: string;
  time: string;
};

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

  // Estados para o tempo
  const [finalTime, setFinalTime] = useState<string | null>(null);
  const [raceResults, setRaceResults] = useState<RaceResult[]>([]);

  useEffect(() => {
    // Use o endereço IP e a porta corretos do seu servidor
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
    
    socket.on('gameStarting', ({ mapId, players }: { mapId: string, players: PlayerData[] }) => {
      console.log(`[Socket] Jogo iniciando com a lista de jogadores final:`, players);
      setCurrentLevel(mapId);
      setPlayersInRoom(players);
      setRaceResults([]); // Limpa os resultados da corrida anterior
      setFinalTime(null);
      setGameKey(prev => prev + 1);
      setScreen('game');
    });

    // Novo listener para resultados
    socket.on('updateResults', (results: RaceResult[]) => {
        console.log("[Socket] Resultados da corrida atualizados:", results);
        setRaceResults(results);
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
    setPlayersInRoom([]);
    setRaceResults([]);
    setFinalTime(null);
    setGameKey((prev) => prev + 1);
    setScreen("game");
  };
  
  // handleVictory agora recebe o tempo final
  const handleVictory = (time: string) => { 
    if (!showVictory) {
        setPaused(true);
        setFinalTime(time); // Armazena o tempo do jogador local
        setShowVictory(true); 
    }
  };

  const handleReplay = () => { 
      // Em multiplayer, só o host pode reiniciar. Por simplicidade, voltamos ao menu.
      if (roomId) {
        handleBackToMenu();
        return;
      }
      setShowVictory(false); 
      setPaused(false); 
      setFinalTime(null);
      setRaceResults([]);
      setGameKey((prev) => prev + 1); 
  };
  
  const handleBackToMenu = () => {
    setShowVictory(false);
    setPaused(false);
    setCurrentLevel(null);
    setRoomId(null);
    setIsHost(false);
    setPlayersInRoom([]);
    setFinalTime(null);
    setRaceResults([]);
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
          {showVictory && (
            <VictoryModal 
              onReplay={handleReplay} 
              onBackToMenu={handleBackToMenu}
              finalTime={finalTime}
              raceResults={raceResults}
              isMultiplayer={!!roomId}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;