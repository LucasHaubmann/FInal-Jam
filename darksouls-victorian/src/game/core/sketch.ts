// src/sketch.ts
import p5 from "p5";
import Player from "../classes/Player/Player";
import Controller from "../classes/Player/Controller";
import PhysicsEngine from "../core/PhysicsEngine";
import RenderSystem from "../core/RenderSystem";

let player: Player;
let controller: Controller;
let physics: PhysicsEngine;
let renderer: RenderSystem;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(1280, 720);
    player = new Player(p, p.width / 2, p.height / 2);
    controller = new Controller();
    physics = new PhysicsEngine();
    renderer = new RenderSystem();
  };

  p.draw = () => {
    physics.applyPhysics(player, controller);
    renderer.draw(player);
  };

  p.keyPressed = () => {
    controller.handleKeyPressed(p.key.toLowerCase(), p.keyCode);
  };

  p.keyReleased = () => {
    controller.handleKeyReleased(p.key.toLowerCase(), p.keyCode);
  };
};

export default sketch;
