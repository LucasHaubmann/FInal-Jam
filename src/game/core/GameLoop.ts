
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
import { Socket } from "socket.io-client"; // Importar Socket
import { Obstacle } from "../classes/Obstacles/Obstacle"; // Importar Obstacle (se já não estiver)

// Interface para representar dados de outros jogadores
interface OtherPlayer {
  id: string;
  x: number;
  y: number;
  // Adicione outras propriedades que você quer sincronizar (ex: estado de pulo, cor, etc.)
}

export class GameLoop {
  private p: p5;
  private onVictory: () => void;
  private socket: Socket; // A instância do socket
  private player: Player;
  private world: World;
  private camera: Camera;
  private renderSystem: RenderSystem;
  private obstacleManager: ObstacleManager;
  private isPaused: boolean = false;
  private otherPlayers: { [id: string]: OtherPlayer } = {}; // Para armazenar outros jogadores

  constructor(p: p5, onVictory: () => void, socket: Socket) {
    this.p = p;
    this.onVictory = onVictory;
    this.socket = socket; // Atribui o socket passado do sketch

    this.player = new Player(0, 500); //
    const speed = PlayerConfig.speedX * (this.p.deltaTime / 16.67); //
    this.player.x += speed; //
    this.player.physics.vx = speed; //

    this.world = new World(0, 1280 * 2); //
    this.camera = new Camera(1280, this.world.maxX); //
    this.renderSystem = new RenderSystem(p, this.camera, this.player); //
    this.obstacleManager = new ObstacleManager(); //
    PlayerLifeSystem.setInitialPosition(this.player.x, this.player.y); //

    this.setupSocketListeners(); // Configura os listeners do Socket.IO
  }

  // Novo método para configurar os ouvintes do Socket.IO
  private setupSocketListeners(): void {
    this.socket.on("playerConnected", (id: string, x: number, y: number) => {
      console.log(`Player ${id} conectado.`);
      this.otherPlayers[id] = { id, x, y };
    });

    this.socket.on("playerDisconnected", (id: string) => {
      console.log(`Player ${id} desconectado.`);
      delete this.otherPlayers[id];
    });

    this.socket.on("playerUpdate", (playerData: OtherPlayer) => {
      // Atualiza a posição de outros jogadores
      this.otherPlayers[playerData.id] = playerData;
    });

    // Opcional: ouvir um evento de "gameStart" do servidor para sincronizar o início do jogo
    // this.socket.on("gameStart", () => {
    //   this.resume();
    // });
  }

  pause(): void { //
    this.isPaused = true; //
  }

  resume(): void { //
    this.isPaused = false; //
  }

  update(): void { //
    if (this.isPaused) return; //

    // Atualiza física do jogador local
    this.player.update(this.obstacleManager.obstacles); //

    const prevX = this.player.x; //
    const speed = PlayerConfig.speedX; //
    this.player.x += speed; //
    this.player.physics.vx = this.player.x - prevX; //

    // Colisão com rampas
    resolvePlayerPlatformCollision(this.player, this.obstacleManager.obstacles); //

    // Colisão com blocos (todas as direções)
    ObstacleCollision.resolvePlayerBlockCollisions( //
      this.player, //
      this.obstacleManager.obstacles.filter(obs => obs instanceof ObstacleBlock) as ObstacleBlock[] //
    ); //

    // Verifica morte
    for (const obs of this.obstacleManager.obstacles) { //
      if ( //
        obs.isLethal?.() && //
        isRectColliding( //
          this.player.x, //
          this.player.y, //
          PlayerConfig.width, //
          PlayerConfig.height, //
          obs.x, //
          obs.y, //
          obs.width, //
          obs.height //
        ) //
      ) { //
        this.player.physics.state = PlayerState.Death; //
      } //
    } //

    // Atualiza câmera, mundo, etc.
    this.camera.follow(this.player.x); //
    this.world.update(this.player); //

    // Emite a posição do jogador local para o servidor
    this.socket.emit("playerUpdate", {
      id: this.socket.id, // Usa o ID do socket como ID do jogador
      x: this.player.x,
      y: this.player.y,
      // Adicione outras propriedades para sincronizar, ex:
      // state: this.player.physics.state,
      // color: this.player.color,
    });

    // Verifica se chegou ao fim do mapa (ganhou)
    if (this.player.x + PlayerConfig.width >= this.world.maxX) { //
      this.onVictory(); // Chama o modal
      return; // Impede que o jogo continue atualizando
    }

    PlayerLifeSystem.handleDeath(this.player); //
  }

  render(): void { //
    this.renderSystem.render(); //
    this.world.render(this.renderSystem.p, this.camera.getOffset()); //
    this.obstacleManager.render(this.renderSystem.p, this.camera.getOffset()); //

    // Renderizar outros jogadores
    const camX = this.camera.getOffset(); //
    for (const id in this.otherPlayers) {
      if (id === this.socket.id) continue; // Não renderiza o próprio jogador novamente

      const otherPlayer = this.otherPlayers[id];
      this.p.fill(0, 150, 255); // Cor diferente para outros jogadores
      this.p.rect(otherPlayer.x - camX, otherPlayer.y, PlayerConfig.width, PlayerConfig.height); //
      this.p.fill(255); // Cor do texto
      this.p.textSize(12);
      this.p.text(`Player ${id.substring(0, 4)}`, otherPlayer.x - camX, otherPlayer.y - 10); // Mostra o ID
    }
  }

  handleKey(key: string): void { //
    if (key === " ") { //
      this.player.jump(); //
      // Opcional: emitir evento de pulo para o servidor para que outros clientes possam reagir
      // this.socket.emit("playerJump", { id: this.socket.id, y: this.player.y });
    }
  }
}