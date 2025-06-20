// src/game/classes/Player/PlayerLifeSystem.ts

import { Player } from "./Player";
import { PlayerState } from "./PlayerState";
import { PlayerConfig } from "./PlayerConfig";

export class PlayerLifeSystem {
  static initialX = 0;
  static initialY = 0;

  static handleDeath(player: Player) {
    if (player.physics.state === PlayerState.Death) {
      // Reinicia posição
      player.x = PlayerLifeSystem.initialX;
      player.y = PlayerLifeSystem.initialY;

      // Reinicia velocidades
      player.physics.vx = 0;
      player.physics.vy = 0;

      // Reinicia estado
      player.physics.state = PlayerState.Idle;
    }
  }

  static setInitialPosition(x: number, y: number) {
    PlayerLifeSystem.initialX = x;
    PlayerLifeSystem.initialY = y;
  }
}
