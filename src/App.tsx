import { useState } from "react";
import GameCanvas from "./GameCanva";
import RegisterMenu from "./game/components/RegisterMenu";
import MainMenu from "./game/components/MainMenu";

function App() {
  const [stage, setStage] = useState<"register" | "main" | "game">("register");
  const [playerName, setPlayerName] = useState("");

  const handleContinue = (name: string) => {
    setPlayerName(name);
    setStage("main");
  };

  const handleStartGame = () => {
    setStage("game");
  };

  return (
    <>
      {stage === "register" && <RegisterMenu onContinue={handleContinue} />}
      {stage === "main" && (
        <MainMenu playerName={playerName} onStartGame={handleStartGame} />
      )}
      {stage === "game" && <GameCanvas />}
    </>
  );
}

export default App;
