import { motion } from "framer-motion";
import {
  ResolvedBracket,
  ResolvedMatch,
  Team,
  TeamId,
  WorldCupPrediction,
  KnockoutRound,
} from "@shared/types";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { cn } from "../lib/utils";

const roundOrder: KnockoutRound[] = ["R32", "R16", "QF", "SF", "F", "3P"];
const roundLabel: Record<KnockoutRound, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarterfinals",
  SF: "Semifinals",
  F: "Final",
  "3P": "Third place",
};

interface BracketViewProps {
  bracket: ResolvedBracket;
  teamsById: Record<TeamId, Team>;
  prediction: WorldCupPrediction;
  onWinnerChange: (matchId: string, teamId: TeamId) => void;
  onOpenMatch: (match: ResolvedMatch) => void;
}

const teamLabel = (
  teamId: string | undefined,
  teams: Record<TeamId, Team>,
  fallback: string
) => {
  if (!teamId) return fallback;
  const t = teams[teamId];
  if (!t) return fallback;
  return `${t.flagEmoji ?? ""} ${t.name}`;
};

const MatchCard = ({
  match,
  teamsById,
  prediction,
  onWinnerChange,
  onOpenMatch,
}: {
  match: ResolvedMatch;
  teamsById: Record<TeamId, Team>;
  prediction: WorldCupPrediction;
  onWinnerChange: (matchId: string, teamId: TeamId) => void;
  onOpenMatch: (match: ResolvedMatch) => void;
}) => {
  const winner = prediction.knockout.winnersByMatchId[match.id];
  const homeLabel = teamLabel(match.homeTeamId, teamsById, match.homeSlot.label);
  const awayLabel = teamLabel(match.awayTeamId, teamsById, match.awaySlot.label);

  const renderTeamButton = (teamId: TeamId | undefined, label: string) => {
    const chosen = winner === teamId;
    return (
      <Button
        variant={chosen ? "default" : "outline"}
        size="sm"
        className={cn("w-full justify-between", chosen && "ring-2 ring-primary")}
        disabled={!teamId}
        onClick={() => teamId && onWinnerChange(match.id, teamId)}
      >
        <span className="truncate text-left">{label}</span>
        {teamId && <span className="text-xs text-muted-foreground">pick</span>}
      </Button>
    );
  };

  return (
    <Card className="min-w-[240px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>{match.id}</span>
          <Button size="sm" variant="ghost" onClick={() => onOpenMatch(match)}>
            Details
          </Button>
        </CardTitle>
        {match.metadata?.date && (
          <CardDescription>
            {match.metadata.date} · {match.metadata.city ?? "TBD"}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {renderTeamButton(match.homeTeamId, homeLabel)}
        {renderTeamButton(match.awayTeamId, awayLabel)}
      </CardContent>
    </Card>
  );
};

const BracketView = ({
  bracket,
  teamsById,
  prediction,
  onWinnerChange,
  onOpenMatch,
}: BracketViewProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Knockout bracket</h2>
          <p className="text-sm text-muted-foreground">
            Tap a team to advance it. Changes cascade to later rounds automatically.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-full">
          {roundOrder.map((round) => {
            const matches = bracket.matches.filter((m) => m.round === round);
            if (!matches.length) return null;
            return (
              <motion.div
                key={round}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-3"
              >
                <div className="font-semibold text-sm text-muted-foreground px-1">
                  {roundLabel[round]}
                </div>
                {matches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teamsById={teamsById}
                    prediction={prediction}
                    onWinnerChange={onWinnerChange}
                    onOpenMatch={onOpenMatch}
                  />
                ))}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BracketView;

