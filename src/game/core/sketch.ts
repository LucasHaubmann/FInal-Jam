// src/game/core/sketch.ts
import p5 from "p5";
import { GameLoop } from "./GameLoop";
import { Socket } from "socket.io-client"; // Importar Socket

export const sketch = (p: p5, onVictory: () => void, socket: Socket) => { // Adicionar 'socket' como parâmetro
  let gameLoop: GameLoop;

  console.log("Sketch carregado!");

  p.setup = () => {
    p.createCanvas(1280, 720);
    gameLoop = new GameLoop(p, onVictory, socket); // Passar o socket para o GameLoop
  };

  p.draw = () => {
    gameLoop.update();
    gameLoop.render();
  };

  p.keyPressed = () => {
    gameLoop.handleKey(p.key);
  };
};