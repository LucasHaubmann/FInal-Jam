import p5 from "p5";
import { Player } from "../Player/Player";
import { PlayerConfig } from "../Player/PlayerConfig";

// ✅ Tipo para as partículas do rasto
type Particle = {
  x: number;
  y: number;
  size: number;
  alpha: number;
};

export class Projectile {
  public id: string;
  public ownerId: string;
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public width: number = 28;
  public height: number = 12;
  public hasHit: boolean = false;
  private angle: number;
  
  // ✅ Array para guardar as partículas do rasto
  private particles: Particle[] = [];

  constructor(ownerId: string, startX: number, startY: number, targetX: number, targetY: number) {
    this.id = `${ownerId}-${Date.now()}`;
    this.ownerId = ownerId;
    this.x = startX;
    this.y = startY;

    this.angle = Math.atan2(targetY - startY, targetX - startX);
    const speed = 18; // Um pouco mais rápido
    this.vx = Math.cos(this.angle) * speed;
    this.vy = Math.sin(this.angle) * speed;
  }

  update(): void {
    if (this.hasHit) return;

    // ✅ Adiciona uma nova partícula à cauda do foguete a cada frame
    this.particles.push({
      x: this.x + (this.width / 4), // Começa na parte de trás
      y: this.y + (this.height / 2),
      size: Math.random() * 8 + 4, // Tamanho aleatório
      alpha: 255
    });

    // ✅ Atualiza as partículas existentes
    for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.size -= 0.5;
        p.alpha -= 20;
        if (p.size <= 0 || p.alpha <= 0) {
            this.particles.splice(i, 1);
        }
    }
    
    // Move o foguete
    this.x += this.vx;
    this.y += this.vy;
  }

  render(p: p5, camX: number): void {
    if (this.hasHit) return;

    p.push();

    // ✅ Renderiza o rasto de partículas primeiro (para ficar atrás)
    p.noStroke();
    for (const particle of this.particles) {
        // Cor de fogo (laranja/amarelo)
        p.fill(255, p.random(100, 200), 0, particle.alpha);
        p.ellipse(particle.x - camX, particle.y, particle.size);
    }
    
    // ✅ Renderiza o corpo do foguete
    p.translate(this.x - camX, this.y);
    p.rotate(this.angle);

    p.noStroke();
    
    // Corpo do foguete (cinzento escuro)
    p.fill(80);
    p.rect(0, 0, this.width, this.height, 3);

    // Ogiva (vermelha)
    p.fill(255, 60, 30);
    p.triangle(
        this.width, 0,
        this.width, this.height,
        this.width + 12, this.height / 2
    );
    
    // Janela (azul claro)
    p.fill(100, 200, 255);
    p.ellipse(this.width * 0.7, this.height / 2, 5, 5);

    p.pop();
  }
  
  isCollidingWith(player: Player): boolean {
    if (this.hasHit) return false;

    return player.x < this.x + this.width &&
           player.x + PlayerConfig.width > this.x &&
           player.y < this.y + this.height &&
           player.y + PlayerConfig.height > this.y;
  }
}
