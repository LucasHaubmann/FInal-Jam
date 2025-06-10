import p5 from "p5";
import Player from "../classes/Player";

let player: Player;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(1280, 720);
    player = new Player(p.width / 2, p.height / 2, p);
  };

  p.draw = () => {
    p.background(20);
    player.update();
    player.display();
  };

p.keyPressed = () => {
  player.handleKeyPressed(p.key.toLowerCase(), p.keyCode);
};

  p.keyReleased = () => {
    player.handleKeyReleased(p.key.toLowerCase(), p.keyCode);
  };
};

export default sketch;
