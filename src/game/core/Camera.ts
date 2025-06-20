export class Camera {
  x: number = 0;
  offsetX: number;
  viewportWidth: number;
  maxWorldX: number;

  constructor(viewportWidth: number, maxWorldX: number) {
    this.viewportWidth = viewportWidth;
    this.maxWorldX = maxWorldX;
    this.offsetX = viewportWidth / 2; // em vez de viewportWidth * 0.4
  }

  follow(playerX: number) {
    const leftLimit = this.offsetX;
    const maxCameraX = this.maxWorldX - this.viewportWidth;

    if (playerX <= leftLimit) {
      this.x = 0;
    } else {
      this.x = Math.min(playerX - this.offsetX, maxCameraX);
    }
  }


  getOffset(): number {
    return this.x;
  }

  reset() {
    this.x = 0;
  }
  
}
