import p5 from "p5";

export interface IPlatform {
  pos: p5.Vector;
  width: number;
  height: number;
  display(p: p5): void;
  checkCollision(px: p5.Vector, pw: number, ph: number): boolean;
}