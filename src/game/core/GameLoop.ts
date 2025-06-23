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
import { Projectile } from "../classes/Item/Projectile"; 

export interface PlayerData {
  id: string;
  x: number;
  y: number;
  name: string;
  color: string;
}

const formatTime = (millis: number): string => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
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
  private projectiles: Projectile[] = []; 
  private isPaused: boolean = false;
  private otherPlayers: { [id: string]: PlayerData } = {};
  private roomId: string | null;
  private startTime: number;
  private elapsedTime: number = 0;
  private hasFinished: boolean = false;

  constructor(p: p5, onVictory: (finalTime: string) => void, socket: Socket, levelId: string, roomId: string | null, initialPlayers: PlayerData[]) {
    this.p = p;
    this.onVictory = onVictory;
    this.socket = socket;
    this.roomId = roomId;

    const newOtherPlayers: { [id: string]: PlayerData } = {};
    if (this.socket.id) {
        initialPlayers.forEach(playerData => {
          if (playerData.id !== this.socket.id) {
            newOtherPlayers[playerData.id] = playerData;
          }
        });
    }
    this.otherPlayers = newOtherPlayers;

    this.player = new Player(0, 650);
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
    
    this.startTime = p.millis();
  }

  private setupSocketListeners(): void {
    this.socket.off("playerUpdate");
    this.socket.off("newProjectile");
    this.socket.off("projectileImpact");

    this.socket.on("playerUpdate", (playerData: PlayerData) => {
        if (this.socket.id && playerData.id !== this.socket.id) {
          this.otherPlayers[playerData.id] = playerData;
        }
    });

    this.socket.on('newProjectile', ({ projectileData }) => {
        const newProjectile = new Projectile(projectileData.ownerId, projectileData.x, projectileData.y, projectileData.targetX, projectileData.targetY);
        newProjectile.id = projectileData.id;
        this.projectiles.push(newProjectile);
    });

    this.socket.on('projectileImpact', ({ targetId, projectileId }) => {
        this.projectiles = this.projectiles.filter(p => p.id !== projectileId);
        // ✅ CORREÇÃO: Chama o método die() em vez de stun()
        if (targetId === this.socket.id) {
            this.player.die();
        }
    });
  }

  update(): void {
    if (this.isPaused || this.hasFinished) return;
    
    this.elapsedTime = this.p.millis() - this.startTime;

    // 1. ATUALIZA O ESTADO INTERNO DO JOGADOR
    this.player.update(this.p, this.obstacleManager.obstacles);

    // 2. MOVIMENTO HORIZONTAL
    const prevX = this.player.x;
    const speed = this.player.getCurrentSpeed();
    this.player.x += speed;
    this.player.physics.vx = this.player.x - prevX;

    // ✅ CORREÇÃO DE LÓGICA DE COLISÃO
    // 3. PRIMEIRO, VERIFICA SE O MOVIMENTO CAUSOU A MORTE
    for (const obs of this.obstacleManager.obstacles) {
      if (obs.isLethal?.() && isRectColliding(this.player.x, this.player.y, PlayerConfig.width, PlayerConfig.height, obs.x, obs.y, obs.width, obs.height)) {
        this.player.physics.state = PlayerState.Death;
        break; 
      }
    }

    // 4. SE O JOGADOR NÃO MORREU, CORRIGE A POSIÇÃO E VERIFICA OUTRAS COLISÕES
    if (this.player.physics.state !== PlayerState.Death) {
        // Corrige a posição para não atravessar paredes
        ObstacleCollision.resolvePlayerBlockCollisions(
          this.player,
          this.obstacleManager.obstacles.filter(obs => obs instanceof ObstacleBlock) as ObstacleBlock[]
        );
        // Corrige a posição em plataformas e rampas
        resolvePlayerPlatformCollision(this.player, this.obstacleManager.obstacles);
        
        // Verifica outras colisões não letais
        for (const obs of this.obstacleManager.obstacles) {
            if (obs instanceof ObstacleFakeBlock && obs.isColliding(this.player.x, this.player.y, PlayerConfig.width, PlayerConfig.height)) {
                obs.trigger();
            }
        }
    }
    
    // 5. ATUALIZA CÂMERA, MUNDO, ITENS E PROJÉTEIS
    this.camera.follow(this.player.x);
    this.world.update(this.player);
    this.handleItemCollection();
    this.updateProjectiles();

    // 6. SINCRONIZAÇÃO E LÓGICA DE FIM DE JOGO
    if (this.roomId && this.socket.id) {
      this.socket.emit("playerUpdate", { roomId: this.roomId, id: this.socket.id, x: this.player.x, y: this.player.y });
    }

    if (this.player.x + PlayerConfig.width >= this.world.maxX) {
      this.hasFinished = true;
      const finalTime = formatTime(this.elapsedTime);
      if (this.roomId) { this.socket.emit('playerFinished', { roomId: this.roomId, time: finalTime }); }
      this.onVictory(finalTime);
      return;
    }

    // Trata o respawn se o jogador morreu neste frame
    if (PlayerLifeSystem.handleDeath(this.player)) {
      this.obstacleManager.resetAllBlockStates();
      this.items.forEach(item => { item.isCollected = false; });
    }
  }
  
  private handleItemCollection(): void {
    if (this.player.heldItem) return;
  
    for (const item of this.items) {
      if (!item.isCollected && item.checkCollision(this.player)) {
        this.player.applyItem(item.type);
        item.isCollected = true;
        break;
      }
    }
  }

  private updateProjectiles(): void {
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
          const proj = this.projectiles[i];
          proj.update();
          if (this.socket.id && proj.ownerId !== this.socket.id && proj.isCollidingWith(this.player)) {
              this.socket.emit('playerHit', { roomId: this.roomId, targetId: this.socket.id, projectileId: proj.id });
              this.projectiles.splice(i, 1);
              continue;
          }
          if (proj.x > this.world.maxX + 100 || proj.x < -100) {
              this.projectiles.splice(i, 1);
          }
      }
  }
  
  render(): void {
    this.renderSystem.render();
    this.world.render(this.renderSystem.p, this.camera.getOffset());
    this.obstacleManager.render(this.renderSystem.p, this.camera.getOffset());
    this.items.forEach(item => item.render(this.renderSystem.p, this.camera.getOffset()));
    this.projectiles.forEach(p => p.render(this.renderSystem.p, this.camera.getOffset()));
    this.player.renderEffect(this.p, this.camera.getOffset());
    
    const camX = this.camera.getOffset();
    for (const id in this.otherPlayers) {
      const otherPlayer = this.otherPlayers[id];
      this.p.fill(otherPlayer.color || '#00A3FF');
      this.p.rect(otherPlayer.x - camX, otherPlayer.y, PlayerConfig.width, PlayerConfig.height);
      this.p.fill(255);
      this.p.noStroke();
      this.p.textSize(12);
      this.p.textAlign(this.p.CENTER);
      this.p.text(otherPlayer.name, otherPlayer.x - camX + PlayerConfig.width / 2, otherPlayer.y - 10);
    }
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
    if (key.toLowerCase() === 'c') {
        if (this.player.heldItem === 'rocket_item' && this.roomId) {
            this.fireRocket();
        }
    }
  }

  private fireRocket(): void {
      if (!this.socket.id) {
          console.error("Não é possível disparar o foguete: ID do socket é indefinido.");
          return;
      }
      this.player.heldItem = null;
      let target: PlayerData | null = null;
      let minDistance = Infinity;

      Object.values(this.otherPlayers as { [id: string]: PlayerData }).forEach((p: PlayerData) => {
          const distance = p.x - this.player.x;
          if (distance > 0 && distance < minDistance) {
              minDistance = distance;
              target = p;
          }
      });

      // ✅ CORREÇÃO TYPESCRIPT: Lógica reestruturada para ser 100% segura.
      if (target) {
          const projectileData = {
              id: `${this.socket.id}-${Date.now()}`,
              ownerId: this.socket.id,
              x: this.player.x + PlayerConfig.width / 2,
              y: this.player.y + PlayerConfig.height / 2,
              targetX: target.x,
              targetY: target.y,
          };

          const newProjectile = new Projectile(projectileData.ownerId, projectileData.x, projectileData.y, projectileData.targetX, projectileData.targetY);
          newProjectile.id = projectileData.id;
          this.projectiles.push(newProjectile);
          this.socket.emit('fireRocket', { roomId: this.roomId, projectileData });
      } else {
          console.log("Nenhum alvo encontrado para o foguete.");
      }
  }
}
