import { Obstacle } from "..//Obstacles/Obstacle";
import { parseTextMap } from "./MapParser";
import { map1 } from "./Map1";

export class MapManager {
  obstacles: Obstacle[];

  constructor() {
    this.obstacles = parseTextMap(map1);
  }

  getObstacles(): Obstacle[] {
    return this.obstacles;
  }
}
