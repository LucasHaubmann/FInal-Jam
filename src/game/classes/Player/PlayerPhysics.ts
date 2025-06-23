import { PlayerConfig } from "./PlayerConfig";
import { PlayerState } from "./PlayerState";

export class PlayerPhysics {
  vy = 0;
  vx: number = 0;
  state: PlayerState = PlayerState.Idle;
  
  // ✅ NOVO: Velocidade máxima de queda para evitar "tunneling"
  private terminalVelocity = 20; 

  applyGravity(y: number): number {
    if (this.state === PlayerState.Idle || this.state === PlayerState.Death) return y;
    
    this.vy += PlayerConfig.gravity;

    // ✅ Aplica o limite de velocidade terminal
    if (this.vy > this.terminalVelocity) {
        this.vy = this.terminalVelocity;
    }

    return y + this.vy;
  }

  jump(currentState: PlayerState, jumpForce: number): number {
    if (currentState === PlayerState.Idle) {
      this.vy = jumpForce;
      this.state = PlayerState.Jumping;
    }
    return this.vy;
  }

  updateState(y: number): void {
    if (this.state === PlayerState.Death) return; 

    if (y >= PlayerConfig.groundY || this.vy === 0) {
      if(this.state !== PlayerState.Idle) this.state = PlayerState.Idle;
    } else if (this.vy > 0) {
      if(this.state !== PlayerState.Falling) this.state = PlayerState.Falling;
    }
  }

  setFallingIfNoGround(isGrounded: boolean) {
    if (!isGrounded && this.state === PlayerState.Idle) {
      this.state = PlayerState.Falling;
    }
  }
}
