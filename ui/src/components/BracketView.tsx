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

const roundOrder: KnockoutRound[] = ["R32", "R16", "QF", "SF", "F"];
const roundLabels: Record<KnockoutRound, string> = {
  R32: "Round of 32",
  R16: "Round of 16",
  QF: "Quarterfinals",
  SF: "Semifinals",
  F: "Final",
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

// Find next round match that this match feeds into
const getNextMatch = (matchId: string, bracket: ResolvedBracket): ResolvedMatch | undefined => {
  return bracket.matches.find(m => {
    const homeSource = m.homeSlot.source;
    const awaySource = m.awaySlot.source;
    return (homeSource?.type === "winner-of-match" && homeSource.matchId === matchId) ||
           (awaySource?.type === "winner-of-match" && awaySource.matchId === matchId);
  });
};

// Check if next match has both teams determined
const isNextMatchReady = (nextMatch: ResolvedMatch): boolean => {
  return Boolean(nextMatch.homeTeamId && nextMatch.awayTeamId);
};

const MatchCard = ({
  match,
  teamsById,
  prediction,
  onWinnerChange,
  bracket,
  index,
  total,
}: {
  match: ResolvedMatch;
  teamsById: Record<TeamId, Team>;
  prediction: WorldCupPrediction;
  onWinnerChange: (matchId: string, teamId: TeamId) => void;
  bracket: ResolvedBracket;
  index: number;
  total: number;
}) => {
  const winner = prediction.knockout.winnersByMatchId[match.id];
  const home = teamDisplay(match.homeTeamId, teamsById);
  const away = teamDisplay(match.awayTeamId, teamsById);
  const bothTeamsReady = home.hasTeam && away.hasTeam;
  const nextMatch = getNextMatch(match.id, bracket);
  const winnerTeam = winner ? teamsById[winner] : undefined;

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
          "flex items-center gap-1 px-1.5 py-0.5 rounded transition-all w-full text-[10px]",
          isWinner && "bg-green-600 text-white",
          !isWinner && hasTeam && canPick && "bg-slate-700 hover:bg-slate-600 cursor-pointer",
          !isWinner && hasTeam && !canPick && "bg-slate-800 text-slate-400",
          !hasTeam && "bg-slate-800/50 text-slate-500 italic"
        )}
      >
        <span className="text-xs">{flag}</span>
        <span className="font-medium flex-1 truncate text-[10px]">{name}</span>
        {isWinner && <span className="text-[9px]">✓</span>}
      </button>
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-lg p-1.5 border border-slate-700 w-[110px] flex-shrink-0"
    >
      <div className="text-[10px] text-slate-500 mb-0.5 flex justify-between">
        <span className="font-semibold text-[9px]">{match.id}</span>
        {match.metadata?.city && <span className="text-[9px] truncate max-w-[40px]">{match.metadata.city}</span>}
      </div>
      <div className="space-y-0.5">
        <TeamButton teamId={match.homeTeamId} {...home} />
        <div className="text-center text-[9px] text-slate-600">vs</div>
        <TeamButton teamId={match.awayTeamId} {...away} />
      </div>
    </motion.div>
  );
};

type BracketHalf = "left" | "right";

