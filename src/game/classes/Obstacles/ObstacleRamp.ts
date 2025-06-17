import p5 from "p5";
import { Obstacle } from "./Obstacle";

export class ObstacleRamp extends Obstacle {
  render(p: p5, camX: number): void {
    p.fill(180);
    p.triangle(
      this.x - camX, this.y + this.height,                   // base esquerda
      this.x + this.width - camX, this.y + this.height,     // base direita
      this.x + this.width - camX, this.y                    // topo direito
    );
  }
}