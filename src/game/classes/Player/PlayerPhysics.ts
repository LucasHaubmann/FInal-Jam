import { PlayerConfig } from "./PlayerConfig";
import { PlayerState } from "./PlayerState";

export class PlayerPhysics {
  vy = 0;
  state: PlayerState = PlayerState.Idle;

  applyGravity(y: number): number {
    this.vy += PlayerConfig.gravity;
    return y + this.vy;
  }

  jump(currentState: PlayerState): number {
    if (currentState === PlayerState.Idle) {
      this.vy = PlayerConfig.jumpForce;
      this.state = PlayerState.Jumping;
    }
    return this.vy;
  }

  updateState(y: number): void {
    if (y >= PlayerConfig.groundY) {
      this.state = PlayerState.Idle;
      this.vy = 0;
    } else if (this.vy > 0) {
      this.state = PlayerState.Falling;
    }
  }
}
