import { GameCalculatorApp } from "@mono/game-calculator";
import { CREATE_DATA } from "../data";

export default function CreateCalculatorPage() {
  return <GameCalculatorApp dataset={CREATE_DATA} />;
}
