import p5 from "p5";
import { GameLoop } from "./GameLoop";

let gameLoop: GameLoop;

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(800, 400);
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
