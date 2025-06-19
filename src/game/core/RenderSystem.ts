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
    const camX = camera.getOffset();

    p.background(30);
    
    // Player (agora posicionado em relação à câmera)
    p.fill(255, 100, 100);
    p.rect(player.x - camX, player.y, PlayerConfig.width, PlayerConfig.height);

  }

}
