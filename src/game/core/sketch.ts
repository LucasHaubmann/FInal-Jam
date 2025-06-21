// src/game/core/sketch.ts
import p5 from "p5";
import { GameLoop } from "./GameLoop";
import { Socket } from "socket.io-client";

export const sketch = (p: p5, onVictory: () => void, socket: Socket) => {
  let gameLoop: GameLoop;

  console.log("Sketch carregado!");

  p.setup = () => {
    // Cria o canvas e define o contêiner correto
    const canvas = p.createCanvas(1280, 720);
    canvas.parent("sketch-container");

    // ✅ Estilização precisa para centralizar
    canvas.style("position", "absolute");
    canvas.style("top", "50%");
    canvas.style("left", "50%");
    canvas.style("transform", "translate(-50%, -50%)");
    canvas.style("z-index", "0");


    // Inicializa o loop do jogo com o socket
    gameLoop = new GameLoop(p, onVictory, socket);
  };

  p.draw = () => {
    gameLoop.update();
    gameLoop.render();
  };

  p.keyPressed = () => {
    gameLoop.handleKey(p.key);
  };
};
