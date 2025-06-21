import { PlayerConfig } from "./PlayerConfig";
import { PlayerState } from "./PlayerState";
import { PlayerPhysics } from "./PlayerPhysics";
import { Obstacle } from "../Obstacles/Obstacle";
import { isPlayerOnGround } from "../../core/CollisionSystem";
import type { ItemType } from "../Item/Item"; // ✅ Importa o tipo do item
 // ✅ Importa o tipo do item

export class Player {
  x: number;
  y: number;
  physics: PlayerPhysics;
  grounded: boolean = false;
  isOnRamp: boolean = false;
  
  // ✅ O "inventário" do jogador. Só pode ter um item (ou nenhum).
  public heldItem: ItemType | null = null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.physics = new PlayerPhysics();
  }

  update(obstacles: Obstacle[]) {
    if (this.physics.state === PlayerState.Death) return;

    this.y = this.physics.applyGravity(this.y);
    this.physics.updateState(this.y);

    if (this.y >= PlayerConfig.groundY) {
      this.y = PlayerConfig.groundY;
      this.physics.vy = 0;
      this.grounded = true;
      this.physics.state = PlayerState.Idle;
      return;
    }

    this.grounded = isPlayerOnGround(this, obstacles);

    if (!this.grounded && this.physics.state === PlayerState.Idle) {
      this.physics.state = PlayerState.Falling;
    }
  }

  jump() {
    this.physics.jump(this.physics.state);
  }
}
