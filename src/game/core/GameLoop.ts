import { Player } from "../classes/Player/Player";
import { World } from "./World";
import { Camera } from "./Camera";
import { RenderSystem } from "./RenderSystem";
import { ObstacleManager } from "../classes/Obstacles/ObstacleManager";
import { ObstacleFakeBlock } from "../classes/Obstacles/ObstacleFakeBlock";
import { MapManager } from "../classes/Maps/MapManager";
import type { LevelId } from "../classes/Maps/MapOrganizer";
import { PlayerConfig } from "../classes/Player/PlayerConfig";
import p5 from "p5";
import { resolvePlayerPlatformCollision } from "./CollisionSystem";
import { ObstacleCollision } from "../classes/Obstacles/ObstacleCollision";
import { ObstacleBlock } from "../classes/Obstacles/ObstacleBlock";
import { PlayerLifeSystem } from "../classes/Player/PlayerLifeSystem";
import { PlayerState } from "../classes/Player/PlayerState";
import { isRectColliding } from "../classes/Obstacles/ObstacleCollision";
import { Socket } from "socket.io-client";
import { CollectibleItem } from "../classes/Item/CollectibleItem"; // ✅ Importa a classe de item
import { Obstacle } from "../classes/Obstacles/Obstacle"; // ✅ Importa a classe base de obstáculo

export interface PlayerData {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
}

export class GameLoop {
  private p: p5;
  private onVictory: () => void;
  private socket: Socket;
  private player: Player;
  private world: World;
  private camera: Camera;
  private renderSystem: RenderSystem;
  private obstacleManager: ObstacleManager;
  private items: CollectibleItem[] = []; // ✅ Lista para guardar os itens do mapa
  private isPaused: boolean = false;
  private otherPlayers: { [id: string]: PlayerData } = {};
  private roomId: string | null;

  constructor(p: p5, onVictory: () => void, socket: Socket, levelId: string, roomId: string | null, initialPlayers: PlayerData[]) {
    this.p = p;
    this.onVictory = onVictory;
    this.socket = socket;
    this.roomId = roomId;

    const newOtherPlayers: { [id: string]: PlayerData } = {};
    initialPlayers.forEach(playerData => {
      if (playerData.id !== this.socket.id) {
        newOtherPlayers[playerData.id] = playerData;
      }
    });
    this.otherPlayers = newOtherPlayers;

    this.player = new Player(0, 650);
    const speed = PlayerConfig.speedX * (this.p.deltaTime / 16.67);
    this.player.x += speed;
    this.player.physics.vx = speed;

    this.world = new World(0, 5000);
    this.camera = new Camera(1280, this.world.maxX);
    this.renderSystem = new RenderSystem(p, this.camera, this.player);

    const mapLoader = new MapManager(levelId as LevelId);
    const loadedObjects = mapLoader.getParsedObstacles();
    
    // ✅ Separa os objetos carregados em obstáculos e itens
    this.obstacleManager = new ObstacleManager();
    this.obstacleManager.loadObstacles(loadedObjects.filter(obj => obj instanceof Obstacle) as Obstacle[]);
    this.items = loadedObjects.filter(obj => obj instanceof CollectibleItem) as CollectibleItem[];

    PlayerLifeSystem.setInitialPosition(this.player.x, this.player.y);
    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    this.socket.off("updatePlayerList");
    this.socket.off("playerUpdate");
    
    this.socket.on("updatePlayerList", (players: PlayerData[]) => {
      const newOtherPlayers: { [id: string]: PlayerData } = {};
      players.forEach(playerData => {
        if (playerData.id !== this.socket.id) {
          newOtherPlayers[playerData.id] = playerData;
        }
      });
      this.otherPlayers = newOtherPlayers;
    });
  
    this.socket.on("playerUpdate", (playerData: PlayerData) => {
      if (playerData.id !== this.socket.id) {
        if (this.otherPlayers[playerData.id]) {
          this.otherPlayers[playerData.id].x = playerData.x;
          this.otherPlayers[playerData.id].y = playerData.y;
        } else {
          this.otherPlayers[playerData.id] = playerData;
        }
      }
    });
  }

