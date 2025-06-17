import p5 from "p5";
import { Player } from "../classes/Player/Player";
import { PlayerConfig } from "../classes/Player/PlayerConfig";

let player: Player;

export const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(800, 400);
    player = new Player(100, PlayerConfig.groundY);
  };

  p.draw = () => {
    p.background(0);

    player.update();

    // Render do player (feito aqui, já que não há mais um PlayerRenderer)
    p.fill(255);
    p.rect(player.x, player.y, PlayerConfig.width, PlayerConfig.height);

  };

  p.keyPressed = () => {
    if (p.key === ' ') {
      player.jump();
    }
  };
};
