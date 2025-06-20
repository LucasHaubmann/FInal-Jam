import { PlayerConfig } from "./PlayerConfig";
import { PlayerState } from "./PlayerState";
import { PlayerPhysics } from "./PlayerPhysics";
import { Obstacle } from "../Obstacles/Obstacle";
import { isPlayerOnGround } from "../../core/CollisionSystem";

export class Player {
  render(p: import("p5"), camX: number) {
    throw new Error("Method not implemented.");
  }
  x: number;
  y: number;
  physics: PlayerPhysics;
  grounded: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.physics = new PlayerPhysics();
  }

update(obstacles: Obstacle[]) {
  this.y = this.physics.applyGravity(this.y);
  this.physics.updateState(this.y);

  // 👉 Adiciona essa verificação antes de checar obstáculos
  if (this.y >= PlayerConfig.groundY) {
    this.y = PlayerConfig.groundY;
    this.physics.vy = 0;
    this.grounded = true;
    this.physics.state = PlayerState.Idle;
    return;
  }

  // Verifica chão de obstáculos
  this.grounded = isPlayerOnGround(this, obstacles);
  if (!this.grounded && this.physics.state === PlayerState.Idle) {
    this.physics.state = PlayerState.Falling;
  }
}

  jump() {
    this.physics.jump(this.physics.state);
  }
}
