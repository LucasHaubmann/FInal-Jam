import React, { useState } from "react";

type RegisterMenuProps = {
  onContinue: (name: string) => void;
};

const RegisterMenu: React.FC<RegisterMenuProps> = ({ onContinue }) => {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) {
      onContinue(name.trim());
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#111", // mesma cor de fundo do game
        color: "white",
      }}
    >
      <h1>Insira seu nome ou ID</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome..."
        style={{ padding: "8px", fontSize: "16px", marginRight: "10px" }}
      />
      <button onClick={handleSubmit} style={{ padding: "8px 16px", fontSize: "16px" }}>
        Registrar
      </button>
    </div>
  );
};

export default RegisterMenu;
