import p5 from "p5";
import Player from "..//classes/Player";

let player: Player;


const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(800, 600);
    player = new Player(p.width / 2, p.height / 2, p);
  };

  p.draw = () => {
    p.background(20);
    player.update(p);
    player.display(p);
  };
};

export default sketch;
