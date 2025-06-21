import React, { useState } from "react";

type RegisterMenuProps = {
  onContinue: (name: string) => void;
};

const RegisterMenu: React.FC<RegisterMenuProps> = ({ onContinue }) => {
  const [name, setName] = useState("");

  const handleContinue = () => {
    if (name.trim()) {
      onContinue(name.trim());
    } else {
      alert("Por favor, digite um nome para continuar.");
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
        backgroundColor: "#111",
        color: "white",
        gap: "20px",
      }}
    >
      <h1>Bem-vindo!</h1>
      <p>Digite seu nome para começar:</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome"
        style={{
          padding: "10px",
          fontSize: "16px",
          borderRadius: "5px",
          border: "1px solid #ccc",
          textAlign: "center"
        }}
      />
      <button
        onClick={handleContinue}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        Continuar
      </button>
    </div>
  );
};

export default RegisterMenu;