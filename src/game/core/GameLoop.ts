// src/game/core/GameLoop.ts
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
import { Socket } from "socket.io-client";
import { Obstacle } from "../classes/Obstacles/Obstacle";

// Interface para representar dados de outros jogadores
interface OtherPlayer {
  id: string;
  x: number;
  y: number;
  // Adicione outras propriedades que você quer sincronizar (ex: estado de pulo, cor, nome)
  // playerName?: string; // Exemplo
  // color?: string; // Exemplo
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

  constructor(p: p5, onVictory: () => void, socket: Socket) {
    this.p = p;
    this.onVictory = onVictory;
    this.socket = socket;

    // Posição inicial do player LOCAL.
    // É importante que essa posição seja a mesma inicial do servidor!
    this.player = new Player(0, 500); //

    const speed = PlayerConfig.speedX * (this.p.deltaTime / 16.67);
    this.player.x += speed;
    this.player.physics.vx = speed;

    this.world = new World(0, 1280 * 2);
    this.camera = new Camera(1280, this.world.maxX);
    this.renderSystem = new RenderSystem(p, this.camera, this.player);
    this.obstacleManager = new ObstacleManager();
    PlayerLifeSystem.setInitialPosition(this.player.x, this.player.y);

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
    // 🟢 NOVO: Ouve para receber a lista de jogadores existentes ao se conectar
    this.socket.on("currentPlayers", (playersData: { [id: string]: OtherPlayer }) => {
      console.log("Recebendo jogadores atuais:", playersData);
      for (const id in playersData) {
        if (id !== this.socket.id) { // Não se adicione à lista de "outros" jogadores
          this.otherPlayers[id] = playersData[id];
        }
      }
    });

    // 🟢 ALTERADO: Ouve para novos jogadores (recebe o objeto completo do player)
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
      // Atualiza a posição de outros jogadores
      if (playerData.id !== this.socket.id) { // Evita atualizar o próprio player via broadcast
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

    this.camera.follow(this.player.x);
    this.world.update(this.player);

    // Emite a posição do jogador local para o servidor
    this.socket.emit("playerUpdate", {
      id: this.socket.id,
      x: this.player.x,
      y: this.player.y,
      // Se você adicionar playerName no servidor, também envie aqui:
      // playerName: "Jogador " + this.socket.id.substring(0, 4),
      // state: this.player.physics.state, // Se quiser sincronizar o estado (pulando, caindo)
    });

    if (this.player.x + PlayerConfig.width >= this.world.maxX) {
      this.onVictory();
      return;
    }

    PlayerLifeSystem.handleDeath(this.player);
  }

  render(): void {
    this.renderSystem.render();
    this.world.render(this.renderSystem.p, this.camera.getOffset());
    this.obstacleManager.render(this.renderSystem.p, this.camera.getOffset());

    const camX = this.camera.getOffset();
    for (const id in this.otherPlayers) {
      if (id === this.socket.id) continue;

      const otherPlayer = this.otherPlayers[id];
      this.p.fill(0, 150, 255); // Cor diferente para outros jogadores
      this.p.rect(otherPlayer.x - camX, otherPlayer.y, PlayerConfig.width, PlayerConfig.height);
      this.p.fill(255);
      this.p.textSize(12);
      // Você pode exibir o nome do jogador se estiver enviando:
      // this.p.text(otherPlayer.playerName || `Player ${id.substring(0, 4)}`, otherPlayer.x - camX, otherPlayer.y - 10);
      this.p.text(`Player ${id.substring(0, 4)}`, otherPlayer.x - camX, otherPlayer.y - 10);
    }
  }

  handleKey(key: string): void {
    if (key === " ") {
      this.player.jump();
      // Opcional: emitir evento de pulo para o servidor para que outros clientes possam reagir
      // this.socket.emit("playerJump", { id: this.socket.id, y: this.player.y });
    }
  }
}