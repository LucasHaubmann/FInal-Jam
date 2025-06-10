import Player from "./Player";
import Controller from "./Controller";

type StaminaConfig = {
  regenRate: number;
  drainRate: number;
  minToRun: number;
};

const defaultConfig: StaminaConfig = {
  regenRate: 0.3,
  drainRate: 0.7,
  minToRun: 5,
};

export default class StaminaSystem {
  private config: StaminaConfig;

  constructor(config: StaminaConfig = defaultConfig) {
    this.config = config;
  }

  update(player: Player, input: Controller) {
    const { drainRate, regenRate, minToRun } = this.config;

    // Se estiver tentando correr
    if (input.run && (input.left || input.right)) {
      player.stamina -= drainRate;
      if (player.stamina < 0) player.stamina = 0;
    } else {
      player.stamina += regenRate;
      if (player.stamina > player.maxStamina) player.stamina = player.maxStamina;
    }

    // Se a stamina estiver abaixo do mínimo, cancela corrida
    if (player.stamina < minToRun) {
      input.run = false;
    }
  }
}
