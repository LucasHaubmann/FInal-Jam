import p5 from "p5";
import { Player } from "../classes/Player/Player";
import { Camera } from "./Camera";
import { RenderSystem } from "./RenderSystem";
import { PlayerConfig } from "../classes/Player/PlayerConfig";
import { World } from "./World";

export class GameLoop {
  player: Player;
  camera: Camera;
  renderer: RenderSystem;
  world: World;

  constructor(p: p5) {
    this.player = new Player(0, PlayerConfig.groundY); // começa em 0 agora
    this.world = new World(0, 3000);
    this.camera = new Camera(p.width, this.world.maxX);
    this.renderer = new RenderSystem(p, this.camera, this.player);
  }

  update() {
    this.player.update();
    this.camera.follow(this.player.x); // agora segue o player
    this.world.update(this.player);
  }

  render() {
    this.renderer.render();
    this.world.render(this.renderer.p, this.camera.getOffset());
  }

  handleKey(key: string) {
    if (key === " ") {
      this.player.jump();
    }
  }
}
