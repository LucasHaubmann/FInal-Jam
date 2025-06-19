import { Obstacle } from "../Obstacles/Obstacle";
import { ObstacleBlock } from "../Obstacles/ObstacleBlock";
import { ObstacleRamp } from "../Obstacles/ObstacleRamp";

const TILE_SIZE = 40;

export function parseTextMap(map: string[]): Obstacle[] {
  const obstacles: Obstacle[] = [];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const char = map[row][col];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      if (char === 'b') {
        obstacles.push(new ObstacleBlock(x, y, TILE_SIZE, TILE_SIZE));
      } else if (char === 'r') {
        obstacles.push(new ObstacleRamp(x, y, TILE_SIZE, TILE_SIZE));
      }
    }
  }

  return obstacles;
}