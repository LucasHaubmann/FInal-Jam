import p5 from "p5";

export default class Player {
  private p: p5;

  // Vetores
  private pos: p5.Vector;
  private vel: p5.Vector;
  private acc: p5.Vector;

  // Física
  private gravity = 0.8;
  private jumpStrength = -15;
  private moveAccel = 1;
  private runMultiplier = 1.5;
  private maxSpeed = 6;
  private friction = 0.7;

  // Estado
  private isOnGround = false;
  private isRunning = false;
  private jumpPressed = false;

  // Teclas pressionadas
  private pressedKeys: Set<string> = new Set();

  // Ambiente
  private groundY: number;

  constructor(x: number, y: number, p: p5) {
    this.p = p;
    this.pos = p.createVector(x, y);
    this.vel = p.createVector(0, 0);
    this.acc = p.createVector(0, 0);
    this.groundY = p.height - 60;
  }

  // --- ENTRADA ---
  public handleKeyPressed(key: string, keyCode: number) {
    this.pressedKeys.add(key);

    if (key === " ") this.jumpPressed = true;
    if (keyCode === 16 && (this.pressedKeys.has("a") || this.pressedKeys.has("d"))) {
      this.isRunning = true;
    }
  }

  public handleKeyReleased(key: string, keyCode: number) {
    this.pressedKeys.delete(key);

    if (key === " ") this.jumpPressed = false;
    if (keyCode === 16) this.isRunning = false;
  }

  // --- UPDATE ---
  public update() {
    this.handleMovement();
    this.applyPhysics();
    this.checkGroundCollision();
  }

  private handleMovement() {
    this.acc.set(0, this.gravity);

    const left = this.pressedKeys.has("a");
    const right = this.pressedKeys.has("d");
    const hasDirection = left !== right;

    // Corrida só com direção ativa
    if (!hasDirection) {
      this.isRunning = false;

      if (this.isOnGround) {
        this.vel.x *= this.friction;
        if (Math.abs(this.vel.x) < 0.1) this.vel.x = 0;
      }
      return;
    }

    let force = this.moveAccel;
    if (this.isRunning && this.isOnGround) {
      force *= this.runMultiplier;
    }

    if (left) this.acc.x -= force;
    if (right) this.acc.x += force;

    // Pulo
    if (this.jumpPressed && this.isOnGround) {
      this.vel.y = this.jumpStrength;
      this.isOnGround = false;
    }
  }

  private applyPhysics() {
    this.vel.add(this.acc);

    const max = this.isRunning && this.isOnGround
      ? this.maxSpeed * this.runMultiplier
      : this.maxSpeed;

    this.vel.x = this.p.constrain(this.vel.x, -max, max);
    this.pos.add(this.vel);
  }

  private checkGroundCollision() {
    if (this.pos.y >= this.groundY) {
      this.pos.y = this.groundY;
      this.vel.y = 0;
      this.isOnGround = true;
    } else {
      this.isOnGround = false;
    }
  }

  // --- RENDER ---
  public display() {
    const p = this.p;

    // Jogador
    p.fill(255);
    p.ellipse(this.pos.x, this.pos.y, 40, 40);

    // Chão
    p.fill(100);
    p.rect(0, this.groundY + 20, p.width, p.height - this.groundY);

    this.debug();
  }

  private debug() {
    const p = this.p;
    p.push();
    p.fill(255);
    p.textSize(16);
    p.textAlign(p.LEFT, p.TOP);

    const info = [
      `vel.x: ${this.vel.x.toFixed(2)}`,
      `acc.x: ${this.acc.x.toFixed(2)}`,
      `isRunning: ${this.isRunning}`,
      `left: ${this.pressedKeys.has("a")}`,
      `right: ${this.pressedKeys.has("d")}`,
      `isOnGround: ${this.isOnGround}`,
    ];

    info.forEach((line, index) => {
      p.text(line, 10, 10 + index * 20);
    });

    p.pop();
  }
}
