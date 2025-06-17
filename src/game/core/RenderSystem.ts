import p5 from "p5";
import { PlayerConfig } from "../classes/Player/PlayerConfig";
import { Player } from "../classes/Player/Player";
import { Camera } from "./Camera";

export class RenderSystem {
  p: p5;
  camera: Camera;
  player: Player;

  constructor(p: p5, camera: Camera, player: Player) {
    this.p = p;
    this.camera = camera;
    this.player = player;
  }

  render() {
    const { p, camera, player } = this;

    p.background(30);

    const camX = camera.getOffset();

    // Chão
    p.fill(60);
    p.rect(-camX, PlayerConfig.groundY + PlayerConfig.height, p.width * 3, 20);

    // Player (fixo na tela)
    p.fill(255, 100, 100);
    p.rect(player.x, player.y, PlayerConfig.width, PlayerConfig.height);

    // Obstáculo de exemplo
    p.fill(255);
    p.rect(600 - camX, PlayerConfig.groundY, 30, 40);
  }
}
