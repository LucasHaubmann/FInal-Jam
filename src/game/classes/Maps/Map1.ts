import { Obstacle } from "../Obstacles/Obstacle";
import { ObstacleBlock } from "../Obstacles/ObstacleBlock";
import { ObstacleRamp } from "../Obstacles/ObstacleRamp";
import { ObstacleKill } from "../Obstacles/ObstacleKill";

export function createMap1(): Obstacle[] {
  const baseY = 560;
  const blockSize = 60;
  const gap = 20;
  const obstacles: Obstacle[] = [];

  // Rampa inicial
  obstacles.push(new ObstacleRamp(380, 580, blockSize, blockSize));
  obstacles.push(new ObstacleRamp(440, 520, blockSize, blockSize));
  obstacles.push(new ObstacleRamp(500, 460, blockSize, blockSize));




  return obstacles;
}
