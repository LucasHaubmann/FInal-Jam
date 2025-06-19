import p5 from "p5";
import { Obstacle } from "./Obstacle";

export class ObstacleBlock extends Obstacle {
  render(p: p5, camX: number): void {
    p.fill(255);
    p.rect(this.x - camX, this.y, this.width, this.height);
  }

checkVerticalCollision(playerX, playerY, playerW, playerH, vy) {
  if (
    playerX + playerW > this.x &&
    playerX < this.x + this.width &&
    playerY + playerH <= this.y &&
    playerY + playerH + vy >= this.y
  ) {
    return this.y;
  }
  return null;
}
getTopYAt(x: number): number | null {
  if (x >= this.x && x <= this.x + this.width) {
    return this.y;
  }
  return null;
}

}
