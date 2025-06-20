import React from "react";

interface LevelSelector {
  onSelect: (levelId: string) => void;
  onBack: () => void;
}

const LevelSelectMenu: React.FC<LevelSelector> = ({ onSelect, onBack }) => {
  const levels = [
    { id: "level1", name: "Fase 1" },
    { id: "level2", name: "Fase 2" },
    { id: "level3", name: "Fase 3" },
  ];

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
      }}
    >
      <h1>Selecione uma Fase</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", margin: "24px 0" }}>
        {levels.map((level) => (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            style={{ padding: "10px 24px", fontSize: "18px", cursor: "pointer" }}
          >
            {level.name}
          </button>
        ))}
      </div>
      <button onClick={onBack} style={{ marginTop: 16, color: "#bbb", background: "none", border: "none", cursor: "pointer" }}>
        Voltar
      </button>
    </div>
  );
};

export default LevelSelectMenu;