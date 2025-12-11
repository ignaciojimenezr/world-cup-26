import {
  Bracket,
  KnockoutSlot,
  ResolvedBracket,
  WorldCupPrediction,
} from "@shared/types";

const resolveSlotTeamId = (
  slot: KnockoutSlot,
  prediction: WorldCupPrediction
): string | undefined => {
  const source = slot.source;
  if (!source) return undefined;

  switch (source.type) {
    case "group-position": {
      const group = prediction.groups.find((g) => g.groupId === source.groupId);
      return group?.positions[source.position];
    }
    case "third-ranked":
      return prediction.thirdPlaceSelection.advancingThirdPlaceTeamIds[source.rankIndex];
    case "winner-of-match":
      return prediction.knockout.winnersByMatchId[source.matchId];
    default:
      return undefined;
  }
};

export const resolveBracketLocally = (
  template: Bracket,
  prediction: WorldCupPrediction
): ResolvedBracket => {
  return {
    matches: template.matches.map((match) => ({
      ...match,
      homeTeamId: resolveSlotTeamId(match.homeSlot, prediction),
      awayTeamId: resolveSlotTeamId(match.awaySlot, prediction),
    })),
  };
};

