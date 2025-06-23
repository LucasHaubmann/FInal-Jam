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
import { CollectibleItem } from "../classes/Item/CollectibleItem";
import { Obstacle } from "../classes/Obstacles/Obstacle";

export interface PlayerData {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
}

// ✅ Função de formatação de tempo ATUALIZADA
const formatTime = (millis: number): string => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  // Pega os milissegundos, divide por 10 para ter centésimos e formata com 2 dígitos
  const centiseconds = Math.floor((millis % 1000) / 10).toString().padStart(2, '0');
  return `${minutes}:${seconds}.${centiseconds}`;
};


export class GameLoop {
  private p: p5;
  private onVictory: (finalTime: string) => void;
  private socket: Socket;
  private player: Player;
  private world: World;
  private camera: Camera;
  private renderSystem: RenderSystem;
  private obstacleManager: ObstacleManager;
  private items: CollectibleItem[] = [];
  private isPaused: boolean = false;
  private otherPlayers: { [id: string]: PlayerData } = {};
  private roomId: string | null;

  // Propriedades do temporizador
  private startTime: number;
  private elapsedTime: number = 0;
  private hasFinished: boolean = false;

  constructor(p: p5, onVictory: (finalTime: string) => void, socket: Socket, levelId: string, roomId: string | null, initialPlayers: PlayerData[]) {
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
    
    this.obstacleManager = new ObstacleManager();
    this.obstacleManager.loadObstacles(loadedObjects.filter(obj => obj instanceof Obstacle) as Obstacle[]);
    this.items = loadedObjects.filter(obj => obj instanceof CollectibleItem) as CollectibleItem[];

    PlayerLifeSystem.setInitialPosition(this.player.x, this.player.y);
    this.setupSocketListeners();
    
    // Inicia o temporizador
    this.startTime = p.millis();
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
    if (this.isPaused || this.hasFinished) return;
    
    // Atualiza o tempo decorrido
    this.elapsedTime = this.p.millis() - this.startTime;

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

    this.handleItemCollection();

    if (this.roomId) {
      this.socket.emit("playerUpdate", {
        roomId: this.roomId,
        id: this.socket.id,
        x: this.player.x,
        y: this.player.y,
      });
    }

    // Lógica de vitória
    if (this.player.x + PlayerConfig.width >= this.world.maxX) {
      this.hasFinished = true; // Para o jogo para este jogador
      const finalTime = formatTime(this.elapsedTime);

      if (this.roomId) {
        this.socket.emit('playerFinished', { roomId: this.roomId, time: finalTime });
      }
      this.onVictory(finalTime); // Envia o tempo para o App.tsx
      return;
    }

    const playerRespawned = PlayerLifeSystem.handleDeath(this.player);
    if (playerRespawned) {
      this.obstacleManager.resetAllBlockStates();
      this.items.forEach(item => item.isCollected = false);
    }
  }
  
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

    // Renderiza o temporizador na tela
    this.renderTimer();
  }

  private renderTimer(): void {
    const timeStr = formatTime(this.elapsedTime);
    this.p.push();
    this.p.fill('#00f6ff');
    this.p.noStroke();
    this.p.textFont('Orbitron');
    this.p.textSize(32);
    this.p.textAlign(this.p.CENTER, this.p.TOP);
    this.p.text(timeStr, this.p.width / 2, 20);
    this.p.pop();
  }

  handleKey(key: string): void {
    if (key === " ") {
      this.player.jump();
    }
  }
}
