import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES_DATA } from "../../data/games";
import { GameCalculatorView } from "../../components/calculator-view/game-calculator-view";

export const dynamic = "force-dynamic";

interface GamePageProps {
  params: Promise<{ gameId: string }>;
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const { gameId } = await params;
  const game = GAMES_DATA.find((g) => g.id === gameId);
  if (!game) {
    return {
      title: "Game Not Found",
      description: "Selected game was not found in the Game Production Calculator.",
    };
  }

  return {
    title: game.name,
    description: game.tagline || `Production, crafting recipes, and factory rate calculator for ${game.name}.`,
    alternates: {
      canonical: `/${game.id}`,
    },
    openGraph: {
      title: `${game.name} | Game Production Calculator`,
      description: game.tagline || `Production and crafting recipes for ${game.name}.`,
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const { gameId } = await params;
  const game = GAMES_DATA.find((g) => g.id === gameId);
  if (!game) {
    notFound();
  }

  return <GameCalculatorView gameId={game.id} />;
}