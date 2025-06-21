// obstacles/ObstacleManager.ts
import p5 from "p5";
import { Obstacle } from "./Obstacle";
// import { MapManager } from "../Maps/MapManager"; // ✅ REMOVIDO: Não precisa mais saber do MapManager

export class ObstacleManager {
  obstacles: Obstacle[];

  constructor() {
    // ✅ O construtor agora é simples: apenas inicializa uma lista vazia.
    this.obstacles = [];
  }
  
  // ✅ NOVO MÉTODO: Permite que o GameLoop "injete" os obstáculos do mapa correto.
  public loadObstacles(obstaclesToLoad: Obstacle[]): void {
    this.obstacles = obstaclesToLoad;
    console.log(`[ObstacleManager] ${this.obstacles.length} obstáculos carregados e prontos para gerenciar.`);
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