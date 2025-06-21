import p5 from "p5";
import { Obstacle } from "./Obstacle";

export class ObstacleFakeBlock extends Obstacle {
  private isTriggered: boolean = false;

  public trigger(): void {
    this.isTriggered = true;
  }

  // ✅ NOVO MÉTODO PÚBLICO
  // Redefine o estado do bloco para o original.
  public reset(): void {
    this.isTriggered = false;
  }

  render(p: p5, camX: number): void {
    p.push();
    
    if (this.isTriggered) {
      p.fill(255, 220, 0); 
      p.stroke(180, 150, 0);
      p.strokeWeight(2);
    } else {
      p.fill(100, 100, 100);
      p.stroke(0);
    }
    
    p.rect(this.x - camX, this.y, this.width, this.height);
    p.pop();
  }
}