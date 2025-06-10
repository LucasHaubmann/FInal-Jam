import Player from "../classes/Player/Player";

export default class RenderSystem {
  private worldWidth = 3000; // tamanho total do mundo

  draw(player: Player) {
    const p = player.p;

    p.background(20);

    p.push();

    // Cálculo da posição da câmera
    let camX = player.pos.x - p.width / 2;

    // Limites da câmera
    camX = p.constrain(camX, 0, this.worldWidth - p.width);

    // Move o mundo ao redor do player
    p.translate(-camX, 0);

    // Player
    p.fill(255);
    p.ellipse(player.pos.x, player.pos.y, 40, 40);

    // Chão (longo como o mundo)
    p.fill(100);
    p.rect(0, 680, this.worldWidth, 200);

    // Obstáculo de exemplo
    p.fill(200, 0, 0);
    p.rect(2000, 600, 100, 80); // só será visível quando a câmera chegar lá

    p.pop();
  }
}
