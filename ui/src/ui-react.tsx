import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bracket,
  Group,
  GroupPrediction,
  ResolvedBracket,
  ResolvedMatch,
  Team,
  TeamId,
  ThirdPlaceSelection,
  WorldCupPrediction,
} from "@shared/types";
import GroupSelector from "./components/GroupSelector";
import ThirdPlaceSelector from "./components/ThirdPlaceSelector";
import BracketView from "./components/BracketView";
import MatchDetailsSheet from "./components/MatchDetailsSheet";
import { resolveBracketLocally } from "./lib/bracket";
import { callTool, getResourceUri, resize, isInMcpHost } from "./lib/mcp-app";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";

type View = "groups" | "third" | "bracket";

const viewFromUri = (uri?: string): View => {
  if (!uri) return "groups";
  if (uri.includes("third")) return "third";
  if (uri.includes("bracket")) return "bracket";
  return "groups";
};

const dependentMatches = (matchId: string, bracket?: Bracket) => {
  if (!bracket) return [];
  return bracket.matches.filter((m) => {
    const home = m.homeSlot.source?.type === "winner-of-match" && m.homeSlot.source.matchId === matchId;
    const away = m.awaySlot.source?.type === "winner-of-match" && m.awaySlot.source.matchId === matchId;
    return home || away;
  });
};

const pruneDownstreamWinners = (startId: string, bracket: Bracket, winners: Record<string, TeamId | undefined>) => {
  const queue = [startId];
  const visited = new Set<string>();
  const next = { ...winners };

  while (queue.length) {
    const current = queue.shift()!;
    const dependents = dependentMatches(current, bracket);
    dependents.forEach((match) => {
      if (visited.has(match.id)) return;
      visited.add(match.id);
      delete next[match.id];
      queue.push(match.id);
    });
  }

  return next;
};

