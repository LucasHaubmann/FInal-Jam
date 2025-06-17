import p5 from "p5";
import { Player } from "../classes/Player/Player";
import { Camera } from "./Camera";
import { RenderSystem } from "./RenderSystem";
import { PlayerConfig } from "../classes/Player/PlayerConfig";

export class GameLoop {
  player: Player;
  camera: Camera;
  renderer: RenderSystem;

  constructor(p: p5) {
    this.player = new Player(100, PlayerConfig.groundY);
    this.camera = new Camera(PlayerConfig.speedX);
    this.renderer = new RenderSystem(p, this.camera, this.player);
  }

  update() {
    this.camera.update();
    this.player.update();
  }

  render() {
    this.renderer.render();
  }

  handleKey(key: string) {
    if (key === " ") {
      this.player.jump();
    }
  }
}
