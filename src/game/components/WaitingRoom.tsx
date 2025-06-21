import React, { useState } from 'react';

type Player = { id: string; name: string; color: string; };

type WaitingRoomProps = {
  isHost: boolean;
  roomId: string;
  players: Player[];
  onStartGame: () => void;
  onSelectMap: (mapId: string) => void;
  onBack: () => void;
};

const WaitingRoom: React.FC<WaitingRoomProps> = ({ isHost, roomId, players, onStartGame, onSelectMap, onBack }) => {
  const [selectedMap, setSelectedMap] = useState('level1');

  const handleMapChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMapId = event.target.value;
    setSelectedMap(newMapId);
    if (isHost) {
      onSelectMap(newMapId); // Apenas o host notifica o servidor sobre a mudança
    }
  };
  
  // Estilos no tema cyberpunk
  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "20px",
      color: 'white',
      fontFamily: "'Chakra Petch', sans-serif"
    },
    title: {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "2.5rem",
      color: "#e0e0e0",
      textTransform: 'uppercase',
    },
    roomIdLabel: {
      color: '#a0a0c0',
      fontSize: '1.2rem',
      marginTop: '2rem'
    },
    roomId: {
      fontFamily: "'Orbitron', sans-serif",
      color: '#ff00ff',
      textShadow: "0 0 10px #ff00ff",
      fontSize: '2rem',
      letterSpacing: '4px',
      border: '1px solid #ff00ff',
      padding: '10px 20px',
      margin: '10px 0 30px 0',
      backgroundColor: 'rgba(255, 0, 255, 0.1)'
    },
    playersContainer: {
      width: '450px',
      padding: '20px',
      border: '1px solid #304060',
      minHeight: '150px',
      backgroundColor: 'rgba(10, 20, 40, 0.5)'
    },
    playersTitle: {
      margin: '0 0 15px 0',
      textAlign: 'center',
      color: '#a0a0c0'
    },
    playerList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    playerItem: {
      fontWeight: 'bold',
      marginBottom: '10px',
      fontSize: '1.2rem'
    },
    hostControls: {
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '15px',
      width: '450px'
    },
    selectLabel: {
      color: '#a0a0c0'
    },
    select: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#0a0a14',
      border: '2px solid #00f6ff',
      color: 'white',
      fontFamily: "'Chakra Petch', sans-serif",
      fontSize: '1rem',
      textAlign: 'center',
      cursor: 'pointer'
    },
    startButton: {
      fontFamily: "'Orbitron', sans-serif",
      fontSize: "1.2rem",
      fontWeight: "bold",
      padding: '15px',
      cursor: "pointer",
      width: '100%',
      color: '#0a0a14',
      backgroundColor: '#00f6ff',
      border: '2px solid #00f6ff',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase'
    },
    waitingText: {
      marginTop: '30px',
      color: '#a0a0c0',
      fontSize: '1.2rem'
    },
    backButton: {
      marginTop: '40px',
      background: "none",
      border: "none",
      color: "#506080",
      cursor: "pointer",
      textTransform: 'uppercase'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sala de Espera</h1>
      <p style={styles.roomIdLabel}>ID DA SALA (COMPARTILHE):</p>
      <div style={styles.roomId}>{roomId}</div>
      
      <div style={styles.playersContainer}>
        <h3 style={styles.playersTitle}>Jogadores na Sala ({players.length}/4):</h3>
        <ul style={styles.playerList}>
          {players.map((p, index) => <li key={p.id} style={{ ...styles.playerItem, color: p.color }}>{`> ${p.name}`} {index === 0 ? '(Host)' : ''}</li>)}
        </ul>
      </div>

      {isHost ? (
        <div style={styles.hostControls}>
          <label htmlFor="map-select" style={styles.selectLabel}>SELECIONAR NÓ DE INTRUSÃO:</label>
          <select id="map-select" value={selectedMap} onChange={handleMapChange} style={styles.select}>
            <option style={{backgroundColor: '#0a0a14'}} value="level1">Data Stream Alpha</option>
            <option style={{backgroundColor: '#0a0a14'}} value="level2">Sector 7G Intrusion</option>
            <option style={{backgroundColor: '#0a0a14'}} value="level3">Mainframe Core</option>
          </select>
          <button onClick={onStartGame} style={styles.startButton}>Iniciar Partida</button>
        </div>
      ) : (
        <p style={styles.waitingText}>Aguardando o host iniciar a partida...</p>
      )}
      
      <button onClick={onBack} style={styles.backButton}>[ Sair da Sala ]</button>
    </div>
  );
};

export default WaitingRoom;
