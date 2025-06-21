import { Player } from "./Player";
import { PlayerState } from "./PlayerState";

export class PlayerLifeSystem {
  static initialX = 0;
  static initialY = 0;

  static handleDeath(player: Player): boolean {
    if (player.physics.state === PlayerState.Death) {
      player.x = PlayerLifeSystem.initialX;
      player.y = PlayerLifeSystem.initialY;
      player.physics.vx = 0;
      player.physics.vy = 0;
      player.physics.state = PlayerState.Idle;
      
      // ✅ Reseta também o item que o jogador estava a segurar
      player.heldItem = null;

      return true;
    }
    return false;
  }

  static setInitialPosition(x: number, y: number) {
    PlayerLifeSystem.initialX = x;
    PlayerLifeSystem.initialY = y;
  }
}
