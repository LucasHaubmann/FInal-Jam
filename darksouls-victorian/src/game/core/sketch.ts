// src/game/core/sketch.ts
import p5 from "p5";
import Player from "../classes/Player/Player";
import Controller from "../classes/Player/Controller";
import StaminaSystem from "../classes/Player/StaminaSystem";
import PhysicsEngine from "../core/PhysicsEngine";
import RenderSystem from "../core/RenderSystem";
import PlataformsController from "../classes/Plataform/PlataformsController";

let player: Player;
let controller: Controller;
let staminaSystem: StaminaSystem;
let physics: PhysicsEngine;
let renderer: RenderSystem;
let platformController: PlataformsController;

const sketch = (p: p5) => {
  p.setup = () => {
    p.createCanvas(1280, 720);
    platformController = new PlataformsController(p);
    player = new Player(p, p.width / 2, p.height / 2);
    controller = new Controller();
    physics = new PhysicsEngine();
    staminaSystem = new StaminaSystem();
    renderer = new RenderSystem();
  };

  p.draw = () => {
    const platforms = platformController.getPlatforms();

    staminaSystem.update(player, controller);
    physics.applyPhysics(player, controller, platformController);
    renderer.draw(p, player, platforms);
  };

  p.keyPressed = () => {
    controller.handleKeyPressed(p.key.toLowerCase(), p.keyCode);
  };

  p.keyReleased = () => {
    controller.handleKeyReleased(p.key.toLowerCase(), p.keyCode);
  };
};

export default sketch;
