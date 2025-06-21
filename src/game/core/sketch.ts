import p5 from "p5";
import { GameLoop } from "./GameLoop";
import { Socket } from "socket.io-client";

let paused = false;

export const setPaused = (value: boolean) => {
  paused = value;
};

export const sketch = (p: p5, onVictory: () => void, socket: Socket) => {
  let gameLoop: GameLoop | undefined;

  console.log("Sketch carregado!");

  p.setup = () => {
    paused = false; // 🔁 Reset obrigatório para não travar no "replay"
    const canvas = p.createCanvas(1280, 720);
    canvas.parent("sketch-container");
    canvas.style("position", "absolute");
    canvas.style("top", "50%");
    canvas.style("left", "50%");
    canvas.style("transform", "translate(-50%, -50%)");
    p.background(20); // 🔴 força cor de fundo — se não tiver render ainda, evita tela preta

    // 🔥 Não bloqueia mais por causa do socket
    if (!socket) {
      console.warn("Socket inválido. Jogo pode falhar.");
    }

    gameLoop = new GameLoop(p, onVictory, socket);
  };

p.draw = () => {
  if (paused || !gameLoop) {
    p.background(20); // 🔴 evita flicker ou tela preta no meio do ciclo
    return;
  }

  gameLoop.update();
  gameLoop.render();
}

  p.keyPressed = () => {
    if (gameLoop) {
      gameLoop.handleKey(p.key);
    }
  };
};
