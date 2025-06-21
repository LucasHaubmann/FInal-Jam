// GameCanva.tsx
import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { sketch } from "./game/core/sketch";
import { io } from "socket.io-client";

type GameCanvasProps = {
  levelName: string;
  onExit: () => void;
  onVictory: () => void;
};

const GameCanvas: React.FC<GameCanvasProps> = ({ levelName, onExit, onVictory }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<any>(null);

  useEffect(() => {
    // Inicializa o socket
    socketRef.current = io("http://localhost:3000");

    // Cria o sketch com socket e callback de vitória
    const wrappedSketch = (p: p5) => sketch(p, onVictory, socketRef.current);
    const instance = new p5(wrappedSketch, sketchRef.current!);

    return () => {
      // Cleanup: remove canvas e desconecta socket
      instance.remove();
      socketRef.current?.disconnect();
    };
  }, [levelName, onVictory]);

  return (
  <div
  id="sketch-container"
  ref={sketchRef}
  style={{
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "black", // opcional para prevenir branco atrás
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
