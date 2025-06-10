// src/core/PhysicsEngine.ts
import Player from "../classes/Player/Player";
import Controller from "../classes/Player/Controller";
import type { PlayerState } from "../classes/Player/Types";
import PlataformsController from "../classes/Plataform/PlataformsController";
import type { IPlatform } from "../classes/Plataform/IPlataform";

const defaultState: PlayerState = {
  maxSpeed: 6,
  moveForce: 1,
  runMultiplier: 1.5,
  jumpStrength: -15,
  gravity: 0.8,
  friction: 0.7,
  groundY: 660,
};

export default class PhysicsEngine {
  private state: PlayerState;

  constructor(state: PlayerState = defaultState) {
    this.state = state;
  }

  applyPhysics(player: Player, input: Controller, platforms: PlataformsController) {
    const { gravity, jumpStrength, moveForce, runMultiplier, maxSpeed, friction, groundY } = this.state;
    const p = player.p;

    // gravidade
    player.acc.set(0, gravity);

    // pulo
    if (input.jump && player.isOnGround) {
      player.vel.y = jumpStrength;
      player.isOnGround = false;
    }

    // movimento horizontal
    const running = input.run && player.isOnGround;
    const force = running ? moveForce * runMultiplier : moveForce;

    if (input.left && !input.right) {
      player.acc.x = -force;
    } else if (input.right && !input.left) {
      player.acc.x = force;
    } else if (player.isOnGround) {
      player.vel.x *= friction;
      if (Math.abs(player.vel.x) < 0.1) player.vel.x = 0;
    }

player.vel.add(player.acc);
player.pos.add(player.vel);

// Verificação de colisão com plataformas
const platformsList: IPlatform[] = platforms.getPlatforms();
player.isOnGround = false;

const playerRadius = 20;
let collided = false;

for (const platform of platformsList) {
  const isAboveAndFalling =
    player.pos.y + playerRadius <= platform.pos.y &&
    player.pos.y + player.vel.y + playerRadius >= platform.pos.y &&
    player.pos.x + playerRadius > platform.pos.x &&
    player.pos.x - playerRadius < platform.pos.x + platform.width;

  if (isAboveAndFalling) {
    player.pos.y = platform.pos.y - playerRadius;
    player.vel.y = 0;
    player.isOnGround = true;
    collided = true;
    break;
  }
}

// Corrigir flutuação: verifica se está parado em cima da plataforma
if (!collided) {
  for (const platform of platformsList) {
    const isStandingOn =
      Math.abs(player.pos.y + playerRadius - platform.pos.y) < 1 &&
      player.pos.x + playerRadius > platform.pos.x &&
      player.pos.x - playerRadius < platform.pos.x + platform.width;

    if (isStandingOn) {
      player.pos.y = platform.pos.y - playerRadius;
      player.vel.y = 0;
      player.isOnGround = true;
      collided = true;
      break;
    }
  }
}

    // Verificação extra para manter o player fixo mesmo parado
    if (!collided) {
      for (const platform of platforms.getPlatforms()) {
        const isStandingOn =
          Math.abs(player.pos.y + 40 - platform.pos.y) < 1 &&
          player.pos.x + 20 > platform.pos.x &&
          player.pos.x - 20 < platform.pos.x + platform.width;

        if (isStandingOn) {
          player.pos.y = platform.pos.y - 40;
          player.vel.y = 0;
          player.isOnGround = true;
          collided = true;
          break;
        }
      }
    }

    if (!collided) {
      if (player.pos.y >= groundY) {
        player.pos.y = groundY;
        player.vel.y = 0;
        player.isOnGround = true;
      } else {
        player.isOnGround = false;
      }
    }

    // chão
    if (player.pos.y >= groundY) {
      player.pos.y = groundY;
      player.vel.y = 0;
      player.isOnGround = true;
    }

    // limite lateral
    player.pos.x = p.constrain(player.pos.x, 0, 3000);
    player.vel.x = p.constrain(player.vel.x, -maxSpeed * (running ? runMultiplier : 1), maxSpeed * (running ? runMultiplier : 1));
  }
}
