import p5 from "p5";
import { GameLoop } from "./GameLoop"; // ✅ Importa o tipo do GameLoop
import type { PlayerData } from "./GameLoop";
import { Socket } from "socket.io-client";

let paused = false;

export const setPaused = (value: boolean) => {
  paused = value;
};

// ✅ Usa o tipo importado na assinatura da função
export const sketch = (p: p5, onVictory: () => void, socket: Socket, levelName: string, roomId: string | null, initialPlayers: PlayerData[]) => {
  let gameLoop: GameLoop | undefined;

  console.log("Sketch carregado!");

  p.setup = () => {
    paused = false;
    const canvas = p.createCanvas(1280, 720);
    canvas.parent("sketch-container");
    canvas.style("position", "absolute");
    canvas.style("top", "50%");
    canvas.style("left", "50%");
    canvas.style("transform", "translate(-50%, -50%)");
    p.background(20);

    // ✅ Passa a lista inicial para o construtor do GameLoop
    gameLoop = new GameLoop(p, onVictory, socket, levelName, roomId, initialPlayers);
  };

  p.draw = () => {
    if (paused || !gameLoop) return;
    gameLoop.update();
    gameLoop.render();
  }

  p.keyPressed = () => {
    if (gameLoop) {
      gameLoop.handleKey(p.key);
    }
  };
};