  pause(): void { this.isPaused = true; }
  resume(): void { this.isPaused = false; }

  update(): void {
    if (this.isPaused) return;

    this.player.update(this.obstacleManager.obstacles);

    const prevX = this.player.x;
    const speed = PlayerConfig.speedX;
    this.player.x += speed;
    this.player.physics.vx = this.player.x - prevX;

    resolvePlayerPlatformCollision(this.player, this.obstacleManager.obstacles);
    ObstacleCollision.resolvePlayerBlockCollisions(
      this.player,
      this.obstacleManager.obstacles.filter(obs => obs instanceof ObstacleBlock) as ObstacleBlock[]
    );

    for (const obs of this.obstacleManager.obstacles) {
      if (obs.isLethal?.() && isRectColliding(this.player.x, this.player.y, PlayerConfig.width, PlayerConfig.height, obs.x, obs.y, obs.width, obs.height)) {
        this.player.physics.state = PlayerState.Death;
      }
      if (obs instanceof ObstacleFakeBlock) {
        if (obs.isColliding(this.player.x, this.player.y, PlayerConfig.width, PlayerConfig.height)) {
          obs.trigger();
        }
      }
    }

    this.camera.follow(this.player.x);
    this.world.update(this.player);

    // ✅ Adiciona a lógica de coleta de itens
    this.handleItemCollection();

    if (this.roomId) {
      this.socket.emit("playerUpdate", {
        roomId: this.roomId,
        id: this.socket.id,
        x: this.player.x,
        y: this.player.y,
      });
    }

    if (this.player.x + PlayerConfig.width >= this.world.maxX) {
      this.onVictory();
      return;
    }

    const playerRespawned = PlayerLifeSystem.handleDeath(this.player);
    if (playerRespawned) {
      this.obstacleManager.resetAllBlockStates();
      // ✅ Também resetamos os itens quando o jogador morre
      this.items.forEach(item => item.isCollected = false);
    }
  }

  // ✅ NOVO MÉTODO para lidar com a coleta
private handleItemCollection(): void {
  // Impede coleta se jogador já tem um item
  if (this.player.heldItem !== null) return;

  for (const item of this.items) {
    if (!item.isCollected && item.checkCollision(this.player)) {
      console.log(`Jogador coletou um item: ${item.type}`);
      this.player.heldItem = item.type;
      item.isCollected = true;
      break; // evita pegar mais de um no mesmo frame
    }
  }
}

  render(): void {
    this.renderSystem.render();
    this.world.render(this.renderSystem.p, this.camera.getOffset());
    this.obstacleManager.render(this.renderSystem.p, this.camera.getOffset());

    // ✅ Renderiza os itens coletáveis
    this.items.forEach(item => {
      item.render(this.renderSystem.p, this.camera.getOffset());
    });
    
    const camX = this.camera.getOffset();
    for (const id in this.otherPlayers) {
      if (id === this.socket.id) continue;
      const otherPlayer = this.otherPlayers[id];
      
      this.p.fill(otherPlayer.color || '#00A3FF');
      this.p.stroke(0);
      this.p.strokeWeight(1);
      this.p.rect(otherPlayer.x - camX, otherPlayer.y, PlayerConfig.width, PlayerConfig.height);
      
      this.p.fill(255);
      this.p.noStroke();
      this.p.textSize(12);
      this.p.textAlign(this.p.CENTER);
      this.p.text(otherPlayer.name, otherPlayer.x - camX + PlayerConfig.width / 2, otherPlayer.y - 10);
    }
  }

  handleKey(key: string): void {
    if (key === " ") {
      this.player.jump();
    }
  }
}
