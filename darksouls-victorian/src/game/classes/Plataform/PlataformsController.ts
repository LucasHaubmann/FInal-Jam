import p5 from "p5";
import Platform from "../Plataform/Plataform";
import type { IPlatform } from "../Plataform/IPlataform";

export default class PlatformController {
  private platforms: IPlatform[] = [];

  constructor(p: p5) {
    // Exemplo inicial de plataformas
    this.platforms.push(new Platform(p, 300, 600, 200, 20));
    this.platforms.push(new Platform(p, 600, 550, 150, 20));
    this.platforms.push(new Platform(p, 1000, 580, 180, 20));
    this.platforms.push(new Platform(p, 1400, 620, 160, 20));
    this.platforms.push(new Platform(p, 1800, 590, 200, 20));
  }

  update(p: p5): void {
    for (const platform of this.platforms) {
      platform.display(p);
    }
  }

  getPlatforms(): IPlatform[] {
    return this.platforms;
  }
}