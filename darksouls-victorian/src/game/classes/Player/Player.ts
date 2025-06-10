// src/classes/Player/Player.ts
import p5 from "p5";

export default class Player {
  public pos: p5.Vector;
  public vel: p5.Vector;
  public acc: p5.Vector;
  public isOnGround: boolean = false;
  public p: p5;
  public stamina: number = 100;
  public maxStamina: number = 100;

  constructor(p: p5, x: number, y: number) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
  }

  debugInfo(p: p5, stamina: number) {
    p.push();
    p.fill(255);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);
    p.text(`Stamina: ${stamina.toFixed(2)}`, 10, 10);
    p.pop();
  }
}
