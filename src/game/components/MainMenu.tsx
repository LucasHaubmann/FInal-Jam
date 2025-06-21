import React from "react";

// ✅ 1. Adicionamos a nova prop `onStartMultiplayer` ao tipo
type MainMenuProps = {
  playerName: string;
  onStartGame: () => void;
  onStartMultiplayer: () => void;
};

// ✅ 2. Recebemos a nova função aqui
const MainMenu: React.FC<MainMenuProps> = ({ playerName, onStartGame, onStartMultiplayer }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      padding: "20px",
    },
    title: {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "2.5rem",
      color: "#e0e0e0",
      marginBottom: "0.5rem",
    },
    playerName: {
      color: "#ff00ff", // Magenta
      textShadow: "0 0 5px #ff00ff, 0 0 10px #ff00ff",
    },
    buttonContainer: {
      marginTop: "3rem",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    button: {
      fontFamily: "'Orbitron', sans-serif",
      width: "350px",
      padding: "20px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#0a0a14",
      backgroundColor: "#00f6ff",
      border: "2px solid #00f6ff",
      cursor: "pointer",
      textTransform: "uppercase",
      boxShadow: "0 0 10px #00f6ff, 0 0 20px #00f6ff",
      transition: "all 0.3s ease",
      position: "relative",
    },
    multiplayerButton: { // Um estilo um pouco diferente para o botão de multiplayer
      backgroundColor: "#ff00ff", // Magenta
      borderColor: "#ff00ff",
      boxShadow: "0 0 10px #ff00ff, 0 0 20px #ff00ff",
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Welcome, <span style={styles.playerName}>{playerName}</span>
      </h1>
      <div style={styles.buttonContainer}>
        <button
          onClick={onStartGame}
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Initiate Simulation (Single Player)
        </button>
        
        {/* ✅ 3. Removemos o 'disabled' e adicionamos o onClick */}
        <button
          onClick={onStartMultiplayer}
          style={{ ...styles.button, ...styles.multiplayerButton }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Multiplayer Matrix
        </button>
      </div>
    </div>
  );
};

export default MainMenu;