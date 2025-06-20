import { Player } from "../classes/Player/Player";
import { Obstacle } from "../classes/Obstacles/Obstacle";
import { ObstacleBlock } from "../classes/Obstacles/ObstacleBlock";
import { PlayerConfig } from "../classes/Player/PlayerConfig";
import { PlayerState } from "../classes/Player/PlayerState";

export function resolvePlayerPlatformCollision(player: Player, obstacles: Obstacle[]) {
  let topY: number | null = null;

  for (const obs of obstacles) {
    if (typeof obs.checkVerticalCollision !== "function") continue;
    if (obs instanceof ObstacleBlock) continue;

    const y = obs.checkVerticalCollision(
      player.x, player.y,
      PlayerConfig.width, PlayerConfig.height,
      player.physics.vy
    );

    if (y !== null) {
      topY = topY === null ? y : Math.min(y, topY);
    }
  }

  if (topY !== null) {
    player.y = topY - PlayerConfig.height;
    player.physics.vy = 0;
    player.physics.state = PlayerState.Idle;
  }
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
