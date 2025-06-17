export class Camera {
  x: number = 0;
  speed: number;

  constructor(speed: number) {
    this.speed = speed;
  }

  update() {
    this.x += this.speed;
  }

  getOffset(): number {
    return this.x;
  }

  reset() {
    this.x = 0;
  }
}
