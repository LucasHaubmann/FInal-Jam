import p5 from "p5";
import { Obstacle } from "./Obstacle";

export class ObstacleKill extends Obstacle {
  render(p: p5, camX: number): void {
    p.fill("#e63946"); // vermelho sangue
    p.stroke("#ffb4b4");
    p.strokeWeight(2);
    p.rect(this.x - camX, this.y, this.width, this.height);
    p.noStroke();
  }

  isLethal(): boolean {
    return true;
  }
}
