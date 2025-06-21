import p5 from "p5";
import { Obstacle } from "./Obstacle";
import { ObstacleFakeBlock } from "./ObstacleFakeBlock"; // ✅ Importa a classe para verificação

export class ObstacleManager {
  obstacles: Obstacle[];

  constructor() {
    this.obstacles = [];
  }
  
  public loadObstacles(obstaclesToLoad: Obstacle[]): void {
    this.obstacles = obstaclesToLoad;
    console.log(`[ObstacleManager] ${this.obstacles.length} obstáculos carregados.`);
    
    
    // ✅ CHAMA O RESET APÓS CARREGAR
    this.resetAllBlockStates();
  }

  // ✅ NOVO MÉTODO PRIVADO
  // Garante que todos os blocos que podem ter estado sejam reiniciados.
  public resetAllBlockStates(): void {
    for (const obs of this.obstacles) {
      if (obs instanceof ObstacleFakeBlock) {
        obs.reset();
      }
    }
  }

  // ... resto da classe (render, etc.) sem alterações ...
  public render(p: p5, camX: number): void {
    for (const obs of this.obstacles) {
      obs.render(p, camX);
    }
  }

  public checkCollisions(px: number, py: number, pw: number, ph: number): boolean {
    return this.obstacles.some(obs =>
      obs.isColliding(px, py, pw, ph)
    );
  }
}