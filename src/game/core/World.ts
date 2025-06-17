import p5 from "p5";
import { Player } from "../classes/Player/Player";
import { PlayerConfig } from "../classes/Player/PlayerConfig";

export class World {
  minX: number;
  maxX: number;

  constructor(minX: number, maxX: number) {
    this.minX = minX;
    this.maxX = maxX;
  }

  update(player: Player) {
    // Evita ultrapassar a borda esquerda
    if (player.x < this.minX) {
      player.x = this.minX;
    }

    // Evita ultrapassar a borda direita (leva em conta a largura do player)
    if (player.x + PlayerConfig.width > this.maxX) {
      player.x = this.maxX - PlayerConfig.width;
    }
  }

  render(p: p5, camX: number) {
    // Parede visível
    p.fill(255, 0, 0);
    p.rect(this.maxX - camX, 0, 2, p.height); // linha vermelha
  }
}
