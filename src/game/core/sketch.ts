import p5 from "p5";
import { GameLoop } from "./GameLoop";

let gameLoop: GameLoop;

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(1280, 720); // Novo tamanho
    p.frameRate(60); // <- Limita para 60 FPS
    gameLoop = new GameLoop(p);
  };

  p.draw = () => {
    gameLoop.update();
    gameLoop.render();
  };

  p.keyPressed = () => {
    gameLoop.handleKey(p.key);
  };
};
