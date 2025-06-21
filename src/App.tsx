import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Importe todos os seus componentes
import MainMenu from "./game/components/MainMenu";
import LevelSelector from "./game/components/LevelSelector";
import GameCanva from "./GameCanva";
import VictoryModal from "./game/components/VictoryModal";
import RegisterMenu from "./game/components/RegisterMenu";
import LobbyMenu from './game/components/LobbyMenu'; // ✅ Importa o novo menu de lobby
import { setPaused } from "./game/core/sketch";

// ✅ Adiciona 'lobby' aos tipos de tela
type Screen = "register" | "main" | "select" | "lobby" | "game"; 

function App() {
  const [screen, setScreen] = useState<Screen>("register");
  const [playerName, setPlayerName] = useState("");
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  // ✅ Estados e Refs para o Multiplayer
  const [roomId, setRoomId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // ✅ Efeito para gerenciar a conexão e os eventos do socket
  useEffect(() => {
    // Conecta ao servidor assim que o app carrega
    socketRef.current = io("http://localhost:3000", { transports: ["websocket"] });
    const socket = socketRef.current;
    
    console.log("Socket.IO client inicializado.");

    // Ouve a resposta do servidor após criar uma sala
    socket.on('roomCreated', (newRoomId) => {
      console.log(`[Socket] Sala criada com sucesso! ID: ${newRoomId}`);
      setRoomId(newRoomId);
      // Define um nível padrão para o modo multiplayer
      setCurrentLevel("level1"); 
      setScreen('game'); // Entra no jogo
    });

    // Ouve a resposta do servidor após entrar em uma sala
    socket.on('joinedRoom', (joinedRoomId) => {
      console.log(`[Socket] Entrou na sala com sucesso! ID: ${joinedRoomId}`);
      setRoomId(joinedRoomId);
      // Define um nível padrão para o modo multiplayer
      setCurrentLevel("level1");
      setScreen('game'); // Entra no jogo
    });

    // Ouve erros do servidor
    socket.on('roomNotFound', () => alert("Erro: Sala não encontrada!"));
    socket.on('roomFull', () => alert("Erro: A sala está cheia!"));

    // Cleanup: desconecta quando o componente App for destruído
    return () => {
      socket.disconnect();
    };
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez

  const handleRegister = (name: string) => {
    setPlayerName(name);
    setScreen("main");
  };

  // ✅ Funções para os botões do menu
  const handleStartGame = () => setScreen("select"); // Inicia o modo Single Player
  const handleStartMultiplayer = () => setScreen("lobby"); // Vai para a tela de Lobby

  // ✅ Funções que o LobbyMenu vai chamar
  const handleCreateRoom = () => {
    socketRef.current?.emit('createRoom');
  };
  
  const handleJoinRoom = (roomIdToJoin: string) => {
    if (roomIdToJoin) {
      socketRef.current?.emit('joinRoom', roomIdToJoin);
    }
  };

  // Esta função é para o Single Player
  const handleSelectLevel = (level: string) => {
    setPaused(false);
    setShowVictory(false);
    setCurrentLevel(level);
    setRoomId(null); // Garante que não estamos em modo multiplayer
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

  // Função genérica para sair de uma partida e voltar ao menu
  const handleBackToMenu = () => {
    // Adicionar lógica de sair da sala no socket se necessário
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
          onStartMultiplayer={handleStartMultiplayer} // ✅ Passa a nova função
        />
      )}

      {screen === "select" && (
        <LevelSelector onSelect={handleSelectLevel} onBack={() => setScreen("main")} />
      )}
      
      {/* ✅ Renderiza a nova tela de Lobby */}
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
            roomId={roomId} // ✅ Passa o roomId para o canvas
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