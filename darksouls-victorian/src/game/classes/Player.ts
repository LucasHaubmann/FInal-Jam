import p5 from "p5";

export default class Player {
  pos: p5.Vector;
  speed: number = 3;

  constructor(x: number, y: number, p: p5) {
    this.pos = p.createVector(x, y);
  }

  update(p: p5) {
    if (p.keyIsDown(p.LEFT_ARROW)) this.pos.x -= this.speed;
    if (p.keyIsDown(p.RIGHT_ARROW)) this.pos.x += this.speed;
    if (p.keyIsDown(p.UP_ARROW)) this.pos.y -= this.speed;
    if (p.keyIsDown(p.DOWN_ARROW)) this.pos.y += this.speed;
  }

  display(p: p5) {
    p.fill(255);
    p.ellipse(this.pos.x, this.pos.y, 40, 40);
  }
}
