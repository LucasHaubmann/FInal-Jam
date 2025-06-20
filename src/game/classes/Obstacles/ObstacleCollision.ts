// src/game/classes/Obstacles/ObstacleCollision.ts

import { Player } from "../Player/Player";
import { ObstacleBlock } from "./ObstacleBlock";
import { PlayerConfig } from "../Player/PlayerConfig";
import { PlayerState } from "../Player/PlayerState";

export class ObstacleCollision {
static checkTopCollision(
  px: number, py: number, pw: number, ph: number, vy: number,
  ox: number, oy: number, ow: number, oh: number
): number | null {
  const playerBottom = py + ph;
  const obstacleTop = oy;
  const horizontalOverlap = px + pw > ox && px < ox + ow;

  if (!horizontalOverlap) return null;

  // ✅ Aceita vy >= 0 (incluindo quando está parado sobre o bloco)
  if (vy >= 0 && playerBottom <= obstacleTop && playerBottom + vy >= obstacleTop) {
    return obstacleTop;
  }

  return null;
}


  static checkBottomCollision(
    px: number, py: number, pw: number, ph: number, vy: number,
    ox: number, oy: number, ow: number, oh: number
  ): number | null {
    const playerTop = py;
    const obstacleBottom = oy + oh;
    const horizontalOverlap = px + pw > ox && px < ox + ow;

    if (!horizontalOverlap) return null;

    if (vy < 0 && playerTop >= obstacleBottom && playerTop + vy <= obstacleBottom) {
      return obstacleBottom;
    }

    return null;
  }

  static checkLeftCollision(
    px: number, py: number, pw: number, ph: number, vx: number,
    ox: number, oy: number, ow: number, oh: number
  ): number | null {
    const playerRight = px + pw;
    const obstacleLeft = ox;
    const verticalOverlap = py + ph > oy && py < oy + oh;

    if (!verticalOverlap) return null;

    if (vx >= 0 && playerRight > obstacleLeft && px < obstacleLeft) {
      return obstacleLeft - pw;
    }

    return null;
  }

  static checkRightCollision(
    px: number, py: number, pw: number, ph: number, vx: number,
    ox: number, oy: number, ow: number, oh: number
  ): number | null {
    const playerLeft = px;
    const obstacleRight = ox + ow;
    const verticalOverlap = py + ph > oy && py < oy + oh;

    if (!verticalOverlap) return null;

    if (vx <= 0 && playerLeft < obstacleRight && px > obstacleRight) {
      return obstacleRight;
    }
    return null;
  }

  /**
   * Resolve todas as colisões do player com blocos (todos os lados)
   */
  static resolvePlayerBlockCollisions(player: Player, obstacles: ObstacleBlock[]) {
    const pw = PlayerConfig.width;
    const ph = PlayerConfig.height;
    let px = player.x;
    let py = player.y;
    let vx = player.physics.vx;
    let vy = player.physics.vy;

    for (const block of obstacles) {
      const ox = block.x;
      const oy = block.y;
      const ow = block.width;
      const oh = block.height;
      
      // Colisão lateral direita
      if (vx >= 0 && !player.isOnRamp) {
        const res = this.checkLeftCollision(px, py, pw, ph, vx, ox, oy, ow, oh);
        if (res !== null) {
          px = res;
          vx = 0;
        }
      }

      // Colisão lateral esquerda
      if (vx <= 0 && !player.isOnRamp) {
        const res = this.checkRightCollision(px, py, pw, ph, vx, ox, oy, ow, oh);
        if (res !== null) {
          px = res;
          vx = 0;
        }
      }

      // Colisão por cima
      if (vy >= 0) {
        const res = this.checkTopCollision(px, py, pw, ph, vy, ox, oy, ow, oh);
        if (res !== null) {
          py = res - ph;
          vy = 0;
          player.physics.state = PlayerState.Idle;
        }
      }

      // Colisão por baixo
      if (vy < 0) {
        const res = this.checkBottomCollision(px, py, pw, ph, vy, ox, oy, ow, oh);
        if (res !== null) {
          py = res;
          vy = 0;
        }
      }
    }

    // Atualiza posição e velocidade final
    player.x = px;
    player.y = py;
    player.physics.vx = vx;
    player.physics.vy = vy;
  }
}
