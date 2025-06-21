import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { sketch } from "./game/core/sketch";
import { Socket } from "socket.io-client";

type GameCanvasProps = {
  levelName: string; // <-- Precisa receber levelName
  onExit: () => void;
  onVictory: () => void;
  socket: Socket;
};

const GameCanvas: React.FC<GameCanvasProps> = ({ levelName, onExit, onVictory, socket }) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sketchRef.current) {
      sketchRef.current.innerHTML = "";
    }

    // ✅ AQUI: Passamos o `levelName` para a função sketch
    const wrappedSketch = (p: p5) => sketch(p, onVictory, socket, levelName);
    const p5Instance = new p5(wrappedSketch, sketchRef.current!);

    return () => {
      p5Instance.remove();
    };
    // Adicionamos levelName como dependência para garantir a recriação se ele mudar
  }, [levelName]); 

  return (
    <div
      id="sketch-container"
      ref={sketchRef}
      style={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "black",
      }}
    >
      <button
        onClick={onExit}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          padding: "10px 20px",
        }}
      >
        Voltar
      </button>
    </div>
  );
};

export default GameCanvas;