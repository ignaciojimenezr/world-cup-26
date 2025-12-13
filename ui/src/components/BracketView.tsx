import { useState } from "react";
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
import { cn } from "../lib/utils";

const roundOrder: KnockoutRound[] = ["R32", "R16", "QF", "SF", "F", "3P"];
const roundLabels: Record<KnockoutRound, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarterfinals",
  SF: "Semifinals",
  F: "Final",
  "3P": "3rd Place",
};

// Split matches into left/right halves for display
const isLeftHalf = (matchId: string): boolean => {
  const match = matchId.match(/(\w+)-M(\d+)/);
  if (!match) return true;
  const [, round, numStr] = match;
  const num = parseInt(numStr, 10);
  
  switch (round) {
    case "R32": return num <= 8;
    case "R16": return num <= 4;
    case "QF": return num <= 2;
    case "SF": return num === 1;
    default: return true;
  }
};

interface BracketViewProps {
  bracket: ResolvedBracket;
  teamsById: Record<TeamId, Team>;
  prediction: WorldCupPrediction;
  onWinnerChange: (matchId: string, teamId: TeamId) => void;
  onOpenMatch: (match: ResolvedMatch) => void;
  onSave: () => void;
  onBack: () => void;
}

const teamDisplay = (
  teamId: string | undefined,
  teams: Record<TeamId, Team>
): { flag: string; name: string; hasTeam: boolean } => {
  if (!teamId) return { flag: "❓", name: "TBD", hasTeam: false };
  const t = teams[teamId];
  if (!t) return { flag: "❓", name: "TBD", hasTeam: false };
  return { flag: t.flagEmoji ?? "🏳️", name: t.shortName ?? t.name, hasTeam: true };
};

const MatchCard = ({
  match,
  teamsById,
  prediction,
  onWinnerChange,
}: {
  match: ResolvedMatch;
  teamsById: Record<TeamId, Team>;
  prediction: WorldCupPrediction;
  onWinnerChange: (matchId: string, teamId: TeamId) => void;
}) => {
  const winner = prediction.knockout.winnersByMatchId[match.id];
  const home = teamDisplay(match.homeTeamId, teamsById);
  const away = teamDisplay(match.awayTeamId, teamsById);
  const bothTeamsReady = home.hasTeam && away.hasTeam;

  const TeamButton = ({ teamId, flag, name, hasTeam }: { 
    teamId?: TeamId; flag: string; name: string; hasTeam: boolean 
  }) => {
    const isWinner = winner === teamId;
    const canPick = hasTeam && bothTeamsReady;
    
    return (
      <button
        onClick={() => teamId && canPick && onWinnerChange(match.id, teamId)}
        disabled={!canPick}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-all w-full",
          isWinner && "bg-green-600 text-white",
          !isWinner && hasTeam && canPick && "bg-slate-700 hover:bg-slate-600 cursor-pointer",
          !isWinner && hasTeam && !canPick && "bg-slate-800 text-slate-400",
          !hasTeam && "bg-slate-800/50 text-slate-500 italic"
        )}
      >
        <span className="text-lg">{flag}</span>
        <span className="font-medium text-sm">{name}</span>
        {isWinner && <span className="ml-auto">✓</span>}
      </button>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-xl p-3 border border-slate-700 w-full max-w-[280px]"
    >
      <div className="text-xs text-slate-500 mb-2 flex justify-between">
        <span className="font-semibold">{match.id}</span>
        {match.metadata?.city && <span>{match.metadata.city}</span>}
      </div>
      <div className="space-y-2">
        <TeamButton teamId={match.homeTeamId} {...home} />
        <div className="text-center text-xs text-slate-600">vs</div>
        <TeamButton teamId={match.awayTeamId} {...away} />
      </div>
    </motion.div>
  );
};

