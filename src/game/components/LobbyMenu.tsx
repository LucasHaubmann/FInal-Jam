import React, { useState } from 'react';

// As props que este componente vai receber do App.tsx
type LobbyMenuProps = {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: () => void;
  onBack: () => void;
};

const LobbyMenu: React.FC<LobbyMenuProps> = ({ onJoinRoom, onCreateRoom, onBack }) => {
  const [roomIdInput, setRoomIdInput] = useState('');

  // Estilos (podemos refinar depois)
  const styles: { [key: string]: React.CSSProperties } = {
    container: { height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' },
    title: { fontFamily: "'Orbitron', sans-serif", fontSize: '3rem', color: '#ff00ff', textShadow: "0 0 10px #ff00ff" },
    inputGroup: { display: 'flex', gap: '10px', margin: '2rem 0' },
    input: { padding: '10px', width: '200px', backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid #ff00ff', color: 'white' },
    button: { padding: '10px 20px', cursor: 'pointer', border: '1px solid', color: 'white' },
    joinButton: { borderColor: '#ff00ff', backgroundColor: 'rgba(255,0,255,0.2)' },
    createButton: { borderColor: '#00f6ff', backgroundColor: 'rgba(0,246,255,0.2)', width: '100%' },
    backButton: { background: 'none', border: 'none', color: '#506080', marginTop: '2rem', cursor: 'pointer' },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Multiplayer Matrix</h1>
      <div style={styles.inputGroup}>
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
          style={styles.input}
        />
        <button 
          onClick={() => roomIdInput && onJoinRoom(roomIdInput)}
          style={{...styles.button, ...styles.joinButton}}
        >
          Join Room
        </button>
      </div>
      <p>OR</p>
      <div style={{width: '320px', marginTop: '1rem'}}>
        <button onClick={onCreateRoom} style={{...styles.button, ...styles.createButton}}>
          Create New Room
        </button>
      </div>
      <button onClick={onBack} style={styles.backButton}>[ Back to Main Menu ]</button>
    </div>
  );
};

export default LobbyMenu;