import React from "react";

type MainMenuProps = {
  playerName: string;
  onStartGame: () => void;
};

const MainMenu: React.FC<MainMenuProps> = ({ playerName, onStartGame }) => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111",
        color: "white",
        gap: "20px",
      }}
    >
      <h1>Olá, {playerName}!</h1>
      <button
        onClick={onStartGame}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Iniciar Jogo
      </button>
      <button
        disabled
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          opacity: 0.5,
          cursor: "not-allowed",
        }}
      >
        Entrar em Sala Multiplayer (em breve)
      </button>
    </div>
  );
};

export default MainMenu;
