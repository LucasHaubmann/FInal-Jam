// src/game/core/RenderSystem.ts
import Player from "../classes/Player/Player";
import type { IPlatform } from "../classes/Plataform/IPlataform";
import type p5 from "p5";

export default class RenderSystem {
  private worldWidth = 3000;

  draw(p: p5, player: Player, platforms: IPlatform[]): void {
    p.background(20);

    p.push();

    // Câmera
    let camX = player.pos.x - p.width / 2;
    camX = p.constrain(camX, 0, this.worldWidth - p.width);
    p.translate(-camX, 0);

    // Desenha plataformas
    platforms.forEach(platform => {
      p.fill(100, 100, 255);
      p.rect(platform.pos.x, platform.pos.y, platform.width, platform.height);
    });

    // Player
    p.fill(255);
    p.ellipse(player.pos.x, player.pos.y, 40, 40);

    // Chão longo
    p.fill(100);
    p.rect(0, 680, this.worldWidth, 200);


    p.pop();

    // Debug info
    player.debugInfo(p, player.stamina);
  }
}
