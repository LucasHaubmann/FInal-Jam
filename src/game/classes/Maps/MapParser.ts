import { Obstacle } from "../Obstacles/Obstacle";
import { ObstacleBlock } from "../Obstacles/ObstacleBlock";
import { ObstacleRamp } from "../Obstacles/ObstacleRamp";
import { ObstacleKill } from "../Obstacles/ObstacleKill"; // ✅ bloco letal
import { ObstacleFakeBlock } from "../Obstacles/ObstacleFakeBlock"; // ✅ 1. IMPORTA A NOVA CLASSE

const TILE_SIZE = 40;

export function parseTextMap(map: string[]): Obstacle[] {
  const obstacles: Obstacle[] = [];

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const char = map[row][col];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      switch (char) {
        case 'b':
          obstacles.push(new ObstacleBlock(x, y, TILE_SIZE, TILE_SIZE));
          break;
        case 'r':
          obstacles.push(new ObstacleRamp(x, y, TILE_SIZE, TILE_SIZE));
          break;
        case 'k':
          obstacles.push(new ObstacleKill(x, y, TILE_SIZE, TILE_SIZE));
          break;
        case 'f':
          obstacles.push(new ObstacleFakeBlock(x, y, TILE_SIZE, TILE_SIZE));
          break;
        default:
          break;
      }
    }
  }

  return obstacles;
}
