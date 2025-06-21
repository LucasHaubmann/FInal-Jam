import { map1 } from './Map1';
import { map2 } from './Map2';
// Quando você criar o Map3.ts, importe-o aqui também
// import { map3 } from './Map3';

// Este objeto mapeia o ID do nível para a variável do mapa correspondente
export const mapRegistry = {
  level1: map1,
  level2: map2,
  // level3: map3, // E adicione aqui
};

// Exportamos também um tipo para garantir que os IDs sejam válidos
export type LevelId = keyof typeof mapRegistry;