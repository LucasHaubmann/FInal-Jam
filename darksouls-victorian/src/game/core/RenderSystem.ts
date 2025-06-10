import Player from "../classes/Player/Player";

export default class RenderSystem {
  draw(player: Player) {
    const p = player.p;

    // fundo
    p.background(20);

    // player
    p.fill(255);
    p.ellipse(player.pos.x, player.pos.y, 40, 40);

    // chão
    p.fill(100);
    p.rect(0, 680, p.width, p.height - 660);
  }
}