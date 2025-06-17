export class Camera {
  x: number = 0;
  offsetX: number;
  viewportWidth: number;
  maxWorldX: number;

  constructor(viewportWidth: number, maxWorldX: number) {
    this.viewportWidth = viewportWidth;
    this.maxWorldX = maxWorldX;
    this.offsetX = viewportWidth * 0.4;
  }

  follow(playerX: number) {
    const targetX = playerX - this.offsetX;

    // Limita para que a borda direita da tela nunca ultrapasse o fim do mundo
    const maxCameraX = this.maxWorldX - this.viewportWidth;
    this.x = Math.min(targetX, maxCameraX);
    this.x = Math.max(this.x, 0);
  }

  getOffset(): number {
    return this.x;
  }

  reset() {
    this.x = 0;
  }
}
