import { Player } from "../classes/Player/Player";
import { World } from "./World";
import { Camera } from "./Camera";
import { RenderSystem } from "./RenderSystem";
import { ObstacleManager } from "../classes/Obstacles/ObstacleManager";
import { PlayerConfig } from "../classes/Player/PlayerConfig";
import p5 from "p5";
import {resolvePlayerPlatformCollision} from "./CollisionSystem"
import { ObstacleCollision } from "../classes/Obstacles/ObstacleCollision";
import { ObstacleBlock } from "../classes/Obstacles/ObstacleBlock";


export class GameLoop {
  private player: Player;
  private world: World;
  private camera: Camera;
  private renderSystem: RenderSystem;
  private obstacleManager: ObstacleManager;

  constructor(p: p5) {
    this.player = new Player(0, 0);
    this.world = new World(0, 1280 * 2);
    this.camera = new Camera(1280, this.world.maxX);
    this.renderSystem = new RenderSystem(p, this.camera, this.player);
    this.obstacleManager = new ObstacleManager();

  }

update(): void {
  // Atualiza física vertical (gravidade + estado)
  this.player.update(this.obstacleManager.obstacles);

  // 👉 Calcula deslocamento horizontal
  const prevX = this.player.x;
  const speed = PlayerConfig.speedX;

  // 👉 Move o player horizontalmente
  this.player.x += speed;

  // 👉 Atualiza vx com base no deslocamento real
  this.player.physics.vx = this.player.x - prevX;

  // 👉 Colisão com rampas e plataformas (topo apenas)
  resolvePlayerPlatformCollision(this.player, this.obstacleManager.obstacles);

  // 👉 Colisão completa com blocos (todos os lados)
  ObstacleCollision.resolvePlayerBlockCollisions(
    this.player,
    this.obstacleManager.obstacles.filter(obs => obs instanceof ObstacleBlock) as ObstacleBlock[]
  );

  // Atualiza câmera e mundo
  this.camera.follow(this.player.x);
  this.world.update(this.player);

  // Verifica obstáculos letais
  for (const obs of this.obstacleManager.obstacles) {
    if (
      obs.isLethal?.() &&
      obs.isColliding(
        this.player.x,
        this.player.y,
        PlayerConfig.width,
        PlayerConfig.height
      )
    ) {
      console.log("💀 Morreu!");
      // TODO: Reiniciar fase, efeitos visuais etc.
    }
  }
}


  render(): void {
    this.renderSystem.render();
    this.world.render(this.renderSystem.p, this.camera.getOffset());
    this.obstacleManager.render(this.renderSystem.p, this.camera.getOffset());
  }

  handleKey(key: string): void {
    if (key === " ") {
      this.player.jump();
    }
  }
}

