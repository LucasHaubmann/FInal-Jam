// src/game/core/GameLoop.ts
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

// ✅ Interface atualizada para incluir os novos dados de nome e cor
interface OtherPlayer {
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
  private isPaused: boolean = false;
  private otherPlayers: { [id: string]: OtherPlayer } = {};
  private roomId: string | null; // ✅ Propriedade para o multiplayer

  // ✅ Construtor final que recebe levelId e roomId
  constructor(p: p5, onVictory: () => void, socket: Socket, levelId: string, roomId: string | null) {
    this.p = p;
    this.onVictory = onVictory;
    this.socket = socket;
    this.roomId = roomId; // Guarda o ID da sala

    this.player = new Player(0, 650);

    const speed = PlayerConfig.speedX * (this.p.deltaTime / 16.67);
    this.player.x += speed;
    this.player.physics.vx = speed;

    this.world = new World(0, 5000);
    this.camera = new Camera(1280, this.world.maxX);
    this.renderSystem = new RenderSystem(p, this.camera, this.player);

    // Lógica de carregamento de mapa que montamos
    const mapLoader = new MapManager(levelId as LevelId);
    const loadedObstacles = mapLoader.getParsedObstacles();
    this.obstacleManager = new ObstacleManager();
    this.obstacleManager.loadObstacles(loadedObstacles);
    
    PlayerLifeSystem.setInitialPosition(this.player.x, this.player.y);

    this.setupSocketListeners();
  }

  // ✅ Listeners atualizados para a nova lógica de salas do servidor
  private setupSocketListeners(): void {
    // Quando um novo jogador entra na sala em que você já está
    this.socket.on("playerJoined", (playerData: OtherPlayer) => {
      console.log(`Novo player ${playerData.name} (${playerData.id}) entrou na sala.`, playerData);
      if (playerData.id !== this.socket.id) {
        this.otherPlayers[playerData.id] = playerData;
      }
    });
    
    // Quando você entra em uma sala que já tem jogadores
    this.socket.on("joinedRoom", (data: { roomId: string, players: OtherPlayer[] }) => {
        console.log("Recebendo lista de jogadores da sala:", data.players);
        data.players.forEach(playerData => {
            if (playerData.id !== this.socket.id) {
                this.otherPlayers[playerData.id] = playerData;
            }
        });
    });

    // Quando um jogador sai da sala
    this.socket.on("playerLeft", (id: string) => {
      console.log(`Player ${id} desconectado.`);
      delete this.otherPlayers[id];
    });

    // Quando recebe atualização de posição de outro jogador
    this.socket.on("playerUpdate", (playerData: OtherPlayer) => {
      if (playerData.id !== this.socket.id) {
        if (this.otherPlayers[playerData.id]) {
            this.otherPlayers[playerData.id].x = playerData.x;
            this.otherPlayers[playerData.id].y = playerData.y;
        } else {
            // Caso de segurança: se o jogador não existir, cria o registro
            this.otherPlayers[playerData.id] = playerData;
        }
      }
    });
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

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
      if (
        obs.isLethal?.() &&
        isRectColliding(
          this.player.x, this.player.y,
          PlayerConfig.width, PlayerConfig.height,
          obs.x, obs.y,
          obs.width, obs.height
        )
      ) {
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

    // ✅ LÓGICA DE UPDATE PARA MULTIPLAYER
    if (this.roomId) { // Só envia updates se estiver em modo multiplayer
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

    // ✅ LÓGICA DE RESPAWN E RESET
    const playerRespawned = PlayerLifeSystem.handleDeath(this.player);
    if (playerRespawned) {
      this.obstacleManager.resetAllBlockStates();
    }
  }

  render(): void {
    this.renderSystem.render();
    this.world.render(this.renderSystem.p, this.camera.getOffset());
    this.obstacleManager.render(this.renderSystem.p, this.camera.getOffset());

    const camX = this.camera.getOffset();
    for (const id in this.otherPlayers) {
      if (id === this.socket.id) continue;

      const otherPlayer = this.otherPlayers[id];
      
      // ✅ USA A COR E O NOME VINDOS DO SERVIDOR
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