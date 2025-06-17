import p5 from "p5";
import { Obstacle } from "./Obstacle";

export class ObstacleKill extends Obstacle {
  render(p: p5, camX: number): void {
    p.fill(255, 0, 0); // vermelho para indicar perigo
    p.rect(this.x - camX, this.y, this.width, this.height);
  }
}
