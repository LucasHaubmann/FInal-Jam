import { Player } from "../classes/Player/Player";
import { Obstacle } from "../classes/Obstacles/Obstacle";
import { ObstacleBlock } from "../classes/Obstacles/ObstacleBlock";
import { PlayerConfig } from "../classes/Player/PlayerConfig";
import { PlayerState } from "../classes/Player/PlayerState";
import { ObstacleRamp } from "../classes/Obstacles/ObstacleRamp";

export function resolvePlayerPlatformCollision(player: Player, obstacles: Obstacle[]) {
  let topY: number | null = null;
  let isOnRamp = false; // flag temporária para definir se está numa rampa

  for (const obs of obstacles) {
    if (typeof obs.checkVerticalCollision !== "function") continue;

    const y = obs.checkVerticalCollision(
      player.x, player.y,
      PlayerConfig.width, PlayerConfig.height,
      player.physics.vy
    );

    if (y !== null) {
      if (obs instanceof ObstacleRamp) isOnRamp = true;
      topY = topY === null ? y : Math.min(y, topY);
    }
  }

  // Atualiza posição e estado
  if (topY !== null) {
    player.y = topY - PlayerConfig.height;
    player.physics.vy = 0;
    player.physics.state = PlayerState.Idle;
  }

  // Atualiza a flag de rampa
  player.isOnRamp = isOnRamp;
}

export function isPlayerOnGround(player: Player, obstacles: Obstacle[]): boolean {
  return obstacles.some(obs => {
    const playerBottom = player.y + PlayerConfig.height;
    const playerBottomCenterX = player.x + PlayerConfig.width / 2;

    if (typeof obs.getTopYAt !== "function") return false;

    const topY = obs.getTopYAt(playerBottomCenterX);
    if (topY === null) return false;

    return Math.abs(playerBottom - topY) < 2;
  });
}
