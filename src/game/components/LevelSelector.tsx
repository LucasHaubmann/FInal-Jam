import React from "react";

const LevelSelector: React.FC<{ onSelect: (levelId: string) => void; onBack: () => void; }> = ({ onSelect, onBack }) => {
  const levels = [
    { id: "level1", name: "Fase 1" },
    { id: "level2", name: "Fase 2" },
    { id: "level3", name: "Fase 3" },
  ];
  
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
    },
    title: {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "3rem",
      color: "#00f6ff",
      textShadow: "0 0 5px #00f6ff, 0 0 10px #00f6ff",
      marginBottom: "3rem",
    },
    levelList: {
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
    },
    levelButton: {
      fontFamily: "'Chakra Petch', sans-serif",
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#a0a0c0",
      backgroundColor: "transparent",
      border: "2px solid #304060",
      width: "400px",
      padding: "20px",
      textAlign: "left",
      cursor: "pointer",
      transition: "all 0.3s ease",
    },
    backButton: {
      fontFamily: "'Chakra Petch', sans-serif",
      marginTop: "3rem",
      background: "none",
      border: "none",
      color: "#506080",
      fontSize: "1rem",
      cursor: "pointer",
      textTransform: "uppercase",
      transition: "color 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Select Target Node</h1>
      <div style={styles.levelList}>
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            style={styles.levelButton}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = "#ff00ff";
              e.currentTarget.style.color = "#ff00ff";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 0, 255, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = "#304060";
              e.currentTarget.style.color = "#a0a0c0";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {`> ${level.name}`}
          </button>
        ))}
      </div>
      <button 
        onClick={onBack} 
        style={styles.backButton}
        onMouseOver={(e) => (e.currentTarget.style.color = "#a0a0c0")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#506080")}
      >
        [ Disconnect ]
      </button>
    </div>
  );
};

export default LevelSelector;