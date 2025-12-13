import { GroupPrediction, Team, TeamId, ThirdPlaceSelection } from "@shared/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";

interface ThirdPlaceSelectorProps {
  groups: GroupPrediction[];
  teamsById: Record<TeamId, Team>;
  selection: ThirdPlaceSelection;
  onChange: (next: ThirdPlaceSelection) => void;
  onContinue: () => void;
  onBack: () => void;
}

const ThirdPlaceSelector = ({
  groups,
  teamsById,
  selection,
  onChange,
  onContinue,
  onBack,
}: ThirdPlaceSelectorProps) => {
  const thirdPlaceTeams = groups
    .map((g) => teamsById[g.positions[3]])
    .filter(Boolean) as Team[];

  const toggle = (teamId: TeamId) => {
    const set = new Set(selection.advancingThirdPlaceTeamIds);
    if (set.has(teamId)) set.delete(teamId);
    else if (set.size < 8) set.add(teamId);
    onChange({ advancingThirdPlaceTeamIds: Array.from(set) });
  };

  const selectedCount = selection.advancingThirdPlaceTeamIds.length;
  const ready = selectedCount === 8;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-semibold">Select advancing third-place teams</h2>
        <p className="text-muted-foreground text-sm">
          Pick exactly 8 of the 12. Selected {selectedCount}/8.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {thirdPlaceTeams.map((team) => {
          const checked = selection.advancingThirdPlaceTeamIds.includes(team.id);
          return (
            <Card
              key={team.id}
              className={checked ? "border-primary shadow-lg" : undefined}
              onClick={() => toggle(team.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{team.flagEmoji}</span>
                  {team.name}
                </CardTitle>
                <Checkbox checked={checked} onCheckedChange={() => toggle(team.id)} />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Confederation: {team.confederation ?? "N/A"}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation at bottom */}
      <div className="flex justify-center gap-3 pt-4">
        <Button variant="outline" onClick={onBack}>
          ← Back
        </Button>
        <Button disabled={!ready} onClick={onContinue} className={ready ? "bg-green-600 hover:bg-green-700" : ""}>
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default ThirdPlaceSelector;

