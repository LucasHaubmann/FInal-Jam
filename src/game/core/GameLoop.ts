import { Player } from "../classes/Player/Player";
import { World } from "./World";
import { Camera } from "./Camera";
import { RenderSystem } from "./RenderSystem";
import { ObstacleManager } from "../classes/Obstacles/ObstacleManager";
import { PlayerConfig } from "../classes/Player/PlayerConfig";
import p5 from "p5";
import { resolvePlayerPlatformCollision } from "./CollisionSystem";
import { ObstacleCollision } from "../classes/Obstacles/ObstacleCollision";
import { ObstacleBlock } from "../classes/Obstacles/ObstacleBlock";
import { PlayerLifeSystem } from "../classes/Player/PlayerLifeSystem";
import { PlayerState } from "../classes/Player/PlayerState";
import { isRectColliding } from "../classes/Obstacles/ObstacleCollision";

export class GameLoop {
  private player: Player;
  private world: World;
  private camera: Camera;
  private renderSystem: RenderSystem;
  private obstacleManager: ObstacleManager;

  constructor(p: p5) {
    this.player = new Player(0, 500);
    this.world = new World(0, 1280 * 2);
    this.camera = new Camera(1280, this.world.maxX);
    this.renderSystem = new RenderSystem(p, this.camera, this.player);
    this.obstacleManager = new ObstacleManager();
    PlayerLifeSystem.setInitialPosition(this.player.x, this.player.y);
  }

update(): void {
  // Atualiza física
  this.player.update(this.obstacleManager.obstacles);

  const prevX = this.player.x;
  const speed = PlayerConfig.speedX;
  this.player.x += speed;
  this.player.physics.vx = this.player.x - prevX;

  // Colisão com rampas
  resolvePlayerPlatformCollision(this.player, this.obstacleManager.obstacles);

  // Colisão com blocos (todas as direções)
  ObstacleCollision.resolvePlayerBlockCollisions(
    this.player,
    this.obstacleManager.obstacles.filter(obs => obs instanceof ObstacleBlock) as ObstacleBlock[]
  );

  // ⏩ SÓ AGORA: Verifica morte
for (const obs of this.obstacleManager.obstacles) {
  if (
    obs.isLethal?.() &&
    isRectColliding(
      this.player.x,
      this.player.y,
      PlayerConfig.width,
      PlayerConfig.height,
      obs.x,
      obs.y,
      obs.width,
      obs.height
    )
  ) {
    this.player.physics.state = PlayerState.Death;
  }
}

  // Atualiza câmera, mundo, etc.
  this.camera.follow(this.player.x);
  this.world.update(this.player);

  // 🏁 Verifica se chegou ao fim do mapa (ganhou)
  if (this.player.x + PlayerConfig.width >= this.world.maxX) {
    console.log("🎉 Vitória! Reiniciando mapa...");
    this.player.x = PlayerLifeSystem.initialX;
    this.player.y = PlayerLifeSystem.initialY;
    this.player.physics.vx = 0;
    this.player.physics.vy = 0;
    this.player.physics.state = PlayerState.Idle;
  }

  PlayerLifeSystem.handleDeath(this.player);
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
