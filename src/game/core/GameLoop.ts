// src/game/core/GameLoop.ts
import { Player } from "../classes/Player/Player";
import { World } from "./World";
import { Camera } from "./Camera";
import { RenderSystem } from "./RenderSystem";
import { ObstacleManager } from "../classes/Obstacles/ObstacleManager";
import { ObstacleFakeBlock } from "../classes/Obstacles/ObstacleFakeBlock";
import { MapManager } from "../classes/Maps/MapManager"; // ✅ IMPORTAMOS O MAPMANAGER
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

// Interface para representar dados de outros jogadores
interface OtherPlayer {
  id: string;
  x: number;
  y: number;
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

  // ✅ O CONSTRUTOR AGORA RECEBE O LEVELID
  constructor(p: p5, onVictory: () => void, socket: Socket, levelId: string) {
    this.p = p;
    this.onVictory = onVictory;
    this.socket = socket;

    this.player = new Player(0, 650);

    const speed = PlayerConfig.speedX * (this.p.deltaTime / 16.67);
    this.player.x += speed;
    this.player.physics.vx = speed;

    this.world = new World(0, 5000);
    this.camera = new Camera(1280, this.world.maxX);
    this.renderSystem = new RenderSystem(p, this.camera, this.player);

    // ✅ LÓGICA DE CARREGAMENTO DE MAPA CORRETA
    // 1. Cria o MapManager para carregar o mapa do ID recebido
    const mapLoader = new MapManager(levelId as LevelId);
    // 2. Pede a ele a lista de obstáculos prontos
    const loadedObstacles = mapLoader.getParsedObstacles();
    // 3. Cria o ObstacleManager que vai gerenciar o jogo
    this.obstacleManager = new ObstacleManager();
    // 4. Entrega os obstáculos do mapa correto para ele
    this.obstacleManager.loadObstacles(loadedObstacles);
    
    PlayerLifeSystem.setInitialPosition(this.player.x, this.player.y);

    this.setupSocketListeners();
  }

  //
  // NENHUMA OUTRA MUDANÇA É NECESSÁRIA NO RESTO DO ARQUIVO!
  // Todos os métodos abaixo permanecem intactos.
  //

  private setupSocketListeners(): void {
    this.socket.on("currentPlayers", (playersData: { [id: string]: OtherPlayer }) => {
      console.log("Recebendo jogadores atuais:", playersData);
      for (const id in playersData) {
        if (id !== this.socket.id) {
          this.otherPlayers[id] = playersData[id];
        }
      }
    });

    this.socket.on("newPlayer", (playerData: OtherPlayer) => {
      console.log(`Novo player ${playerData.id} conectado.`, playerData);
      if (playerData.id !== this.socket.id) {
        this.otherPlayers[playerData.id] = playerData;
      }
    });

    this.socket.on("playerDisconnected", (id: string) => {
      console.log(`Player ${id} desconectado.`);
      delete this.otherPlayers[id];
    });

    this.socket.on("playerUpdate", (playerData: OtherPlayer) => {
      if (playerData.id !== this.socket.id) {
        this.otherPlayers[playerData.id] = playerData;
      }
    });
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

// DENTRO DA CLASSE GameLoop

// DENTRO DA CLASSE GameLoop

update(): void {
  if (this.isPaused) return;

  // ... toda a sua lógica de update (movimento, colisão, etc.) continua aqui ...
  // ...
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

  this.socket.emit("playerUpdate", {
    id: this.socket.id,
    x: this.player.x,
    y: this.player.y,
  });

  if (this.player.x + PlayerConfig.width >= this.world.maxX) {
    this.onVictory();
    return;
  }

  // ✅ LÓGICA DE RESPAWN E RESET
  // 1. Chamamos a função e guardamos o "aviso" (true ou false)
  const playerRespawned = PlayerLifeSystem.handleDeath(this.player);

  // 2. Se o aviso for 'true', o GameLoop comanda o reset dos blocos.
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
      this.p.fill(0, 150, 255);
      this.p.rect(otherPlayer.x - camX, otherPlayer.y, PlayerConfig.width, PlayerConfig.height);
      this.p.fill(255);
      this.p.textSize(12);
      this.p.text(`Player ${id.substring(0, 4)}`, otherPlayer.x - camX, otherPlayer.y - 10);
    }
  }

  handleKey(key: string): void {
    if (key === " ") {
      this.player.jump();
    }
  }
}