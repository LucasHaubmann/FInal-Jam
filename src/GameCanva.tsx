import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { sketch } from "./game/core/sketch";
import { Socket } from "socket.io-client";

type GameCanvasProps = {
  levelName: string;
  roomId: string | null; // ✅ 1. Recebe a prop com o ID da sala
  onExit: () => void;
  onVictory: () => void;
  socket: Socket;
};

const GameCanvas: React.FC<GameCanvasProps> = ({ levelName, roomId, onExit, onVictory, socket }) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sketchRef.current) {
      sketchRef.current.innerHTML = "";
    }

    // ✅ 2. Passa o `roomId` para a função sketch
    const wrappedSketch = (p: p5) => sketch(p, onVictory, socket, levelName, roomId);
    const p5Instance = new p5(wrappedSketch, sketchRef.current!);

    return () => {
      p5Instance.remove();
    };
    // ✅ 3. Adiciona roomId como dependência para recriar se necessário
  }, [levelName, roomId]); 

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