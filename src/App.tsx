import { useEffect, useState } from "react";
import RegisterMenu from "./game/components/RegisterMenu";
import MainMenu from "./game/components/MainMenu";
import LevelSelector from "./game/components/LevelSelector";
import GameCanva from "./GameCanva";
import VictoryModal from "./game/components/VictoryModal";

type Screen = "register" | "main" | "select" | "game";

function App() {
  const [screen, setScreen] = useState<Screen>("register");
  const [playerName, setPlayerName] = useState("");
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Força remount do GameCanvas

  // Garantir que ao sair da fase o modal seja fechado
  useEffect(() => {
    if (screen !== "game" && showVictory) {
      setShowVictory(false);
    }
  }, [screen, showVictory]);

  const handleRegister = (name: string) => {
    setPlayerName(name);
    setScreen("main");
  };

  const handleStartGame = () => {
    setScreen("select");
  };

  const handleSelectLevel = (level: string) => {
    setCurrentLevel(level);
    setGameKey((prev) => prev + 1); // Garante um novo canvas limpo
    setScreen("game");
    setShowVictory(false);
  };

  const handleReplay = () => {
    setShowVictory(false);
    setGameKey((prev) => prev + 1); // Reinicia o GameCanvas
  };

  const handleBackToMenu = () => {
    setShowVictory(false);
    setCurrentLevel(null);
    setScreen("main");
  };

  const handleExitGame = () => {
    setShowVictory(false);
    setCurrentLevel(null);
    setScreen("main");
  };

  const handleVictory = () => {
    console.log("VITÓRIA!");
    setShowVictory(true);
  };

  return (
    <>
      {screen === "register" && <RegisterMenu onContinue={handleRegister} />}

      {screen === "main" && (
        <MainMenu playerName={playerName} onStartGame={handleStartGame} />
      )}

      {screen === "select" && (
        <LevelSelector
          onSelect={handleSelectLevel}
          onBack={handleBackToMenu}
        />
      )}

      {screen === "game" && currentLevel && (
        <>
          <GameCanva
            key={gameKey}
            levelName={currentLevel}
            onExit={handleExitGame}
            onVictory={handleVictory}
          />
          {showVictory && (
            <VictoryModal
              onReplay={handleReplay}
              onBack={handleBackToMenu}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;