const RoundSection = ({
  round,
  matches,
  teamsById,
  prediction,
  onWinnerChange,
  bracketHalf,
  onBracketHalfChange,
  bracket,
}: {
  round: KnockoutRound;
  matches: ResolvedMatch[];
  teamsById: Record<TeamId, Team>;
  prediction: WorldCupPrediction;
  onWinnerChange: (matchId: string, teamId: TeamId) => void;
  bracketHalf: BracketHalf;
  onBracketHalfChange: (half: BracketHalf) => void;
  bracket: ResolvedBracket;
}) => {
  const leftMatches = matches.filter(m => isLeftHalf(m.id));
  const rightMatches = matches.filter(m => !isLeftHalf(m.id));
  
  // For Final, center it
  const isCenterOnly = round === "F";
  
  // Special handling for Semifinals - show both brackets side by side with final above
  const isSemifinals = round === "SF";
  
  // Count completed picks
  const completedCount = matches.filter(m => prediction.knockout.winnersByMatchId[m.id]).length;
  const allComplete = completedCount === matches.length;

  // Get matches for current bracket half
  const currentMatches = bracketHalf === "left" ? leftMatches : rightMatches;
  const leftComplete = leftMatches.filter(m => prediction.knockout.winnersByMatchId[m.id]).length === leftMatches.length;
  const rightComplete = rightMatches.filter(m => prediction.knockout.winnersByMatchId[m.id]).length === rightMatches.length;

  // Semifinals special layout: show final above, both brackets side by side below
  if (isSemifinals) {
    // Find matches by ID to ensure we get both, even if filtering fails
    const leftMatch = leftMatches[0] || matches.find(m => m.id === "SF-M1");
    const rightMatch = rightMatches[0] || matches.find(m => m.id === "SF-M2");
    const finalMatch = bracket.matches.find(m => m.round === "F");
    
    const leftWinner = leftMatch ? prediction.knockout.winnersByMatchId[leftMatch.id] : undefined;
    const rightWinner = rightMatch ? prediction.knockout.winnersByMatchId[rightMatch.id] : undefined;
    const bothSemifinalsComplete = leftWinner && rightWinner;
    const finalWinner = finalMatch ? prediction.knockout.winnersByMatchId[finalMatch.id] : undefined;
    
    // Determine title: "Semifinals" -> "Finals" -> "Champion"
    let title = roundLabels[round];
    if (bothSemifinalsComplete && !finalWinner) {
      title = "Finals";
    } else if (finalWinner) {
      title = "Champion";
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3">
          <h3 className="text-lg font-bold text-center">{title}</h3>
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            allComplete ? "bg-green-600 text-white" : "bg-slate-700 text-slate-300"
          )}>
            {completedCount}/{matches.length}
          </span>
        </div>
        
        {/* Final match displayed above */}
        {finalMatch && (
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs text-slate-400 font-medium">Final</div>
            <div className="bg-slate-800 rounded-lg p-1.5 border border-slate-600 w-[110px]">
              <div className="text-[10px] text-slate-400 mb-0.5 flex justify-between">
                <span className="font-semibold text-[9px]">{finalMatch.id}</span>
                {finalMatch.metadata?.city && <span className="text-[9px] truncate max-w-[40px]">{finalMatch.metadata.city}</span>}
              </div>
              <div className="space-y-0.5">
                <div className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]",
                  leftWinner ? "bg-slate-700/50" : "bg-slate-800/30 opacity-50"
                )}>
                  <span className="text-xs">{teamDisplay(leftWinner, teamsById).flag}</span>
                  <span className="font-medium flex-1 truncate text-[10px]">{teamDisplay(leftWinner, teamsById).name}</span>
                </div>
                <div className="text-center text-[9px] text-slate-500">vs</div>
                <div className={cn(
                  "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px]",
                  rightWinner ? "bg-slate-700/50" : "bg-slate-800/30 opacity-50"
                )}>
                  <span className="text-xs">{teamDisplay(rightWinner, teamsById).flag}</span>
                  <span className="font-medium flex-1 truncate text-[10px]">{teamDisplay(rightWinner, teamsById).name}</span>
                </div>
              </div>
            </div>
            {/* Lines connecting to semifinals */}
            {bothSemifinalsComplete && (
              <div className="relative w-full flex justify-center">
                <svg className="absolute" width="300" height="40" style={{ pointerEvents: 'none', overflow: 'visible' }}>
                  <path
                    d="M 150,0 L 150,20 M 150,20 L 75,20 M 150,20 L 225,20"
                    stroke="#64748b"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </div>
        )}
        
        {/* Both semifinal matches side by side */}
        <div className="flex flex-wrap justify-center gap-8">
          {/* Left bracket */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs text-slate-400 font-medium">Left bracket</div>
            {leftMatch && (
              <MatchCard
                match={leftMatch}
                teamsById={teamsById}
                prediction={prediction}
                onWinnerChange={onWinnerChange}
                bracket={bracket}
                index={0}
                total={1}
              />
            )}
            {/* Line connecting to final */}
            {leftWinner && finalMatch && (
              <div className="relative w-full flex justify-center mt-2">
                <svg className="absolute" width="120" height="30" style={{ pointerEvents: 'none', overflow: 'visible' }}>
                  <path
                    d="M 60,0 L 60,30"
                    stroke="#64748b"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </div>
          
          {/* Right bracket */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-xs text-slate-400 font-medium">Right bracket</div>
            {rightMatch && (
              <MatchCard
                match={rightMatch}
                teamsById={teamsById}
                prediction={prediction}
                onWinnerChange={onWinnerChange}
                bracket={bracket}
                index={1}
                total={1}
              />
            )}
            {/* Line connecting to final */}
            {rightWinner && finalMatch && (
              <div className="relative w-full flex justify-center mt-2">
                <svg className="absolute" width="120" height="30" style={{ pointerEvents: 'none', overflow: 'visible' }}>
                  <path
                    d="M 60,0 L 60,30"
                    stroke="#64748b"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isCenterOnly) {
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
        <div className="flex flex-wrap justify-center gap-4">
          {matches.map((match, idx) => (
            <MatchCard
              key={match.id}
              match={match}
              teamsById={teamsById}
              prediction={prediction}
              onWinnerChange={onWinnerChange}
              bracket={bracket}
              index={idx}
              total={matches.length}
            />
          ))}
        </div>
      </div>
    );
  }

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

      <div className="text-center mb-4">
        <p className="text-sm text-slate-400 font-medium">
          {bracketHalf === "left" ? "Left bracket:" : "Right bracket:"}
        </p>
      </div>

      <div className="flex flex-col gap-4 pb-4">
        {/* Group matches in pairs and show next match card with proper bracket lines */}
        {Array.from({ length: Math.ceil(currentMatches.length / 2) }, (_, pairIdx) => {
          const match1 = currentMatches[pairIdx * 2];
          const match2 = currentMatches[pairIdx * 2 + 1];
          const nextMatch1 = match1 ? getNextMatch(match1.id, bracket) : undefined;
          const nextMatch2 = match2 ? getNextMatch(match2.id, bracket) : undefined;
          // Both matches should feed into the same next match
          const nextMatch = nextMatch1 || nextMatch2;
          const bothReady = nextMatch && isNextMatchReady(nextMatch);
          
          // For left bracket: R32 on left, R16 on right
          // For right bracket: R32 on right, R16 on left
          const isLeftBracket = bracketHalf === "left";

          // Get winner positions for each match
          const winner1 = match1 ? prediction.knockout.winnersByMatchId[match1.id] : undefined;
          const winner2 = match2 ? prediction.knockout.winnersByMatchId[match2.id] : undefined;
          const isWinner1Home = match1 && winner1 === match1.homeTeamId;
          const isWinner2Home = match2 && winner2 === match2.homeTeamId;
          
          // Match card dimensions (thinner cards)
          const cardHeight = 70; // Approximate card height
          const cardGap = 8; // gap-2 = 8px
          const match1Top = 0;
          const match2Top = cardHeight + cardGap;
          
          // Winner button positions relative to their card top
          const homeButtonCenter = 22; // Home button center within card
          const awayButtonCenter = 37; // Away button center within card
          const match1WinnerY = match1 ? (isWinner1Home ? match1Top + homeButtonCenter : match1Top + awayButtonCenter) : 0;
          const match2WinnerY = match2 ? (isWinner2Home ? match2Top + homeButtonCenter : match2Top + awayButtonCenter) : 0;
          
          // Next match card center position (centered between the two matches)
          const nextMatchCenterY = (match1Top + match2Top + cardHeight) / 2;
          const nextMatchHomeY = nextMatchCenterY - 7.5; // Home team position in next match
          const nextMatchAwayY = nextMatchCenterY + 7.5; // Away team position in next match

          return (
            <div key={pairIdx} className={`flex items-center ${isLeftBracket ? 'flex-row' : 'flex-row-reverse'} justify-center gap-2`}>
              {/* R32 Matches Column */}
              <div className="flex flex-col gap-2 relative">
                {match1 && (
                  <MatchCard
                    match={match1}
                    teamsById={teamsById}
                    prediction={prediction}
                    onWinnerChange={onWinnerChange}
                    bracket={bracket}
                    index={pairIdx * 2}
                    total={currentMatches.length}
                  />
                )}
                {match2 && (
                  <MatchCard
                    match={match2}
                    teamsById={teamsById}
                    prediction={prediction}
                    onWinnerChange={onWinnerChange}
                    bracket={bracket}
                    index={pairIdx * 2 + 1}
                    total={currentMatches.length}
                  />
                )}
              </div>
              
              {/* Bracket connector lines - proper tournament bracket style */}
              {nextMatch && match1 && match2 && winner1 && winner2 && (
                <div className="relative" style={{ width: '50px', height: `${match2Top + cardHeight}px` }}>
                  <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none', overflow: 'visible' }}>
                    {/* Line from match1 winner: horizontal right → vertical down to center → horizontal right to next match */}
                    <path
                      d={`M ${isLeftBracket ? '0' : '50'},${match1WinnerY} 
                          L ${isLeftBracket ? '25' : '25'},${match1WinnerY} 
                          L ${isLeftBracket ? '25' : '25'},${nextMatchHomeY} 
                          L ${isLeftBracket ? '50' : '0'},${nextMatchHomeY}`}
                      stroke="#64748b"
                      strokeWidth="2"
                      fill="none"
                    />
                    {/* Line from match2 winner: horizontal right → vertical up to center → horizontal right to next match */}
                    <path
                      d={`M ${isLeftBracket ? '0' : '50'},${match2WinnerY} 
                          L ${isLeftBracket ? '25' : '25'},${match2WinnerY} 
                          L ${isLeftBracket ? '25' : '25'},${nextMatchAwayY} 
                          L ${isLeftBracket ? '50' : '0'},${nextMatchAwayY}`}
                      stroke="#64748b"
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              )}
              
              {/* R16 Match Card - centered vertically between the two matches */}
              {nextMatch && bothReady ? (
                <motion.div
                  initial={{ opacity: 0, x: isLeftBracket ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-slate-800 rounded-lg p-1.5 border border-slate-600 w-[110px] flex-shrink-0 self-center"
                >
                  <div className="text-[10px] text-slate-400 mb-0.5 flex justify-between">
                    <span className="font-semibold text-[9px]">{nextMatch.id}</span>
                    {nextMatch.metadata?.city && <span className="text-[9px] truncate max-w-[40px]">{nextMatch.metadata.city}</span>}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700/50 text-[10px]">
                      <span className="text-xs">{teamDisplay(nextMatch.homeTeamId, teamsById).flag}</span>
                      <span className="font-medium flex-1 truncate text-[10px]">{teamDisplay(nextMatch.homeTeamId, teamsById).name}</span>
                    </div>
                    <div className="text-center text-[9px] text-slate-500">vs</div>
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700/50 text-[10px]">
                      <span className="text-xs">{teamDisplay(nextMatch.awayTeamId, teamsById).flag}</span>
                      <span className="font-medium flex-1 truncate text-[10px]">{teamDisplay(nextMatch.awayTeamId, teamsById).name}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="w-[110px]" /> // Spacer to maintain layout
              )}
            </div>
          );
        })}
      </div>

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
  const [bracketHalf, setBracketHalf] = useState<BracketHalf>("left");
  // Track last active bracket half for each round
  const [lastBracketHalf, setLastBracketHalf] = useState<Record<KnockoutRound, BracketHalf>>({
    R32: "left",
    R16: "left",
    QF: "left",
    SF: "left",
    F: "left",
  });

  // When bracket half changes, remember it for this round
  const handleBracketHalfChange = (half: BracketHalf) => {
    setBracketHalf(half);
    setLastBracketHalf(prev => ({ ...prev, [activeRound]: half }));
  };

  // When round changes, restore to last active bracket half for that round
  const handleRoundChange = (round: KnockoutRound) => {
    setActiveRound(round);
    setBracketHalf(lastBracketHalf[round]);
  };

  // Get matches for active round
  const activeMatches = bracket.matches.filter(m => m.round === activeRound);

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
      {/* Active round matches */}
      <RoundSection
        round={activeRound}
        matches={activeMatches}
        teamsById={teamsById}
        prediction={prediction}
        onWinnerChange={onWinnerChange}
        bracketHalf={bracketHalf}
        onBracketHalfChange={handleBracketHalfChange}
        bracket={bracket}
      />
      
      {/* If viewing semifinals, also allow picking final winner */}
      {activeRound === "SF" && (() => {
        const finalMatch = bracket.matches.find(m => m.round === "F");
        const leftMatch = activeMatches.find(m => isLeftHalf(m.id));
        const rightMatch = activeMatches.find(m => !isLeftHalf(m.id));
        const leftWinner = leftMatch ? prediction.knockout.winnersByMatchId[leftMatch.id] : undefined;
        const rightWinner = rightMatch ? prediction.knockout.winnersByMatchId[rightMatch.id] : undefined;
        const finalWinner = finalMatch ? prediction.knockout.winnersByMatchId[finalMatch.id] : undefined;
        
        // Only show "Pick Final Winner" when both finalists are selected but no winner yet
        if (!finalMatch || !leftWinner || !rightWinner || finalWinner) return null;
        
        return (
          <div className="pt-4 border-t border-slate-700">
            <div className="text-center text-sm text-slate-300 mb-2">Pick Final Winner:</div>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => onWinnerChange(finalMatch.id, leftWinner)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  prediction.knockout.winnersByMatchId[finalMatch.id] === leftWinner
                    ? "bg-green-600 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                )}
              >
                {teamsById[leftWinner]?.flagEmoji} {teamsById[leftWinner]?.shortName || teamsById[leftWinner]?.name}
              </button>
              <button
                onClick={() => onWinnerChange(finalMatch.id, rightWinner)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  prediction.knockout.winnersByMatchId[finalMatch.id] === rightWinner
                    ? "bg-green-600 text-white"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                )}
              >
                {teamsById[rightWinner]?.flagEmoji} {teamsById[rightWinner]?.shortName || teamsById[rightWinner]?.name}
              </button>
            </div>
          </div>
        );
      })()}

      {/* Navigation Buttons */}
      <div className="flex flex-wrap justify-center gap-3 pt-4">
        {/* Back button */}
        <Button 
          variant="outline" 
          onClick={() => {
            const leftMatches = activeMatches.filter(m => isLeftHalf(m.id));
            const rightMatches = activeMatches.filter(m => !isLeftHalf(m.id));
            const hasBothHalves = leftMatches.length > 0 && rightMatches.length > 0;
            
            // If on right bracket and round has both halves, go back to left bracket
            if (bracketHalf === "right" && hasBothHalves && activeRound !== "F") {
              handleBracketHalfChange("left");
            } else {
              // Go to previous round - will restore to last active bracket half for that round
              const currentIndex = roundOrder.indexOf(activeRound);
              if (currentIndex > 0) {
                const prevRound = roundOrder[currentIndex - 1];
                handleRoundChange(prevRound);
              } else {
                onBack();
              }
            }
          }}
        >
          ← Back
        </Button>
        
        {/* Continue button - always show when there's a valid next step */}
        {(() => {
          const { completed, total } = getCompletedCount(activeRound);
          const isComplete = completed === total && total > 0;
          const currentIndex = roundOrder.indexOf(activeRound);
          const nextRound = currentIndex < roundOrder.length - 1 ? roundOrder[currentIndex + 1] : null;
          
          // For rounds with left/right brackets
          const leftMatches = activeMatches.filter(m => isLeftHalf(m.id));
          const rightMatches = activeMatches.filter(m => !isLeftHalf(m.id));
          const hasBothHalves = leftMatches.length > 0 && rightMatches.length > 0;
          
          if (hasBothHalves && activeRound !== "F") {
            const leftComplete = leftMatches.filter(m => prediction.knockout.winnersByMatchId[m.id]).length === leftMatches.length;
            const rightComplete = rightMatches.filter(m => prediction.knockout.winnersByMatchId[m.id]).length === rightMatches.length;
            
            // If on left bracket and left is complete, can continue to right bracket
            if (bracketHalf === "left" && leftComplete && rightMatches.length > 0) {
              return (
                <Button 
                  onClick={() => handleBracketHalfChange("right")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue →
                </Button>
              );
            }
            
            // If on right bracket or both halves are complete, can continue to next round
            if ((bracketHalf === "right" || (bracketHalf === "left" && leftComplete && rightComplete)) && leftComplete && rightComplete && isComplete && nextRound) {
              return (
                <Button 
                  onClick={() => handleRoundChange(nextRound)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Continue →
                </Button>
              );
            }
            
            // If there's a next round, always show Continue (even if not complete)
            if (nextRound) {
              return (
                <Button 
                  onClick={() => handleRoundChange(nextRound)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!isComplete}
                >
                  Continue →
                </Button>
              );
            }
          } else {
            // Single bracket or center-only rounds - always show Continue if there's a next round
            if (nextRound) {
              return (
                <Button 
                  onClick={() => handleRoundChange(nextRound)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={!isComplete}
                >
                  Continue →
                </Button>
              );
            }
          }
          
          return null;
        })()}
      </div>
    </div>
  );
};

export default BracketView;
