import React, { useState } from "react";
import RegisterMenu from "./game/components/RegisterMenu";
import MainMenu from "./game/components/MainMenu";
import LevelSelector from "./game/components/LevelSelector";
import GameCanva from "././GameCanva";
import VictoryModal from "./game/components/VictoryModal";

type Screen = "register" | "main" | "select" | "game";

function App() {
  const [screen, setScreen] = useState<Screen>("register");
  const [playerName, setPlayerName] = useState("");
  const [currentLevel, setCurrentLevel] = useState<string | null>(null);
  const [showVictory, setShowVictory] = useState(false);

  const handleRegister = (name: string) => {
    setPlayerName(name);
    setScreen("main");
  };

  const handleStartGame = () => {
    setScreen("select");
  };

const handleSelectLevel = (level: string) => {
  setCurrentLevel(level);
  setScreen('game');
  setShowVictory(false); // limpa o estado!
};

  const handleGameEnd = () => {
    setShowVictory(true);
  };

const handleReplay = () => {
  setShowVictory(false);
  setCurrentLevel(null); // força desmontar
  setTimeout(() => {
    setCurrentLevel(prev => prev); // força remontar mesmo nome
  }, 0);
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
        <LevelSelector onSelect={handleSelectLevel} onBack={handleBackToMenu}/>
      )}

      {screen === "game" && currentLevel && (
        <>
          <GameCanva
            levelName={currentLevel}
            onExit={handleExitGame}
            onVictory={handleVictory}
          />
          {showVictory && (
            <VictoryModal onReplay={handleReplay} onBack={handleBackToMenu} />
          )}
        </>
      )}
    </>
  );
}

export default App;
