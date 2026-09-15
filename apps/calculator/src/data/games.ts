import type { GameDataset } from "./types";
import { parseGameDatasetXml } from "./xml-parser";

import lrlXml from "./lrl/items.xml";
import satisfactoryXml from "./satisfactory/items.xml";
import factorioXml from "./factorio/items.xml";
import minecraftXml from "./minecraft/items.xml";
import dysonSphereProgramXml from "./dyson-sphere-program/items.xml";
import vfeFactoryXml from "./vfe-factory/items.xml";
import createXml from "./create/items.xml";

export const GAMES_DATA: GameDataset[] = [
  parseGameDatasetXml(lrlXml),
  parseGameDatasetXml(satisfactoryXml),
  parseGameDatasetXml(factorioXml),
  parseGameDatasetXml(minecraftXml),
  parseGameDatasetXml(dysonSphereProgramXml),
  parseGameDatasetXml(vfeFactoryXml),
  parseGameDatasetXml(createXml),
];
