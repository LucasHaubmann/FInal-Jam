import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";

// Importe seus componentes
import MainMenu from "./game/components/MainMenu";
import LevelSelector from "./game/components/LevelSelector";
import GameCanva from "./GameCanva";
import VictoryModal from "./game/components/VictoryModal";
import RegisterMenu from "./game/components/RegisterMenu";
import { setPaused } from "./game/core/sketch";

type Screen = "register" | "main" | "select" | "game";

function App() {
  const [screen, setScreen] = useState<Screen>("register");
  const [playerName, setPlayerName] = useState("");
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [gameKey, setGameKey] = useState(0);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const handleRegister = (name: string) => {
    setPlayerName(name);
    setScreen("main");
  };

  const handleStartGame = () => {
    setScreen("select");
  };

  const handleSelectLevel = (level: string) => {
    if (!socketRef.current || !socketRef.current.connected) {
      socketRef.current?.disconnect();
      socketRef.current = io("http://localhost:3000", {
        transports: ["websocket"],
        forceNew: true,
      });
    }
    
    setPaused(false);
    setShowVictory(false);
    setCurrentLevel(level);
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
    if (socketRef.current?.connected) {
      socketRef.current.disconnect();
    }
    setShowVictory(false);
    setPaused(false);
    setCurrentLevel(null);
    setScreen("main");
  };

  return (
    <>
      {screen === "register" && <RegisterMenu onContinue={handleRegister} />}
      
      {screen === "main" && <MainMenu playerName={playerName} onStartGame={handleStartGame} />}
      
      {screen === "select" && (
        <LevelSelector onSelect={handleSelectLevel} onBack={() => setScreen("main")} />
      )}
      
      {screen === "game" && currentLevel && socketRef.current && (
        <>
          <GameCanva
            key={gameKey}
            levelName={currentLevel}
            onExit={handleBackToMenu}
            onVictory={handleVictory}
            socket={socketRef.current}
          />
          {showVictory && (
            <VictoryModal
              onReplay={handleReplay}
              onBackToMenu={handleBackToMenu} // Agora o nome da prop está correto
            />
          )}
        </>
      )}
    </>
  );
}

export default App;