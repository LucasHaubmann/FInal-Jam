// src/GameCanva.tsx
import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { sketch } from "./game/core/sketch";
import { io, Socket } from "socket.io-client"; // Importar io e Socket

type GameCanvasProps = {
  levelName: string;
  onExit: () => void;
  onVictory: () => void;
};

const GameCanvas: React.FC<GameCanvasProps> = ({ levelName, onExit, onVictory }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null); // Referência para o socket

  useEffect(() => {
    // Inicializa a conexão Socket.IO
    // Ajuste a URL para o endereço do seu servidor Node.js/Express
    socketRef.current = io("http://localhost:3000"); //

    socketRef.current.on("connect", () => { //
      console.log("Conectado ao servidor Socket.IO!"); //
    });

    socketRef.current.on("disconnect", () => { //
      console.log("Desconectado do servidor Socket.IO!"); //
    });

    // Passa o socket para o sketch P5.js
    const wrappedSketch = (p: p5) => sketch(p, onVictory, socketRef.current!);
    const p5Instance = new p5(wrappedSketch, sketchRef.current!);

    return () => {
      p5Instance.remove();
      if (socketRef.current) {
        socketRef.current.disconnect(); // Desconecta o socket ao desmontar o componente
      }
    };
  }, [levelName, onVictory]);

  return (
    <div
      style={{
        backgroundColor: "#121212",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "relative",
      }}
    >
     <div
  ref={sketchRef}
  style={{
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1000,
  }}
/>

      {/* Botão para sair do jogo */}
      <button
        onClick={onExit}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px 16px",
          fontSize: "14px",
          backgroundColor: "#ff4444",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Voltar ao menu
      </button>
    </div>
  );
};

export default GameCanvas;