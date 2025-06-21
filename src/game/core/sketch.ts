import p5 from "p5";
import { GameLoop } from "./GameLoop";
import { Socket } from "socket.io-client";

let paused = false;

export const setPaused = (value: boolean) => {
  paused = value;
};

// ✅ 1. A função agora aceita o parâmetro `roomId`
export const sketch = (p: p5, onVictory: () => void, socket: Socket, levelName: string, roomId: string | null) => {
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

    // ✅ 2. Passa o `roomId` para o construtor do GameLoop
    gameLoop = new GameLoop(p, onVictory, socket, levelName, roomId);
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