import p5 from "p5";
import { GameLoop } from "./GameLoop";
import { Socket } from "socket.io-client";

let paused = false;

export const setPaused = (value: boolean) => {
  paused = value;
};

export const sketch = (p: p5, onVictory: () => void, socket: Socket, levelName: string) => {
  let gameLoop: GameLoop | undefined;

  console.log("Sketch carregado!");

  p.setup = () => {
    paused = false;
    const canvas = p.createCanvas(1280, 720);
    canvas.parent("sketch-container");
    p.background(20);

    // ✅ CSS PARA CENTRALIZAR O CANVAS
    // Define o canvas para ser posicionado de forma absoluta em relação ao contêiner.
    canvas.style("position", "absolute");
    // Move o topo do canvas para 50% da altura do contêiner.
    canvas.style("top", "50%");
    // Move a esquerda do canvas para 50% da largura do contêiner.
    canvas.style("left", "50%");
    // Translada o canvas em -50% de sua própria largura e altura para centralizá-lo.
    canvas.style("transform", "translate(-50%, -50%)");

    gameLoop = new GameLoop(p, onVictory, socket, levelName);
  };

  p.draw = () => {
    if (paused || !gameLoop) {
      return;
    }
    gameLoop.update();
    gameLoop.render();
  }

  p.keyPressed = () => {
    if (gameLoop) {
      gameLoop.handleKey(p.key);
    }
  };
};