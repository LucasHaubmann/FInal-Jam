import p5 from "p5";
import { GameLoop } from "./GameLoop";

export const sketch = (p: p5, onVictory: () => void) => {
  let gameLoop: GameLoop;

  console.log("Sketch carregado!");

  p.setup = () => {
    p.createCanvas(1280, 720);
    gameLoop = new GameLoop(p, onVictory);
  };

  p.draw = () => {
    gameLoop.update();
    gameLoop.render();
  };

  p.keyPressed = () => {
    gameLoop.handleKey(p.key);
  };
};
