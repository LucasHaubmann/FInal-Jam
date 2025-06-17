import { Obstacle } from "../Obstacles/Obstacle";
import { ObstacleBlock } from "../Obstacles/ObstacleBlock";
import { ObstacleRamp } from "../Obstacles/ObstacleRamp";
import { ObstacleKill } from "../Obstacles/ObstacleKill";

export function createMap1(): Obstacle[] {
  const baseY = 560;
  const blockSize = 40;
  const gap = 20;

  const obstacles: Obstacle[] = [];

  // Rampa inicial
  obstacles.push(new ObstacleRamp(400, baseY, blockSize, blockSize));

  // Blocos suspensos para pular
  let x = 500;
  for (let i = 0; i < 4; i++) {
    obstacles.push(new ObstacleBlock(x, baseY - 100, blockSize, blockSize));
    x += blockSize + gap;
  }

  // Paredão vertical (obrigando a cair)
  for (let j = 0; j < 4; j++) {
    obstacles.push(new ObstacleBlock(700, baseY - j * blockSize, blockSize, blockSize));
  }

  // Blocos mortais no chão
  let killX = 900;
  for (let i = 0; i < 3; i++) {
    obstacles.push(new ObstacleKill(killX, baseY, blockSize, blockSize));
    killX += blockSize + gap;
  }

  // Rampa final de subida
  obstacles.push(new ObstacleRamp(1100, baseY, blockSize, blockSize));

  // Blocos suspensos depois da subida
  let lastX = 1180;
  for (let i = 0; i < 3; i++) {
    obstacles.push(new ObstacleBlock(lastX, baseY - 80, blockSize, blockSize));
    lastX += blockSize + gap;
  }

  return obstacles;
}
