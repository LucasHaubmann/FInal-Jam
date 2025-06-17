import { PlayerConfig } from "./PlayerConfig";
import { PlayerState } from "./PlayerState";
import { PlayerPhysics } from "./PlayerPhysics";

export class Player {
  x: number;
  y: number;
  physics: PlayerPhysics;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.physics = new PlayerPhysics();
  }

  update() {
    this.x += PlayerConfig.speedX;

    this.y = this.physics.applyGravity(this.y);
    this.physics.updateState(this.y);

    if (this.y >= PlayerConfig.groundY) {
      this.y = PlayerConfig.groundY;
    }
  }

  jump() {
    this.physics.jump(this.physics.state);
  }
}
