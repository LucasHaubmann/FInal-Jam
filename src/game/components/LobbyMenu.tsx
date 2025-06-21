import React, { useState } from 'react';

type LobbyMenuProps = {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
  onBack: () => void;
};

const LobbyMenu: React.FC<LobbyMenuProps> = ({ onJoinRoom, onCreateRoom, onBack }) => {
  const [roomIdInput, setRoomIdInput] = useState('');

  const styles: { [key: string]: React.CSSProperties } = {
    container: { height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px", color: 'white' },
    title: { fontFamily: "'Orbitron', sans-serif", fontSize: "3rem", color: "#00f6ff", textShadow: "0 0 10px #00f6ff", marginBottom: "3rem" },
    inputGroup: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: "1.5rem", width: '400px' },
    input: { fontFamily: "'Chakra Petch', sans-serif", fontSize: '1.2rem', padding: '15px', width: '100%', backgroundColor: 'transparent', border: '2px solid #304060', color: '#a0a0c0', textAlign: 'center', outline: 'none', transition: 'border-color 0.3s' },
    button: { fontFamily: "'Chakra Petch', sans-serif", fontSize: "1.2rem", fontWeight: "bold", padding: '15px', cursor: "pointer", width: '100%', transition: 'all 0.2s ease', border: '2px solid' },
    joinButton: { color: '#ff00ff', borderColor: '#ff00ff', backgroundColor: 'transparent' },
    createButton: { color: '#00f6ff', borderColor: '#00f6ff', backgroundColor: 'transparent' },
    backButton: { fontFamily: "'Chakra Petch', sans-serif", marginTop: "3rem", background: "none", border: "none", color: "#506080", fontSize: "1rem", cursor: "pointer", textTransform: "uppercase" },
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#ff00ff';
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#304060';
  
  // ✅ Cores para o efeito de hover
  const joinColor = '#ff00ff';
  const createColor = '#00f6ff';
  const darkBackgroundColor = '#0a0a14';

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Multiplayer Node</h1>
      <div style={styles.inputGroup}>
        <input type="text" placeholder="ROOM ID" value={roomIdInput} onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())} style={styles.input} onFocus={handleFocus} onBlur={handleBlur} />
        
        {/* ✅ Botão de Entrar com efeito de hover */}
        <button
          onClick={() => roomIdInput && onJoinRoom(roomIdInput)}
          style={{...styles.button, ...styles.joinButton}}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = joinColor;
            e.currentTarget.style.color = darkBackgroundColor;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = joinColor;
          }}
        >
          Join Room
        </button>

        <p style={{color: '#506080', margin: '0'}}>OR</p>

        {/* ✅ Botão de Criar com efeito de hover */}
        <button
          onClick={onCreateRoom}
          style={{...styles.button, ...styles.createButton}}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = createColor;
            e.currentTarget.style.color = darkBackgroundColor;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = createColor;
          }}
        >
          Create Private Room
        </button>
      </div>
      <button onClick={onBack} style={styles.backButton}>[ Disconnect ]</button>
    </div>
  );
};

export default LobbyMenu;