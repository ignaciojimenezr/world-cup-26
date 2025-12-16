import {
  Bracket,
  GroupId,
  KnockoutSlot,
  KnockoutSlotSource,
  ResolvedBracket,
  TeamId,
  WorldCupPrediction,
} from "@shared/types";

/**
 * Get which group a team belongs to (from group predictions)
 */
const getTeamGroup = (teamId: TeamId, prediction: WorldCupPrediction): GroupId | undefined => {
  for (const group of prediction.groups) {
    for (const pos of [1, 2, 3, 4] as const) {
      if (group.positions[pos] === teamId) {
        return group.groupId;
      }
    }
  }
  return undefined;
};

/**
 * FIFA third-place assignment algorithm
 * Processes slots in order, assigning highest-ranked eligible team to each slot
 */
const assignThirdPlaceTeams = (
  prediction: WorldCupPrediction,
  template: Bracket
): Map<number, TeamId> => {
  // Get all 12 third-place teams with their groups
  const thirdPlaceTeams: Array<{ teamId: TeamId; groupId: GroupId }> = [];
  for (const group of prediction.groups) {
    const teamId = group.positions[3];
    if (teamId) {
      thirdPlaceTeams.push({ teamId, groupId: group.groupId });
    }
  }

  // Rank all third-place teams (by order in advancingThirdPlaceTeamIds)
  // The first 8 in advancingThirdPlaceTeamIds are the top 8
  const ranked = prediction.thirdPlaceSelection.advancingThirdPlaceTeamIds
    .map((teamId) => {
      const team = thirdPlaceTeams.find((t) => t.teamId === teamId);
      return team ? { teamId, groupId: team.groupId } : null;
    })
    .filter((t): t is { teamId: TeamId; groupId: GroupId } => t !== null);

  // Get all third-place slots from bracket template, sorted by rankIndex
  const thirdPlaceSlots: Array<{ rankIndex: number; groupCombination: string }> = [];
  for (const match of template.matches) {
    if (match.homeSlot.source?.type === "third-ranked" && match.homeSlot.source.groupCombination) {
      thirdPlaceSlots.push({
        rankIndex: match.homeSlot.source.rankIndex,
        groupCombination: match.homeSlot.source.groupCombination,
      });
    }
    if (match.awaySlot.source?.type === "third-ranked" && match.awaySlot.source.groupCombination) {
      thirdPlaceSlots.push({
        rankIndex: match.awaySlot.source.rankIndex,
        groupCombination: match.awaySlot.source.groupCombination,
      });
    }
  }
  thirdPlaceSlots.sort((a, b) => a.rankIndex - b.rankIndex);

  // Assign teams to slots using FIFA algorithm
  const assignments = new Map<number, TeamId>();
  const available = [...ranked]; // Copy array

  for (const slot of thirdPlaceSlots) {
    // Find highest-ranked remaining team whose group is in the slot combination
    const teamIndex = available.findIndex((t) =>
      slot.groupCombination.includes(t.groupId)
    );

    if (teamIndex !== -1) {
      const team = available[teamIndex];
      assignments.set(slot.rankIndex, team.teamId);
      available.splice(teamIndex, 1); // Remove from available
    }
  }

  return assignments;
};

const resolveSource = (
  source: KnockoutSlotSource,
  prediction: WorldCupPrediction,
  template: Bracket,
  thirdPlaceAssignments?: Map<number, TeamId>
): string | undefined => {
  switch (source.type) {
    case "group-position": {
      const group = prediction.groups.find((g) => g.groupId === source.groupId);
      return group?.positions[source.position];
    }
    case "third-ranked": {
      if (!thirdPlaceAssignments) {
        // Fallback to old behavior if assignments not provided
        return prediction.thirdPlaceSelection.advancingThirdPlaceTeamIds[source.rankIndex];
      }
      return thirdPlaceAssignments.get(source.rankIndex);
    }
    case "winner-of-match":
      return prediction.knockout.winnersByMatchId[source.matchId];
    default:
      return undefined;
  }
};

const resolveSlotTeamId = (
  slot: KnockoutSlot,
  prediction: WorldCupPrediction,
  template: Bracket,
  thirdPlaceAssignments?: Map<number, TeamId>
): string | undefined => {
  const source = slot.source;
  if (!source) return undefined;

  return resolveSource(source, prediction, template, thirdPlaceAssignments);
};

export const resolveBracketLocally = (
  template: Bracket,
  prediction: WorldCupPrediction
): ResolvedBracket => {
  // Compute third-place assignments using FIFA algorithm
  const thirdPlaceAssignments = assignThirdPlaceTeams(prediction, template);

  return {
    matches: template.matches.map((match) => ({
      ...match,
      homeTeamId: resolveSlotTeamId(match.homeSlot, prediction, template, thirdPlaceAssignments),
      awayTeamId: resolveSlotTeamId(match.awaySlot, prediction, template, thirdPlaceAssignments),
    })),
  };
};
