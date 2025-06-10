export default class Controller {
  public left = false;
  public right = false;
  public jump = false;
  public run = false;

  handleKeyPressed(key: string, keyCode: number) {
    if (key === "a") this.left = true;
    if (key === "d") this.right = true;
    if (key === " ") this.jump = true;
    if (keyCode === 16) this.run = true;
  }

  handleKeyReleased(key: string, keyCode: number) {
    if (key === "a") this.left = false;
    if (key === "d") this.right = false;
    if (key === " ") this.jump = false;
    if (keyCode === 16) this.run = false;
  }
}
