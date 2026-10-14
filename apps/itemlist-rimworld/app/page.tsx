import { GameCalculatorApp } from "@mono/game-calculator";
import { RIMWORLD_DATA } from "../data";

export default function RimWorldCalculatorPage() {
  return <GameCalculatorApp dataset={RIMWORLD_DATA} />;
}
