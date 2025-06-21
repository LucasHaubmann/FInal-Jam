import React, { useRef, useEffect } from 'react';
import p5 from 'p5';
import { sketch } from './game/core/sketch';
import { Socket } from 'socket.io-client';
import type { PlayerData } from './game/core/GameLoop'; // ✅ Importa o tipo do GameLoop

type GameCanvasProps = {
  levelName: string;
  roomId: string | null;
  initialPlayers: PlayerData[]; // ✅ Usa o tipo importado
  onExit: () => void;
  onVictory: () => void;
  socket: Socket;
};

const GameCanvas: React.FC<GameCanvasProps> = ({ levelName, roomId, initialPlayers, onExit, onVictory, socket }) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sketchRef.current) {
      sketchRef.current.innerHTML = '';
    }
    const wrappedSketch = (p: p5) => sketch(p, onVictory, socket, levelName, roomId, initialPlayers);
    const p5Instance = new p5(wrappedSketch, sketchRef.current!);
    
    return () => {
      p5Instance.remove();
    };
  }, [levelName, roomId]); // A lista inicial é passada apenas na criação do componente

  const mainContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
    backgroundColor: 'black',
  };

  const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '20px',
    left: '20px',
    zIndex: 10,
    fontFamily: "'Chakra Petch', sans-serif",
    fontSize: '1rem',
    padding: '10px 20px',
    cursor: 'pointer',
    color: '#ff4b4b',
    backgroundColor: 'rgba(25, 25, 35, 0.8)',
    border: '2px solid #ff4b4b',
    borderRadius: '5px',
    textTransform: 'uppercase',
    transition: 'all 0.3s ease',
  };

  return (
    <div style={mainContainerStyle}>
      <div id="sketch-container" ref={sketchRef} />
      <button
        onClick={onExit}
        style={buttonStyle}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#ff4b4b';
          e.currentTarget.style.color = '#0a0a14';
          e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 75, 75, 0.7)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(25, 25, 35, 0.8)';
          e.currentTarget.style.color = '#ff4b4b';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        Sair
      </button>
    </div>
  );
};

export default GameCanvas;
