import type { ArchitectureNode } from "./types";
import { coreNodes } from "./architecture/coreNodes";
import { featureNodes } from "./architecture/featureNodes";
import { commitHistoryNode } from "./architecture/commitHistory";

export const architectureNodes: ArchitectureNode[] = [
  ...coreNodes,
  ...featureNodes,
  commitHistoryNode,
];