const RoundSection = ({
  round,
  matches,
  teamsById,
  prediction,
  onWinnerChange,
}: {
  round: KnockoutRound;
  matches: ResolvedMatch[];
  teamsById: Record<TeamId, Team>;
  prediction: WorldCupPrediction;
  onWinnerChange: (matchId: string, teamId: TeamId) => void;
}) => {
  const leftMatches = matches.filter(m => isLeftHalf(m.id));
  const rightMatches = matches.filter(m => !isLeftHalf(m.id));
  
  // For Final and 3rd Place, just center them
  const isCenterOnly = round === "F" || round === "3P";
  
  // Count completed picks
  const completedCount = matches.filter(m => prediction.knockout.winnersByMatchId[m.id]).length;
  const allComplete = completedCount === matches.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-3">
        <h3 className="text-lg font-bold text-center">{roundLabels[round]}</h3>
        <span className={cn(
          "text-xs px-2 py-0.5 rounded-full",
          allComplete ? "bg-green-600 text-white" : "bg-slate-700 text-slate-300"
        )}>
          {completedCount}/{matches.length}
        </span>
      </div>

      {isCenterOnly ? (
        <div className="flex justify-center">
          {matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              teamsById={teamsById}
              prediction={prediction}
              onWinnerChange={onWinnerChange}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Left Half */}
          {leftMatches.length > 0 && (
            <div>
              <div className="text-xs text-slate-500 text-center mb-2">
                Bracket A ({round === "R32" ? "M1-M8" : round === "R16" ? "M1-M4" : round === "QF" ? "M1-M2" : "M1"})
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {leftMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teamsById={teamsById}
                    prediction={prediction}
                    onWinnerChange={onWinnerChange}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Right Half */}
          {rightMatches.length > 0 && (
            <div>
              <div className="text-xs text-slate-500 text-center mb-2">
                Bracket B ({round === "R32" ? "M9-M16" : round === "R16" ? "M5-M8" : round === "QF" ? "M3-M4" : "M2"})
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {rightMatches.map(match => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    teamsById={teamsById}
                    prediction={prediction}
                    onWinnerChange={onWinnerChange}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BracketView = ({
  bracket,
  teamsById,
  prediction,
  onWinnerChange,
  onSave,
  onBack,
}: BracketViewProps) => {
  const [activeRound, setActiveRound] = useState<KnockoutRound>("R32");

  // Get matches for active round
  const activeMatches = bracket.matches.filter(m => m.round === activeRound);

  // Get the predicted champion
  const final = bracket.matches.find(m => m.round === "F");
  const finalWinnerId = final ? prediction.knockout.winnersByMatchId[final.id] : undefined;
  const champion = finalWinnerId ? teamsById[finalWinnerId] : undefined;

  // Count completed by round
  const getCompletedCount = (round: KnockoutRound) => {
    const matches = bracket.matches.filter(m => m.round === round);
    return {
      completed: matches.filter(m => prediction.knockout.winnersByMatchId[m.id]).length,
      total: matches.length,
    };
  };

  return (
    <div className="space-y-4">
      {/* Header with champion display */}
      <div className="text-center">
        <h2 className="text-xl font-bold mb-1">🏆 Knockout Bracket</h2>
        {champion ? (
          <div className="text-lg">
            <span className="text-yellow-400 font-semibold">Champion: </span>
            <span className="text-2xl">{champion.flagEmoji}</span>
            <span className="ml-1 font-bold">{champion.name}</span>
          </div>
        ) : (
          <p className="text-sm text-slate-500">{roundLabels[activeRound]} - Pick winners to advance</p>
        )}
      </div>

      {/* Active round matches */}
      <RoundSection
        round={activeRound}
        matches={activeMatches}
        teamsById={teamsById}
        prediction={prediction}
        onWinnerChange={onWinnerChange}
      />

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-3 pt-4">
        {/* Back button - go to previous round or third place */}
        {(() => {
          const currentIndex = roundOrder.indexOf(activeRound);
          if (currentIndex > 0) {
            const prevRound = roundOrder[currentIndex - 1];
            return (
              <Button variant="outline" onClick={() => setActiveRound(prevRound)}>
                ← Back to {roundLabels[prevRound]}
              </Button>
            );
          }
          return (
            <Button variant="outline" onClick={onBack}>
              ← Back to Third Place
            </Button>
          );
        })()}
        
        {/* Continue to next round */}
        {(() => {
          const { completed, total } = getCompletedCount(activeRound);
          const isComplete = completed === total && total > 0;
          const currentIndex = roundOrder.indexOf(activeRound);
          const nextRound = currentIndex < roundOrder.length - 1 ? roundOrder[currentIndex + 1] : null;
          
          if (isComplete && nextRound) {
            return (
              <Button 
                onClick={() => setActiveRound(nextRound)}
                className="bg-green-600 hover:bg-green-700"
              >
                Continue to {roundLabels[nextRound]} →
              </Button>
            );
          }
          return null;
        })()}

        {/* Show Save when all rounds complete */}
        {(() => {
          const allComplete = roundOrder.every(round => {
            const { completed, total } = getCompletedCount(round);
            return completed === total && total > 0;
          });
          
          if (allComplete) {
            return (
              <Button onClick={onSave} className="bg-yellow-600 hover:bg-yellow-700">
                💾 Save Prediction
              </Button>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
};

export default BracketView;
