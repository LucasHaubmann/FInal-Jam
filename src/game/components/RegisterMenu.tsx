import React, { useState } from "react";

const RegisterMenu: React.FC<{ onContinue: (name: string) => void }> = ({ onContinue }) => {
  const [name, setName] = useState("");

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backdropFilter: "blur(5px)",
      textAlign: "center",
      padding: "20px",
    },
    title: {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "3.5rem",
      color: "#00f6ff",
      textShadow: "0 0 5px #00f6ff, 0 0 10px #00f6ff, 0 0 20px #00a1a6",
      marginBottom: "1rem",
    },
    subtitle: {
      fontSize: "1.2rem",
      color: "#a0a0c0",
      marginBottom: "2rem",
    },
    input: {
      fontFamily: "'Chakra Petch', sans-serif",
      width: "300px",
      padding: "15px",
      fontSize: "1rem",
      backgroundColor: "rgba(10, 30, 60, 0.5)",
      border: "2px solid #00f6ff",
      borderRadius: "5px",
      color: "#e0e0e0",
      textAlign: "center",
      outline: "none",
      transition: "all 0.3s ease",
      boxShadow: "inset 0 0 10px rgba(0, 246, 255, 0.3)",
    },
    button: {
      fontFamily: "'Orbitron', sans-serif",
      marginTop: "2rem",
      padding: "15px 40px",
      fontSize: "1.2rem",
      fontWeight: "bold",
      color: "#0a0a14",
      backgroundColor: "#00f6ff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      textTransform: "uppercase",
      boxShadow: "0 0 10px #00f6ff, 0 0 20px #00f6ff, 0 0 30px #00a1a6",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>SYSTEM LOGIN</h1>
      <p style={styles.subtitle}>USER AUTHENTICATION REQUIRED</p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="ENTER YOUR DESIGNATION"
        style={styles.input}
        onFocus={(e) => (e.currentTarget.style.boxShadow = "inset 0 0 15px rgba(0, 246, 255, 0.7), 0 0 15px rgba(0, 246, 255, 0.5)")}
        onBlur={(e) => (e.currentTarget.style.boxShadow = "inset 0 0 10px rgba(0, 246, 255, 0.3)")}
      />
      <button
        onClick={() => name.trim() && onContinue(name.trim())}
        style={styles.button}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#9effff")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#00f6ff")}
      >
        Authorize
      </button>
    </div>
  );
};

export default RegisterMenu;