import p5 from "p5";
import { Player } from "../Player/Player";
import { PlayerConfig } from "../Player/PlayerConfig"; // ✅ IMPORTADO

export type ItemType = 'rocket_item' | 'elixir_item';

export abstract class Item {
  public id: string;
  public type: ItemType;
  public x: number;
  public y: number;
  public width: number = 40;
  public height: number = 40;
  public isCollected: boolean = false;

  constructor(x: number, y: number, type: ItemType) {
    this.id = `${type}-${x}-${y}`;
    this.x = x;
    this.y = y;
    this.type = type;
  }

  checkCollision(player: Player): boolean {
    if (this.isCollected) return false;
    
    // ✅ CORRIGIDO: Usa PlayerConfig para as dimensões do jogador
    const collected = 
        player.x < this.x + this.width &&
        player.x + PlayerConfig.width > this.x &&
        player.y < this.y + this.height &&
        player.y + PlayerConfig.height > this.y;

    if (collected) {
      this.isCollected = true;
    }
    return collected;
  }

  abstract render(p: p5, camX: number): void;
}
