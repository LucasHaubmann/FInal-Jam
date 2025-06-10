import p5 from "p5";
import type { IPlatform } from "../Plataform/IPlataform";

export default class Platform implements IPlatform {
  pos: p5.Vector;
  width: number;
  height: number;

  constructor(p: p5, x: number, y: number, width: number, height: number) {
    this.pos = p.createVector(x, y);
    this.width = width;
    this.height = height;
  }

  display(p: p5): void {
    p.fill(100, 100, 255);
    p.rect(this.pos.x, this.pos.y, this.width, this.height);
  }

  checkCollision(px: p5.Vector, pw: number, ph: number): boolean {
    return (
      px.x + pw > this.pos.x &&
      px.x < this.pos.x + this.width &&
      px.y + ph > this.pos.y &&
      px.y < this.pos.y + this.height
    );
  }
}