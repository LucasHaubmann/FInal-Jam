import p5 from "p5";
import { Player } from "../Player/Player";
import { PlayerConfig } from "../Player/PlayerConfig"; // ✅ IMPORTADO

export class Projectile {
  public id: string;
  public ownerId: string;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public width: number = 30;
  public height: number = 15;
  public hasHit: boolean = false;

  constructor(ownerId: string, startX: number, startY: number, targetX: number, targetY: number) {
    this.id = `${ownerId}-${Date.now()}`;
    this.ownerId = ownerId;
    this.x = startX;
    this.y = startY;

    const angle = Math.atan2(targetY - startY, targetX - startX);
    const speed = 15;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
  }

  update(): void {
    if (this.hasHit) return;
    this.x += this.vx;
    this.y += this.vy;
  }

  render(p: p5, camX: number): void {
    if (this.hasHit) return;
    p.push();
    p.fill(255, 150, 0); // Laranja
    p.noStroke();
    p.rect(this.x - camX, this.y, this.width, this.height);
    p.pop();
  }
  
  // ✅ CORRIGIDO: Usa PlayerConfig para as dimensões do jogador
  isCollidingWith(player: Player): boolean {
    if (this.hasHit) return false;

    return player.x < this.x + this.width &&
           player.x + PlayerConfig.width > this.x &&
           player.y < this.y + this.height &&
           player.y + PlayerConfig.height > this.y;
  }
}
