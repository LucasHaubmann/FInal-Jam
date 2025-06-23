import p5 from "p5";
import { PlayerConfig } from "./PlayerConfig";
import { PlayerState } from "./PlayerState";
import { PlayerPhysics } from "./PlayerPhysics";
import { Obstacle } from "../Obstacles/Obstacle";
import { isPlayerOnGround } from "../../core/CollisionSystem";
import type { ItemType } from "../Item/Item";

export class Player {
  x: number;
  y: number;
  physics: PlayerPhysics;
  grounded: boolean = false;
  isOnRamp: boolean = false;
  
  public heldItem: ItemType | null = null;
  private elixirTimer: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.physics = new PlayerPhysics();
  }

  public applyItem(itemType: ItemType): void {
    if (itemType === 'elixir_item') {
      this.elixirTimer = PlayerConfig.elixirDuration;
    } else {
      this.heldItem = itemType;
    }
  }
  
  // ✅ NOVO: Método para matar o jogador
  public die(): void {
    if (this.physics.state !== PlayerState.Death) {
        this.physics.state = PlayerState.Death;
    }
  }

  // ✅ REMOVIDO: Bónus de velocidade removido
  public getCurrentSpeed(): number {
      return PlayerConfig.speedX;
  }

  update(p: p5, obstacles: Obstacle[]) {
    const delta = p.deltaTime;

    if (this.elixirTimer > 0) this.elixirTimer -= delta;
    
    if (this.physics.state === PlayerState.Death) return;

    this.y = this.physics.applyGravity(this.y);
    this.physics.updateState(this.y);

    if (this.y >= PlayerConfig.groundY) {
      this.y = PlayerConfig.groundY;
      this.physics.vy = 0;
      this.grounded = true;
      this.physics.state = PlayerState.Idle;
    } else {
        this.grounded = isPlayerOnGround(this, obstacles);
    }
    
    if (!this.grounded && this.physics.state === PlayerState.Idle) {
      this.physics.state = PlayerState.Falling;
    }
  }

  jump() {
    const jumpForce = this.elixirTimer > 0 
        ? PlayerConfig.jumpForce * PlayerConfig.elixirJumpMultiplier
        : PlayerConfig.jumpForce;
    this.physics.jump(this.physics.state, jumpForce);
  }

  renderEffect(p: p5, camX: number) {
      if (this.elixirTimer > 0) {
          p.push();
          p.noStroke();
          const alpha = p.map(this.elixirTimer, 0, PlayerConfig.elixirDuration, 0, 100);
          p.fill(0, 255, 150, alpha);
          p.ellipse(this.x - camX + PlayerConfig.width / 2, this.y + PlayerConfig.height / 2, PlayerConfig.width + 15, PlayerConfig.height + 15);
          p.pop();
      }
  }
}
