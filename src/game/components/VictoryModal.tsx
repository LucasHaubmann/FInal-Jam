import React from "react";

// Tipo para os resultados
type RaceResult = {
  id: string;
  name: string;
  time: string;
};

// Novas props para o modal
type VictoryModalProps = {
  onReplay: () => void;
  onBackToMenu: () => void;
  finalTime: string | null;
  raceResults: RaceResult[];
  isMultiplayer: boolean;
};

const VictoryModal: React.FC<VictoryModalProps> = ({ onReplay, onBackToMenu, finalTime, raceResults, isMultiplayer }) => {
  const styles: { [key: string]: React.CSSProperties } = {
    backdrop: {
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      backgroundColor: "rgba(10, 20, 40, 0.5)", backdropFilter: "blur(8px)",
      display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100,
    },
    modalBox: {
      fontFamily: "'Chakra Petch', sans-serif", width: "clamp(350px, 60vw, 700px)",
      padding: "40px", backgroundColor: "rgba(10, 10, 20, 0.85)",
      border: "2px solid #00f6ff", borderRadius: "8px", textAlign: "center",
      boxShadow: "0 0 25px rgba(0, 246, 255, 0.6), inset 0 0 15px rgba(0, 246, 255, 0.3)",
    },
    title: {
      fontFamily: "'Orbitron', sans-serif", fontSize: "3rem", color: "#00f6ff",
      textShadow: "0 0 5px #00f6ff, 0 0 15px #00f6ff, 0 0 25px #00a1a6",
      marginBottom: "20px",
    },
    timeSection: {
        borderTop: '1px solid #304060', borderBottom: '1px solid #304060',
        padding: '20px 0', margin: '30px 0'
    },
    timeLabel: {
        fontSize: '1.2rem', color: '#a0a0c0', textTransform: 'uppercase'
    },
    timeValue: {
        fontFamily: "'Orbitron', sans-serif", fontSize: '2.5rem', color: '#ff00ff',
        textShadow: "0 0 8px #ff00ff"
    },
    resultsTable: {
        width: '100%', borderCollapse: 'collapse', marginTop: '10px'
    },
    tableHeader: {
        textAlign: 'left', color: '#a0a0c0', paddingBottom: '10px',
        borderBottom: '1px solid #304060'
    },
    tableRow: {
        textAlign: 'left',
    },
    tableCell: {
        padding: '8px 5px',
    },
    buttonContainer: {
      display: "flex", justifyContent: "center", gap: "20px", marginTop: "20px",
    },
    button: {
      fontFamily: "'Orbitron', sans-serif", flex: 1, padding: "15px 20px",
      fontSize: "1rem", fontWeight: "bold", border: "2px solid",
      borderRadius: "5px", cursor: "pointer", textTransform: "uppercase",
      transition: "all 0.3s ease",
    },
    replayButton: {
      color: "#0a0a14", backgroundColor: "#00f6ff", borderColor: "#00f6ff",
      boxShadow: "0 0 10px #00f6ff, 0 0 20px #00f6ff",
    },
    backButton: {
      color: "#ff00ff", backgroundColor: "transparent", borderColor: "#ff00ff",
    },
  };

  // Ordena os resultados pelo tempo
  const sortedResults = [...raceResults].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div style={styles.backdrop}>
      <div style={styles.modalBox}>
        <h1 style={styles.title}>OBJECTIVE CLEARED</h1>
        
        {/* Seção do tempo final */}
        {finalTime && (
            <div style={styles.timeSection}>
                <p style={styles.timeLabel}>Your Time</p>
                <p style={styles.timeValue}>{finalTime}</p>
            </div>
        )}

        {/* Seção de resultados do multiplayer */}
        {isMultiplayer && (
            <div>
                <h2 style={{color: '#e0e0e0'}}>Race Results</h2>
                <table style={styles.resultsTable}>
                    <thead>
                        <tr>
                            <th style={{...styles.tableHeader, width: '10%'}}>#</th>
                            <th style={{...styles.tableHeader, width: '60%'}}>Player</th>
                            <th style={{...styles.tableHeader, width: '30%', textAlign: 'right'}}>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedResults.map((result, index) => (
                            <tr key={result.id} style={styles.tableRow}>
                                <td style={styles.tableCell}>{index + 1}</td>
                                <td style={styles.tableCell}>{result.name}</td>
                                <td style={{...styles.tableCell, textAlign: 'right'}}>{result.time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}

        {/* Botões */}
        <div style={styles.buttonContainer}>
          <button
            onClick={onReplay}
            style={{ ...styles.button, ...styles.replayButton }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#9effff")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#00f6ff")}
          >
             {isMultiplayer ? 'Return to Lobby' : 'Re-Initialize'}
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