import React from "react";

type VictoryModalProps = {
  onReplay: () => void;
  onBackToMenu: () => void;
};

const VictoryModal: React.FC<VictoryModalProps> = ({ onReplay, onBackToMenu }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    // Fundo que cobre a tela inteira com efeito de desfoque
    backdrop: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(10, 20, 40, 0.5)",
      backdropFilter: "blur(8px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 100,
    },
    // A caixa do modal
    modalBox: {
      fontFamily: "'Chakra Petch', sans-serif",
      width: "clamp(300px, 60vw, 600px)", // Largura responsiva
      padding: "40px",
      backgroundColor: "rgba(10, 10, 20, 0.85)",
      border: "2px solid #00f6ff",
      borderRadius: "8px",
      textAlign: "center",
      boxShadow: "0 0 25px rgba(0, 246, 255, 0.6), inset 0 0 15px rgba(0, 246, 255, 0.3)",
    },
    // Título principal
    title: {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "3rem",
      color: "#00f6ff",
      textShadow: "0 0 5px #00f6ff, 0 0 15px #00f6ff, 0 0 25px #00a1a6",
      marginBottom: "30px",
    },
    // Container dos botões
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "20px",
      marginTop: "20px",
    },
    // Estilo base para os botões
    button: {
      fontFamily: "'Orbitron', sans-serif",
      flex: 1, // Faz os botões terem a mesma largura
      padding: "15px 20px",
      fontSize: "1rem",
      fontWeight: "bold",
      border: "2px solid",
      borderRadius: "5px",
      cursor: "pointer",
      textTransform: "uppercase",
      transition: "all 0.3s ease",
    },
    // Botão de Replay (Primário)
    replayButton: {
      color: "#0a0a14",
      backgroundColor: "#00f6ff",
      borderColor: "#00f6ff",
      boxShadow: "0 0 10px #00f6ff, 0 0 20px #00f6ff",
    },
    // Botão de Voltar (Secundário)
    backButton: {
      color: "#ff00ff",
      backgroundColor: "transparent",
      borderColor: "#ff00ff",
    },
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modalBox}>
        <h1 style={styles.title}>OBJECTIVE CLEARED</h1>
        <div style={styles.buttonContainer}>
          <button
            onClick={onReplay}
            style={{ ...styles.button, ...styles.replayButton }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#9effff")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#00f6ff")}
          >
            Re-Initialize
          </button>
          <button
            onClick={onBackToMenu}
            style={{ ...styles.button, ...styles.backButton }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 0, 255, 0.2)";
              e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 0, 255, 0.5)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;