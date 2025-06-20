// src/game/classes/Obstacles/ObstacleBlock.ts

import p5 from "p5";
import { Obstacle } from "./Obstacle";
import { ObstacleCollision } from "./ObstacleCollision";

export class ObstacleBlock extends Obstacle {
  /**
   * Checa colisão do player caindo sobre o bloco (topo)
   */
  checkTopCollision(px: number, py: number, pw: number, ph: number, vy: number): number | null {
    return ObstacleCollision.checkTopCollision(
      px, py, pw, ph, vy,
      this.x, this.y, this.width, this.height
    );
  }

  /**
   * Checa colisão do player batendo a cabeça (base do bloco)
   */
  checkBottomCollision(px: number, py: number, pw: number, ph: number, vy: number): number | null {
    return ObstacleCollision.checkBottomCollision(
      px, py, pw, ph, vy,
      this.x, this.y, this.width, this.height
    );
  }

  /**
   * Checa colisão do player vindo pela esquerda (encosta na direita do bloco)
   */
  checkRightCollision(px: number, py: number, pw: number, ph: number, vx: number): number | null {
    return ObstacleCollision.checkRightCollision(
      px, py, pw, ph, vx,
      this.x, this.y, this.width, this.height
    );
  }

  /**
   * Checa colisão do player vindo pela direita (encosta na esquerda do bloco)
   */
  checkLeftCollision(px: number, py: number, pw: number, ph: number, vx: number): number | null {
    return ObstacleCollision.checkLeftCollision(
      px, py, pw, ph, vx,
      this.x, this.y, this.width, this.height
    );
  }

  /**
   * Renderização visual do bloco
   */
  render(p: p5, camX: number): void {
    p.push();
    p.fill(100, 100, 100);
    p.stroke(0);
    p.rect(this.x - camX, this.y, this.width, this.height);
    p.pop();
  }
}
