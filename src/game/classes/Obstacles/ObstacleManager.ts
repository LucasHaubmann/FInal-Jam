import p5 from "p5";
import { Obstacle } from "./Obstacle";

export class ObstacleManager {
  obstacles: Obstacle[];

  constructor(obstacles: Obstacle[]) {
    this.obstacles = obstacles;
  }

  update(): void {
    // Futuro: lógica de spawn ou destruição
  }

  render(p: p5, camX: number): void {
    for (const obs of this.obstacles) {
      obs.render(p, camX);
    }
  }

  checkCollisions(px: number, py: number, pw: number, ph: number): boolean {
    return this.obstacles.some(obs =>
      obs.isColliding(px, py, pw, ph)
    );
  }
}