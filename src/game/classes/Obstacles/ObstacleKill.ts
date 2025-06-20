import p5 from "p5";
import { Obstacle } from "./Obstacle";
import { isRectColliding } from "./ObstacleCollision";

export class ObstacleKill extends Obstacle {
  isLethal(): boolean {
    return true;
  }

  override isColliding(
    px: number, py: number, pw: number, ph: number
  ): boolean {
    return isRectColliding(px, py, pw, ph, this.x, this.y, this.width, this.height);
  }

  override render(p: p5, camX: number): void {
    p.fill("#e63946"); // vermelho sangue
    p.stroke("#ffb4b4");
    p.strokeWeight(2);
    p.rect(this.x - camX, this.y, this.width, this.height);
    p.noStroke();
  }
}