const WorldCupApp = () => {
  const resourceUri = getResourceUri();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>(viewFromUri(resourceUri));

  // Auto-resize when in MCP host
  useEffect(() => {
    if (isInMcpHost()) {
      const resizeObserver = new ResizeObserver(() => {
        resize();
      });
      resizeObserver.observe(document.body);
      resize();
      return () => resizeObserver.disconnect();
    }
  }, []);

  const [teams, setTeams] = useState<Team[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [bracketTemplate, setBracketTemplate] = useState<Bracket | null>(null);
  const [prediction, setPrediction] = useState<WorldCupPrediction | null>(null);
  const [resolvedBracket, setResolvedBracket] = useState<ResolvedBracket | null>(null);
  const [activeMatch, setActiveMatch] = useState<ResolvedMatch | null>(null);
  const [playoffSlots, setPlayoffSlots] = useState<Record<string, string[]>>({});

  useEffect(() => {
    setView(viewFromUri(resourceUri));
  }, [resourceUri]);

  useEffect(() => {
    (async () => {
      console.log("[WorldCup] Fetching initial data...");
      try {
        const response = await callTool<{
          data?: {
            teams: Team[];
            groups: Group[];
            bracketTemplate: Bracket;
            prediction: WorldCupPrediction;
            playoffSlots?: Record<string, string[]>;
          };
          teams?: Team[];
          groups?: Group[];
          bracketTemplate?: Bracket;
          prediction?: WorldCupPrediction;
          playoffSlots?: Record<string, string[]>;
        }>("worldcup.getInitialData", { includeSaved: true });
        
        console.log("[WorldCup] Raw response:", response);
        
        // Handle different response shapes
        const payload = response?.data ?? response;
        
        if (!payload) {
          throw new Error("Empty response from worldcup.getInitialData");
        }
        
        console.log("[WorldCup] Parsed payload:", payload);
        
        setTeams(payload.teams ?? []);
        setGroups(payload.groups ?? []);
        setBracketTemplate(payload.bracketTemplate ?? null);
        setPrediction(payload.prediction ?? null);
        setPlayoffSlots(payload.playoffSlots ?? {});
        if (payload.prediction && payload.bracketTemplate) {
          setResolvedBracket(resolveBracketLocally(payload.bracketTemplate, payload.prediction));
        }
      } catch (err) {
        console.error("[WorldCup] Error loading data:", err);
        setError((err as Error)?.message ?? "Failed to load initial data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const teamsById = useMemo(
    () =>
      teams.reduce<Record<TeamId, Team>>((acc, t) => {
        acc[t.id] = t;
        return acc;
      }, {}),
    [teams]
  );

  const handleGroupChange = useCallback((nextGroups: GroupPrediction[]) => {
    setPrediction((prev) => {
      if (!prev) return prev;
      const next = { ...prev, groups: nextGroups };
      setBracketTemplate((bt) => {
        if (bt) setResolvedBracket(resolveBracketLocally(bt, next));
        return bt;
      });
      return next;
    });
  }, []);

  const handleThirdChange = useCallback((third: ThirdPlaceSelection) => {
    setPrediction((prev) => {
      if (!prev) return prev;
      const next = { ...prev, thirdPlaceSelection: third };
      setBracketTemplate((bt) => {
        if (bt) setResolvedBracket(resolveBracketLocally(bt, next));
        return bt;
      });
      return next;
    });
  }, []);

  const handleWinnerChange = useCallback((matchId: string, teamId: TeamId) => {
    setPrediction((prev) => {
      if (!prev) return prev;
      setBracketTemplate((bt) => {
        const cleanedWinners = bt
          ? pruneDownstreamWinners(matchId, bt, prev.knockout.winnersByMatchId)
          : { ...prev.knockout.winnersByMatchId };
        const next: WorldCupPrediction = {
          ...prev,
          knockout: {
            ...prev.knockout,
            winnersByMatchId: { ...cleanedWinners, [matchId]: teamId },
          },
        };
        if (bt) setResolvedBracket(resolveBracketLocally(bt, next));
        setPrediction(next);
        return bt;
      });
      return prev;
    });
  }, []);

  const handleSave = async () => {
    if (!prediction) return;
    try {
      await callTool("worldcup.savePrediction", { prediction });
    } catch (err) {
      setError((err as Error)?.message ?? "Failed to save prediction");
    }
  };

  const goTo = (next: View) => setView(next);

  useEffect(() => {
    if (view !== "bracket" || !prediction) return;
    (async () => {
      try {
        const response = await callTool<{ bracket: ResolvedBracket }>("worldcup.computeBracket", {
          groups: prediction.groups,
          thirdPlaceSelection: prediction.thirdPlaceSelection,
          knockout: prediction.knockout,
        });
        const payload = response?.bracket ?? (response as unknown as ResolvedBracket);
        if (payload?.matches) {
          setResolvedBracket(payload);
          return;
        }
      } catch {
        // fall back to local resolution if server tool is unavailable
      }
      if (bracketTemplate) {
        setResolvedBracket(resolveBracketLocally(bracketTemplate, prediction));
      }
    })();
  }, [view, prediction, bracketTemplate]);

  if (error) {
    return (
      <div className="p-6 space-y-2">
        <div className="text-sm text-destructive font-medium">Error loading World Cup data</div>
        <div className="text-xs text-muted-foreground">{error}</div>
        <div className="text-xs text-muted-foreground">
          Check browser console for more details. If using MCP Jam, ensure the server is running.
        </div>
      </div>
    );
  }

  if (loading || !prediction || !bracketTemplate) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        {loading ? "Loading world cup data…" : "Unable to load data (missing prediction or bracket)"}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <Card>
        <CardContent className="py-4 flex items-center gap-2 justify-between flex-wrap">
          <div className="space-y-1">
            <div className="text-lg font-semibold">World Cup 2026 Predictor</div>
            <p className="text-sm text-muted-foreground">
              Groups → third-place picks → knockout bracket
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button variant={view === "groups" ? "default" : "outline"} onClick={() => goTo("groups")}>
              Groups
            </Button>
            <Button
              variant={view === "third" ? "default" : "outline"}
              onClick={() => goTo("third")}
            >
              Third place
            </Button>
            <Button
              variant={view === "bracket" ? "default" : "outline"}
              onClick={() => goTo("bracket")}
            >
              Bracket
            </Button>
            <Button variant="secondary" onClick={handleSave}>
              Save prediction
            </Button>
          </div>
        </CardContent>
      </Card>

      {view === "groups" && (
        <GroupSelector
          groups={groups}
          teamsById={teamsById}
          playoffSlots={playoffSlots}
          value={prediction.groups}
          onChange={handleGroupChange}
          onContinue={() => goTo("third")}
        />
      )}

      {view === "third" && (
        <ThirdPlaceSelector
          groups={prediction.groups}
          teamsById={teamsById}
          selection={prediction.thirdPlaceSelection}
          onChange={handleThirdChange}
          onContinue={() => goTo("bracket")}
          onBack={() => goTo("groups")}
        />
      )}

      {view === "bracket" && resolvedBracket && (
        <>
          <BracketView
            bracket={resolvedBracket}
            teamsById={teamsById}
            prediction={prediction}
            onWinnerChange={handleWinnerChange}
            onOpenMatch={(m) => setActiveMatch(m)}
          />
          <MatchDetailsSheet
            open={Boolean(activeMatch)}
            match={activeMatch}
            teamsById={teamsById}
            onOpenChange={(open) => !open && setActiveMatch(null)}
          />
        </>
      )}
    </div>
  );
};

export default WorldCupApp;

