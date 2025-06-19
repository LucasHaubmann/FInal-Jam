import p5 from "p5";
import { Obstacle } from "./Obstacle";

export class ObstacleRamp extends Obstacle {
  // rampa definida por retângulo base, altura à esquerda e à direita (linear)
  constructor(
    x: number, y: number,
    width: number, height: number,
    public slopeRightUp = true // se false, desce à direita → invertido
  ) {
    super(x, y, width, height);
  }

  render(p: p5, camX: number) {
    p.fill("#a8dadc");
    p.noStroke();
    if (this.slopeRightUp) {
      p.triangle(
        this.x - camX, this.y + this.height,                      // base esquerda
        this.x + this.width - camX, this.y + this.height,        // base direita
        this.x + this.width - camX, this.y                      // topo direita
      );
    } else {
      p.triangle(
        this.x - camX, this.y,                                   // topo esquerda
        this.x - camX, this.y + this.height,                    // base esquerda
        this.x + this.width - camX, this.y + this.height        // base direita
      );
    }
  }

  checkVerticalCollision(px: number, py: number, pw: number, ph: number, vy: number): number | null {
    const centerX = px + pw / 2;
    if (centerX < this.x || centerX > this.x + this.width) return null;

    const t = (centerX - this.x) / this.width;
    const interpY = this.slopeRightUp
      ? this.y + this.height * (1 - t)
      : this.y + this.height * t; // invertido para descida

    const playerFeet = py + ph;
    const tol = ph * 0.5;

    if (playerFeet >= interpY - tol && playerFeet <= interpY + tol) {
      return interpY;
    }

    return null;
  }
getTopYAt(x: number): number | null {
  if (x < this.x || x > this.x + this.width) return null;
  const t = (x - this.x) / this.width;
  return this.slopeRightUp 
    ? this.y + this.height * (1 - t) 
    : this.y + this.height * t;
}

}
