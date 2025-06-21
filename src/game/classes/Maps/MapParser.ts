import { Obstacle } from "../Obstacles/Obstacle";
import { ObstacleBlock } from "../Obstacles/ObstacleBlock";
import { ObstacleRamp } from "../Obstacles/ObstacleRamp";
import { ObstacleKill } from "../Obstacles/ObstacleKill";
import { ObstacleFakeBlock } from "../Obstacles/ObstacleFakeBlock";
import { CollectibleItem } from "../Item/CollectibleItem"; // ✅ Importa a nova classe de item

const TILE_SIZE = 40;

// ✅ A função agora pode retornar uma mistura de Obstáculos e Itens
export function parseTextMap(map: string[]): (Obstacle | CollectibleItem)[] {
  const objects: (Obstacle | CollectibleItem)[] = []; 

  for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[row].length; col++) {
      const char = map[row][col];
      const x = col * TILE_SIZE;
      const y = row * TILE_SIZE;

      switch (char) {
        case 'b':
          objects.push(new ObstacleBlock(x, y, TILE_SIZE, TILE_SIZE));
          break;
        case 'r':
          objects.push(new ObstacleRamp(x, y, TILE_SIZE, TILE_SIZE));
          break;
        case 'k':
          objects.push(new ObstacleKill(x, y, TILE_SIZE, TILE_SIZE));
          break;
        case 'f':
          objects.push(new ObstacleFakeBlock(x, y, TILE_SIZE, TILE_SIZE));
          break;
        // ✅ Adiciona os novos cases para os itens
        case '$': // Foguete
          objects.push(new CollectibleItem(x, y, 'rocket_item'));
          break;
        case '*': // Elixir
          objects.push(new CollectibleItem(x, y, 'elixir_item'));
          break;

        default:
          break;
      }
    }
  }

  return objects;
}
