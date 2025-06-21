import React, { useRef, useEffect } from "react";
import p5 from "p5";
import { sketch } from "./game/core/sketch";
import { Socket } from "socket.io-client"; // Importe o tipo Socket

type GameCanvasProps = {
  levelName: string;
  onExit: () => void;
  onVictory: () => void;
  socket: Socket; // ✅ Recebe o socket via props
};

const GameCanvas: React.FC<GameCanvasProps> = ({ levelName, onExit, onVictory, socket }) => {
  const sketchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Garante que a div está limpa antes de criar um novo canvas
    if (sketchRef.current) {
      sketchRef.current.innerHTML = "";
    }

    // A função de sketch agora recebe o socket que veio do App.tsx
    const wrappedSketch = (p: p5) => sketch(p, onVictory, socket);
    const p5Instance = new p5(wrappedSketch, sketchRef.current!);

    // ✅ A função de limpeza agora SÓ remove o canvas.
    // Ela NÃO desconecta mais o socket, pois o App.tsx gerencia isso.
    return () => {
      p5Instance.remove();
    };
  }, [levelName]); // A dependência pode ser só levelName ou vazia, já que a key no App.tsx força a remontagem total.

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
        onClick={onExit} // O onExit agora é o handleBackToMenu
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 10,
          padding: "10px 20px",
          backgroundColor: "#4A5568",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Sair
      </button>
    </div>
  );
};

export default GameCanvas;