import { useState } from "react";
import { Group, GroupPrediction, GroupPosition, Team, TeamId } from "@shared/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface GroupSelectorProps {
  groups: Group[];
  teamsById: Record<TeamId, Team>;
  playoffSlots?: Record<string, string[]>;
  value: GroupPrediction[];
  onChange: (next: GroupPrediction[]) => void;
  onContinue: () => void;
}

const positions: GroupPosition[] = [1, 2, 3, 4];

const isGroupComplete = (gp: GroupPrediction) =>
  positions.every((p) => Boolean(gp.positions[p])) &&
  new Set(positions.map((p) => gp.positions[p])).size === positions.length;

const GroupSelector = ({
  groups,
  teamsById,
  playoffSlots = {},
  value,
  onChange,
  onContinue,
}: GroupSelectorProps) => {
  // Track which playoff team was selected for each slot
  const [selectedPlayoffTeams, setSelectedPlayoffTeams] = useState<Record<string, TeamId>>({});
  
  // Dialog for selecting playoff team
  const [playoffDialog, setPlayoffDialog] = useState<{
    groupId: string;
    slotId: string;
  } | null>(null);

  const allComplete = value.every(isGroupComplete);

  // Auto-generate random predictions for all groups
  const autoGenerate = () => {
    const newPlayoffSelections: Record<string, TeamId> = {};
    
    // For each group, determine the 4 teams (picking random playoff winners)
    const newPredictions = groups.map((group) => {
      const groupTeams: TeamId[] = [];
      
      for (const teamId of group.teams) {
        if (teamId.includes("playoff")) {
          // Pick a random team from the playoff candidates
          const candidates = playoffSlots[teamId];
          if (candidates && candidates.length > 0) {
            const randomIdx = Math.floor(Math.random() * candidates.length);
            const selectedTeam = candidates[randomIdx] as TeamId;
            groupTeams.push(selectedTeam);
            // Store the selection
            const key = `${group.id}-${teamId}`;
            newPlayoffSelections[key] = selectedTeam;
          }
        } else {
          groupTeams.push(teamId);
        }
      }
      
      // Shuffle the teams randomly for positions
      const shuffled = [...groupTeams].sort(() => Math.random() - 0.5);
      
      return {
        groupId: group.id,
        positions: {
          1: shuffled[0] || ("" as TeamId),
          2: shuffled[1] || ("" as TeamId),
          3: shuffled[2] || ("" as TeamId),
          4: shuffled[3] || ("" as TeamId),
        },
      };
    });
    
    setSelectedPlayoffTeams(newPlayoffSelections);
    onChange(newPredictions);
  };

  // Get the assigned position for a team in a group
  const getPositionForTeam = (groupId: string, teamId: TeamId): GroupPosition | undefined => {
    const prediction = value.find((g) => g.groupId === groupId);
    if (!prediction) return undefined;
    for (const pos of positions) {
      if (prediction.positions[pos] === teamId) return pos;
    }
    return undefined;
  };

  // Get next available position for a group
  const getNextPosition = (groupId: string): GroupPosition | undefined => {
    const prediction = value.find((g) => g.groupId === groupId);
    if (!prediction) return 1;
    for (const pos of positions) {
      if (!prediction.positions[pos]) return pos;
    }
    return undefined;
  };

  // Assign team to next available position
  const assignTeam = (groupId: string, teamId: TeamId) => {
    const nextPos = getNextPosition(groupId);
    if (!nextPos) return; // Group is full

    const next = value.map((gp) => {
      if (gp.groupId !== groupId) return gp;
      
      const newPositions = { ...gp.positions };
      
      // Remove team from any existing position (if clicking again)
      for (const p of positions) {
        if (newPositions[p] === teamId) {
          newPositions[p] = "" as TeamId;
        }
      }
      
      // Assign to next position
      newPositions[nextPos] = teamId;
      
      return { ...gp, positions: newPositions };
    });
    
    onChange(next);
  };

  // Clear all selections for a group
  const clearGroup = (groupId: string) => {
    const next = value.map((gp) => {
      if (gp.groupId !== groupId) return gp;
      return {
        ...gp,
        positions: { 1: "" as TeamId, 2: "" as TeamId, 3: "" as TeamId, 4: "" as TeamId },
      };
    });
    onChange(next);
  };

  // Handle team click - assigns position
  const handleTeamClick = (groupId: string, teamId: TeamId) => {
    // Check if already assigned
    const existingPos = getPositionForTeam(groupId, teamId);
    if (existingPos) {
      // Already placed - do nothing
      return;
    }

    assignTeam(groupId, teamId);
  };

  // Handle clicking on a playoff slot - opens dialog to pick team
  const handlePlayoffSlotClick = (groupId: string, slotId: string) => {
    setPlayoffDialog({ groupId, slotId });
  };

  // Handle playoff team selection - just picks which team, doesn't assign position
  const handlePlayoffSelect = (teamId: TeamId) => {
    if (!playoffDialog) return;
    
    const key = `${playoffDialog.groupId}-${playoffDialog.slotId}`;
    setSelectedPlayoffTeams(prev => ({
      ...prev,
      [key]: teamId,
    }));
    setPlayoffDialog(null);
  };

  // Clear a playoff selection
  const clearPlayoffSelection = (groupId: string, slotId: string) => {
    const key = `${groupId}-${slotId}`;
    const selectedTeamId = selectedPlayoffTeams[key];
    
    // Also remove from positions if assigned
    if (selectedTeamId) {
      const next = value.map((gp) => {
        if (gp.groupId !== groupId) return gp;
        const newPositions = { ...gp.positions };
        for (const p of positions) {
          if (newPositions[p] === selectedTeamId) {
            newPositions[p] = "" as TeamId;
          }
        }
        return { ...gp, positions: newPositions };
      });
      onChange(next);
    }
    
    // Remove from selected playoff teams
    setSelectedPlayoffTeams(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  // Get the team to display for a slot (either regular team or selected playoff team)
  const getDisplayTeam = (groupId: string, teamId: TeamId): Team | undefined => {
    if (teamId.includes("playoff")) {
      const key = `${groupId}-${teamId}`;
      const selectedId = selectedPlayoffTeams[key];
      if (selectedId) {
        return teamsById[selectedId];
      }
      return undefined; // Playoff not yet selected
    }
    return teamsById[teamId];
  };

  // Get the actual team ID to use for position assignment
  const getActualTeamId = (groupId: string, teamId: TeamId): TeamId | undefined => {
    if (teamId.includes("playoff")) {
      const key = `${groupId}-${teamId}`;
      return selectedPlayoffTeams[key];
    }
    return teamId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold">Group Predictions</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            Click teams: 1st → 2nd → 3rd → 4th
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={autoGenerate}>
            Auto
          </Button>
          <Button size="sm" disabled={!allComplete} onClick={onContinue}>
            Continue →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {groups.map((group) => {
          const prediction = value.find((g) => g.groupId === group.id);
          const complete = prediction ? isGroupComplete(prediction) : false;
          const nextPos = getNextPosition(group.id);

          return (
            <Card 
              key={group.id} 
              className={`bg-slate-900 border-slate-700 ${complete ? "ring-2 ring-green-500" : ""}`}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-center text-lg">
                  GROUP {group.id}
                </CardTitle>
                {nextPos && (
                  <p className="text-xs text-slate-400 text-center">
                    Next click assigns: {nextPos === 1 ? "1st" : nextPos === 2 ? "2nd" : nextPos === 3 ? "3rd" : "4th"} place
                  </p>
                )}
                {complete && (
                  <p className="text-xs text-green-400 text-center">✓ Complete</p>
                )}
              </CardHeader>
              <CardContent className="space-y-2">
                {group.teams.map((teamId) => {
                  const isPlayoff = teamId.includes("playoff");
                  const displayTeam = getDisplayTeam(group.id, teamId);
                  const actualTeamId = getActualTeamId(group.id, teamId);
                  const assignedPosition = actualTeamId ? getPositionForTeam(group.id, actualTeamId) : undefined;
                  const isAssigned = assignedPosition !== undefined;
                  const canClick = displayTeam && !isAssigned && nextPos;

                  // Playoff slot that hasn't been selected yet
                  if (isPlayoff && !displayTeam) {
                    return (
                      <button
                        key={teamId}
                        onClick={() => handlePlayoffSlotClick(group.id, teamId)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg text-left bg-slate-800/50 text-slate-300 hover:bg-slate-700 cursor-pointer transition-all border-2 border-dashed border-slate-600"
                      >
                        <span className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                          FIFA
                        </span>
                        <span className="font-medium flex-1 text-slate-400">
                          {teamId.replace("euro-playoff-", "Playoff ").replace("intercon-playoff-", "Playoff ")}
                        </span>
                        <span className="text-xs text-blue-400">Select →</span>
                      </button>
                    );
                  }

                  // Playoff team that has been selected - show with clear button
                  if (isPlayoff && displayTeam) {
                    return (
                      <div key={teamId} className="flex gap-2">
                        <button
                          onClick={() => canClick && actualTeamId && handleTeamClick(group.id, actualTeamId)}
                          disabled={!canClick}
                          className={`
                            flex-1 flex items-center gap-3 p-3 rounded-lg text-left transition-all
                            ${isAssigned 
                              ? "bg-slate-800 text-white" 
                              : canClick
                                ? "bg-slate-800/50 text-slate-300 hover:bg-slate-700 cursor-pointer border border-blue-500/50"
                                : "bg-slate-800/30 text-slate-500"
                            }
                          `}
                        >
                          <span className="text-2xl">{displayTeam.flagEmoji}</span>
                          <span className="font-medium flex-1">{displayTeam.name}</span>
                          {isAssigned && (
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold min-w-[24px] text-center">
                              {assignedPosition}
                            </span>
                          )}
                        </button>
                        <button
                          onClick={() => clearPlayoffSelection(group.id, teamId)}
                          className="px-3 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition-colors text-sm"
                          title="Change playoff pick"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  }

                  // Regular team
                  return (
                    <button
                      key={teamId}
                      onClick={() => canClick && actualTeamId && handleTeamClick(group.id, actualTeamId)}
                      disabled={!canClick}
                      className={`
                        w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                        ${isAssigned 
                          ? "bg-slate-800 text-white" 
                          : canClick
                            ? "bg-slate-800/50 text-slate-300 hover:bg-slate-700 cursor-pointer"
                            : "bg-slate-800/30 text-slate-500"
                        }
                      `}
                    >
                      <span className="text-2xl">{displayTeam?.flagEmoji ?? "❓"}</span>
                      <span className="font-medium flex-1">{displayTeam?.name ?? teamId}</span>
                      
                      {isAssigned && (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold min-w-[24px] text-center">
                          {assignedPosition}
                        </span>
                      )}
                    </button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-slate-600 text-slate-400 hover:text-white"
                  onClick={() => clearGroup(group.id)}
                >
                  Clear
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Playoff Selection Dialog */}
      <Dialog open={!!playoffDialog} onOpenChange={() => setPlayoffDialog(null)}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Who will win this playoff?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-400 mb-4">
            Pick which team you think will qualify from this playoff
          </p>
          <div className="grid grid-cols-1 gap-2">
            {playoffDialog && playoffSlots[playoffDialog.slotId]?.map((teamId) => {
              const team = teamsById[teamId];
              if (!team) return null;
              
              return (
                <button
                  key={teamId}
                  onClick={() => handlePlayoffSelect(teamId)}
                  className="flex items-center gap-3 p-4 rounded-lg bg-slate-800 hover:bg-slate-700 cursor-pointer transition-colors"
                >
                  <span className="text-2xl">{team.flagEmoji}</span>
                  <span className="font-medium">{team.name}</span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupSelector;
