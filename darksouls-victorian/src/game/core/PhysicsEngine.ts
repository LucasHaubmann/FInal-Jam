import Player from "../classes/Player/Player";
import Controller from "../classes/Player/Controller";
import type { PlayerState } from "../classes/Player/Types";

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

  applyPhysics(player: Player, input: Controller) {
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

    // aplicar vetores
    player.vel.add(player.acc);
    player.vel.x = p.constrain(player.vel.x, -maxSpeed * (running ? runMultiplier : 1), maxSpeed * (running ? runMultiplier : 1));
    player.pos.add(player.vel);

    // chão
    if (player.pos.y >= groundY) {
      player.pos.y = groundY;
      player.vel.y = 0;
      player.isOnGround = true;
    } else {
      player.isOnGround = false;
    }
  }
}
