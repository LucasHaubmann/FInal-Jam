import p5 from "p5";

export abstract class Obstacle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height: number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  abstract render(p: p5, camX: number): void;

  isColliding(playerX: number, playerY: number, playerW: number, playerH: number): boolean {
    return (
      playerX < this.x + this.width &&
      playerX + playerW > this.x &&
      playerY < this.y + this.height &&
      playerY + playerH > this.y
    );
  }
}