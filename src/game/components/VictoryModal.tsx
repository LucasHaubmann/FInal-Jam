import React from "react";

type VictoryModalProps = {
  onReplay: () => void;
  onBackToMenu: () => void; // AQUI: Alterado de onBack para onBackToMenu
};

const VictoryModal: React.FC<VictoryModalProps> = ({ onReplay, onBackToMenu }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
        color: "white",
        pointerEvents: "auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#222",
          padding: "30px 40px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <h2>Parabéns! Você concluiu a fase!</h2>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={onReplay}
            style={{
              padding: "10px 20px",
              marginRight: "15px",
              fontSize: "16px",
              backgroundColor: "#00c853",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Jogar novamente
          </button>
          <button
            onClick={onBackToMenu} // AQUI: Alterado de onBack para onBackToMenu
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#2979ff",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Voltar ao menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default VictoryModal;