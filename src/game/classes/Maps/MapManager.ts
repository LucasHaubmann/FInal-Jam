import { Obstacle } from "../Obstacles/Obstacle";
import { parseTextMap } from "./MapParser";
import { mapRegistry } from "./MapOrganizer";
import type { LevelId } from "./MapOrganizer";

export class MapManager {
  private obstacles: Obstacle[];

  constructor(levelId: LevelId) {
    console.log(`MapManager: Lendo e decodificando o mapa para o levelId: ${levelId}`);
    const selectedMapData = mapRegistry[levelId] || mapRegistry.level1;
    this.obstacles = parseTextMap(selectedMapData);
  }

  // Método público para entregar os obstáculos que ele criou
  public getParsedObstacles(): Obstacle[] {
    return this.obstacles;
  }
}