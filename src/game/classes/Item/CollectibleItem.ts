import p5 from "p5";
import { Item, type ItemType } from "./Item";

export class CollectibleItem extends Item {
  render(p: p5, camX: number): void {
    if (this.isCollected) return;

    p.push();
    p.strokeWeight(2);
    
    if (this.type === 'rocket_item') {
      p.fill(220, 40, 40, 200);
      p.stroke(255, 150, 150);
    } else { // elixir_item
      p.fill(40, 220, 40, 200);
      p.stroke(150, 255, 150);
    }
    p.rect(this.x - camX, this.y, this.width, this.height);
    
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(30);
    p.text('?', this.x - camX + this.width / 2, this.y + this.height / 2);

    p.pop();
  }
}
