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
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-display font-semibold trophy-shimmer">
          Best Third-Place Teams
        </h2>
        <p className="text-muted-foreground text-sm">
          Select <span className="text-gold font-medium">8 of 12</span> third-place teams to advance • {selectedCount}/8 selected
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {thirdPlaceTeams.map((team, idx) => {
          const checked = selection.advancingThirdPlaceTeamIds.includes(team.id);
          return (
            <Card
              key={team.id}
              className={`glass-card bg-white/5 border-white/10 cursor-pointer transition-all animate-fade-in hover:bg-white/10 ${
                checked ? "ring-2 ring-gold/60 border-gold/40" : ""
              }`}
              style={{ animationDelay: `${idx * 0.03}s` }}
              onClick={() => toggle(team.id)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base flex items-center gap-2">
                  <span className="text-xl">{team.flagEmoji}</span>
                  <span className={checked ? "text-gold" : ""}>{team.name}</span>
                </CardTitle>
                <Checkbox 
                  checked={checked} 
                  onCheckedChange={() => toggle(team.id)} 
                  className={checked ? "border-gold data-[state=checked]:bg-gold data-[state=checked]:text-fifa-blue" : "border-white/30"}
                />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {team.confederation ?? "N/A"}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Navigation at bottom */}
      <div className="flex justify-center gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="border-white/20 hover:bg-white/10">
          ← Back
        </Button>
        <Button 
          disabled={!ready} 
          onClick={onContinue} 
          className={ready ? "bg-gradient-to-r from-gold-dark via-gold to-gold-light text-fifa-blue font-semibold shadow-lg shadow-gold/25" : ""}
        >
          Continue →
        </Button>
      </div>
    </div>
  );
};

export default ThirdPlaceSelector;

