import { PlayerConfig } from "./PlayerConfig";
import { PlayerState } from "./PlayerState";

export class PlayerPhysics {
  vy = 0;
  vx: number = 0;
  state: PlayerState = PlayerState.Idle;

  applyGravity(y: number): number {
  if (this.state === PlayerState.Idle) return y;
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
  if (y >= PlayerConfig.groundY || this.vy === 0) {
    this.state = PlayerState.Idle;
  } else if (this.vy > 0) {
    this.state = PlayerState.Falling;
    }
  }

setFallingIfNoGround(isGrounded: boolean) {
  if (!isGrounded && this.state === PlayerState.Idle) {
    this.state = PlayerState.Falling;
  }
}


}
