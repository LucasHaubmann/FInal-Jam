import p5 from "p5";
import { Player } from "../classes/Player/Player";
import { PlayerConfig } from "../classes/Player/PlayerConfig";
import { ObstacleManager } from "../classes/Obstacles/ObstacleManager";
import { createMap1 } from "../classes/Maps/Map1";

export class World {
  minX: number;
  maxX: number;
  obstacles: ObstacleManager;

  constructor(minX: number, maxX: number) {
    this.minX = minX;
    this.maxX = maxX;
    this.obstacles = new ObstacleManager(createMap1());
  }

  update(player: Player) {
    // Limites do mapa
    if (player.x < this.minX) {
      player.x = this.minX;
    }
    if (player.x + PlayerConfig.width > this.maxX) {
      player.x = this.maxX - PlayerConfig.width;
    }
  }

  render(p: p5, camX: number) {
    // Parede final
    p.fill(255, 0, 0);
    p.rect(this.maxX - camX, 0, 2, p.height);

    // Chão
    p.fill(60);
    p.rect(0 - camX, PlayerConfig.groundY + PlayerConfig.height, p.width * 4, 20);

    // Obstáculos
    this.obstacles.render(p, camX);
  }
}
