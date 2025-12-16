// Cloudflare Worker entrypoint for World Cup 2026 MCP Server + UI
// Serves MCP endpoints and inlined UI assets from the ASSETS binding.
// Build trigger

import { bracketTemplate } from "../server/bracket-template";
import { groups, teams, playoffSlots } from "../server/teams";
import type {
  Bracket,
  GroupId,
  GroupPrediction,
  KnockoutSlot,
  KnockoutSlotSource,
  ResolvedBracket,
  ResolvedMatch,
  TeamId,
  ThirdPlaceSelection,
  WorldCupPrediction,
} from "../shared/types";

// Minimal type for assets binding provided by Wrangler when using `assets = { directory = "./ui/dist" }`
type AssetsBinding = {
  fetch: (request: Request) => Promise<Response>;
};

// ------------------------------------------------------------
// Prediction defaults
// ------------------------------------------------------------
const defaultGroupPredictions = (): GroupPrediction[] =>
  groups.map((group) => ({
    groupId: group.id,
    positions: {
      1: "" as string,
      2: "" as string,
      3: "" as string,
      4: "" as string,
    },
  }));

const emptyKnockout = () => ({ winnersByMatchId: {} as Record<string, string | undefined> });

const defaultPrediction = (): WorldCupPrediction => ({
  groups: defaultGroupPredictions(),
  thirdPlaceSelection: { advancingThirdPlaceTeamIds: [] },
  knockout: emptyKnockout(),
});

// ------------------------------------------------------------
// Bracket resolution helpers
// ------------------------------------------------------------

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
  prediction: WorldCupPrediction
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
  for (const match of bracketTemplate.matches) {
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
  source: KnockoutSlotSource | undefined,
  prediction: WorldCupPrediction,
  thirdPlaceAssignments?: Map<number, TeamId>
): string | undefined => {
  if (!source) return undefined;
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
  thirdPlaceAssignments?: Map<number, TeamId>
): string | undefined =>
  resolveSource(slot.source, prediction, thirdPlaceAssignments);

const resolveBracket = (prediction: WorldCupPrediction): ResolvedBracket => {
  // Compute third-place assignments using FIFA algorithm
  const thirdPlaceAssignments = assignThirdPlaceTeams(prediction);

  const matches = bracketTemplate.matches.map((match) => ({
    ...match,
    homeTeamId: resolveSlotTeamId(match.homeSlot, prediction, thirdPlaceAssignments),
    awayTeamId: resolveSlotTeamId(match.awaySlot, prediction, thirdPlaceAssignments),
  }));
  return { matches };
};

// ------------------------------------------------------------
// MCP tool definitions
// ------------------------------------------------------------
interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
  _meta?: Record<string, unknown>;
}

const UI_RESOURCE_URI_KEY = "ui/resourceUri";

const mcpTools: McpTool[] = [
  {
    name: "worldcup.getInitialData",
    description: "Return teams, groups, bracket template, and any saved prediction. Opens the World Cup prediction UI.",
    inputSchema: {
      type: "object",
      properties: {
        includeSaved: { type: "boolean", description: "Whether to include saved prediction" },
      },
    },
    _meta: { "ui/resourceUri": "ui://worldcup/groups" },
  },
  {
    name: "worldcup.savePrediction",
    description: "Persist a World Cup prediction (in-memory).",
    inputSchema: {
      type: "object",
      properties: {
        prediction: { type: "object", description: "The WorldCupPrediction object to save" },
      },
      required: ["prediction"],
    },
  },
  {
    name: "worldcup.computeBracket",
    description: "Compute a resolved bracket from group predictions and third-place selection. Opens the bracket view.",
    inputSchema: {
      type: "object",
      properties: {
        groups: { type: "array", description: "Group predictions" },
        thirdPlaceSelection: { type: "object", description: "Third place selection" },
        knockout: { type: "object", description: "Knockout predictions" },
      },
      required: ["groups", "thirdPlaceSelection"],
    },
    _meta: { "ui/resourceUri": "ui://worldcup/bracket" },
  },
  {
    name: "worldcup.getBracketTemplate",
    description: "Return the deterministic bracket template.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "worldcup.test",
    description: "Test tool to verify MCP App rendering. Opens a simple static test page.",
    inputSchema: { type: "object", properties: {} },
    _meta: { "ui/resourceUri": "ui://worldcup/test" },
  },
];

// ------------------------------------------------------------
// In-memory prediction store
// ------------------------------------------------------------
let savedPrediction: WorldCupPrediction | null = null;

// ------------------------------------------------------------
// MCP handlers
// ------------------------------------------------------------
type ToolHandler = (args: Record<string, unknown>) => Promise<unknown>;

const toolHandlers: Record<string, ToolHandler> = {
  "worldcup.getInitialData": async () => {
    const prediction = savedPrediction ?? defaultPrediction();
    return {
      data: { teams, groups, bracketTemplate, prediction, playoffSlots },
      metadata: { [UI_RESOURCE_URI_KEY]: "ui://worldcup/groups" },
    };
  },
  "worldcup.getDataForWidget": async () => {
    const prediction = savedPrediction ?? defaultPrediction();
    return { data: { teams, groups, bracketTemplate, prediction, playoffSlots } };
  },
  "worldcup.savePrediction": async (args) => {
    const incoming = args.prediction as WorldCupPrediction;
    if (!incoming) throw new Error("Missing prediction parameter");
    savedPrediction = incoming;
    return { ok: true, summary: "Prediction saved", snapshot: incoming };
  },
  "worldcup.computeBracket": async (args) => {
    const nextPrediction: WorldCupPrediction = {
      groups: (args.groups as GroupPrediction[]) ?? defaultGroupPredictions(),
      thirdPlaceSelection: (args.thirdPlaceSelection as ThirdPlaceSelection) ?? { advancingThirdPlaceTeamIds: [] },
      knockout: (args.knockout as WorldCupPrediction["knockout"]) ?? emptyKnockout(),
    };
    const bracket: ResolvedBracket = resolveBracket(nextPrediction);
    return { bracket, metadata: { [UI_RESOURCE_URI_KEY]: "ui://worldcup/bracket" } };
  },
  "worldcup.getBracketTemplate": async () => ({ bracketTemplate }),
  "worldcup.test": async () => ({ message: "Test successful", time: new Date().toISOString() }),
};

// ------------------------------------------------------------
// MCP protocol helpers
// ------------------------------------------------------------
interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: string | number | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

const SERVER_INFO = { name: "worldcup-2026", version: "1.0.0" };

// ------------------------------------------------------------
// HTML loading helpers (from ASSETS binding)
// ------------------------------------------------------------
const loadAssetText = async (env: { ASSETS: AssetsBinding }, path: string): Promise<string> => {
  const url = new URL(path, "https://assets.invalid");
  const res = await env.ASSETS.fetch(new Request(url.toString()));
  if (!res.ok) throw new Error(`Failed to load asset ${path}: ${res.status}`);
  return res.text();
};

const buildMcpAppHtml = async (env: { ASSETS: AssetsBinding }, resourceUri: string): Promise<string> => {
  // Fetch index.html from assets
  let html = await loadAssetText(env, "/index.html");

  // Normalize meta content-type to SEP-1865 expected value
  html = html.replace(
    /<meta http-equiv="Content-Type" content="text\/html\+mcp"\s*\/?>/i,
    `<meta http-equiv="Content-Type" content="text/html;profile=mcp-app" />`
  );

  // Inline JS asset (escape closing script tags to avoid premature termination)
  const jsMatch = html.match(/<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/);
  if (jsMatch && jsMatch[1]) {
    let jsContent = await loadAssetText(env, jsMatch[1]);
    // Replace </script with \x3c/script - the \x3c is JavaScript hex for '<'
    // This prevents the HTML parser from seeing a closing script tag
    jsContent = jsContent.replace(/<\/script/gi, "\\x3c/script");
    // IMPORTANT: Use function replacement to avoid $ patterns being interpreted
    html = html.replace(jsMatch[0], () => `<script type="module">${jsContent}</script>`);
  }

  // Inline CSS asset
  const cssMatch = html.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"]+\.css)">/);
  if (cssMatch && cssMatch[1]) {
    const cssContent = await loadAssetText(env, cssMatch[1]);
    html = html.replace(cssMatch[0], `<style>${cssContent}</style>`);
  }

  // Inject the resource URI
  html = html.replace(
    "</head>",
    `<script>window.__MCP_RESOURCE_URI__ = "${resourceUri}";</script></head>`
  );

  return html;
};

// ------------------------------------------------------------
// MCP request handler
// ------------------------------------------------------------
const handleMcpRequest = async (req: JsonRpcRequest, env: { ASSETS: AssetsBinding }): Promise<JsonRpcResponse> => {
  const id = req.id ?? null;

  switch (req.method) {
    case "initialize":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {
            tools: {},
            resources: {},
            prompts: {},
            extensions: { "io.modelcontextprotocol/ui": { mimeTypes: ["text/html;profile=mcp-app"] } },
          },
          serverInfo: SERVER_INFO,
        },
      };
    case "notifications/initialized":
      return { jsonrpc: "2.0", id, result: {} };
    case "tools/list":
      return { jsonrpc: "2.0", id, result: { tools: mcpTools } };
    case "tools/call": {
      const params = req.params as { name: string; arguments?: Record<string, unknown> };
      const toolName = params?.name;
      const toolArgs = params?.arguments ?? {};
      const handler = toolHandlers[toolName];
      if (!handler) {
        return { jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown tool: ${toolName}` } };
      }
      try {
        const result = await handler(toolArgs);
        const toolDef = mcpTools.find((t) => t.name === toolName);
        const toolMeta = toolDef?._meta;
        const response: JsonRpcResponse = {
          jsonrpc: "2.0",
          id,
          result: {
            content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            ...(toolMeta ? { _meta: toolMeta } : {}),
          },
        };
        return response;
      } catch (err) {
        return { jsonrpc: "2.0", id, error: { code: -32000, message: (err as Error).message } };
      }
    }
    case "resources/list":
      return {
        jsonrpc: "2.0",
        id,
        result: {
          resources: [
            { uri: "ui://worldcup/groups", name: "World Cup Groups", mimeType: "text/html;profile=mcp-app" },
            { uri: "ui://worldcup/third-place", name: "Third Place Selection", mimeType: "text/html;profile=mcp-app" },
            { uri: "ui://worldcup/bracket", name: "Knockout Bracket", mimeType: "text/html;profile=mcp-app" },
            { uri: "ui://worldcup/test", name: "Test Page", mimeType: "text/html;profile=mcp-app" },
          ],
        },
      };
    case "resources/read": {
      const params = req.params as { uri: string };
      const uri = params?.uri;
      if (!uri) {
        return { jsonrpc: "2.0", id, error: { code: -32602, message: "Missing resource URI" } };
      }
      try {
        const html =
          uri === "ui://worldcup/test"
            ? "<!doctype html><html><body><h1>Test</h1></body></html>"
            : await buildMcpAppHtml(env, uri);
        return {
          jsonrpc: "2.0",
          id,
          result: {
            contents: [
              {
                uri,
                mimeType: "text/html;profile=mcp-app",
                text: html,
                _meta: {
                  ui: {
                    csp: { connectDomains: [], resourceDomains: [] },
                    prefersBorder: false,
                  },
                },
              },
            ],
            _meta: {
              ui: {
                csp: { connectDomains: [], resourceDomains: [] },
                prefersBorder: false,
              },
            },
          },
        };
      } catch (err) {
        return { jsonrpc: "2.0", id, error: { code: -32000, message: (err as Error).message } };
      }
    }
    case "ping":
      return { jsonrpc: "2.0", id, result: {} };
    case "prompts/list":
      return { jsonrpc: "2.0", id, result: { prompts: [] } };
    case "logging/setLevel":
      return { jsonrpc: "2.0", id, result: {} };
    default:
      return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${req.method}` } };
  }
};

// Direct JSON-RPC handler for React app
const handleDirectRpc = async (req: JsonRpcRequest, env: { ASSETS: AssetsBinding }): Promise<JsonRpcResponse> => {
  const id = req.id ?? null;
  const handler = toolHandlers[req.method];
  if (!handler) return { jsonrpc: "2.0", id, error: { code: -32601, message: `Method not found: ${req.method}` } };
  try {
    const result = await handler(req.params ?? {});
    return { jsonrpc: "2.0", id, result };
  } catch (err) {
    return { jsonrpc: "2.0", id, error: { code: -32000, message: (err as Error).message } };
  }
};

const parseJsonRpc = (body: string): JsonRpcRequest | JsonRpcRequest[] | null => {
  try {
    return JSON.parse(body);
  } catch {
    return null;
  }
};

// ------------------------------------------------------------
// HTTP handler
// ------------------------------------------------------------
export default {
  async fetch(request: Request, env: { ASSETS: AssetsBinding }): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // MCP endpoint
    if ((pathname === "/mcp" || pathname === "/") && request.method === "POST") {
      const body = await request.text();
      const parsed = parseJsonRpc(body);
      if (!parsed) {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (Array.isArray(parsed)) {
        const responses = await Promise.all(parsed.map((r) => handleMcpRequest(r as any, env)));
        return new Response(JSON.stringify(responses), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const response = await handleMcpRequest(parsed as any, env);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Direct RPC endpoint
    if (pathname === "/rpc" && request.method === "POST") {
      const body = await request.text();
      const parsed = parseJsonRpc(body);
      if (!parsed) {
        return new Response(
          JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" } }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (Array.isArray(parsed)) {
        const responses = await Promise.all(parsed.map((r) => handleDirectRpc(r as any, env)));
        return new Response(JSON.stringify(responses), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const response = await handleDirectRpc(parsed, env);
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // UI routes
    if (pathname === "/ui/worldcup/groups" || pathname === "/ui/worldcup/groups/") {
      const html = await buildMcpAppHtml(env, "ui://worldcup/groups");
      return new Response(html, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html;profile=mcp-app" } });
    }
    if (pathname === "/ui/worldcup/third-place" || pathname === "/ui/worldcup/third-place/") {
      const html = await buildMcpAppHtml(env, "ui://worldcup/third-place");
      return new Response(html, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html;profile=mcp-app" } });
    }
    if (pathname === "/ui/worldcup/bracket" || pathname === "/ui/worldcup/bracket/") {
      const html = await buildMcpAppHtml(env, "ui://worldcup/bracket");
      return new Response(html, { status: 200, headers: { ...corsHeaders, "Content-Type": "text/html;profile=mcp-app" } });
    }
    if (pathname === "/ui" || pathname === "/ui/" || pathname === "/ui/worldcup" || pathname === "/ui/worldcup/") {
      return Response.redirect(url.origin + "/ui/worldcup/groups", 302);
    }

    // Static assets served from ASSETS binding
    if (pathname.startsWith("/assets/") || pathname === "/index.html") {
      const assetResponse = await env.ASSETS.fetch(request);
      return new Response(assetResponse.body, {
        status: assetResponse.status,
        headers: { ...Object.fromEntries(assetResponse.headers), ...corsHeaders },
      });
    }

    // Root GET -> redirect to UI
    if (pathname === "/" && request.method === "GET") {
      return Response.redirect(url.origin + "/ui/worldcup/groups", 302);
    }

    // Fallback: try assets
    const assetResponse = await env.ASSETS.fetch(request);
    if (assetResponse.ok) {
      return new Response(assetResponse.body, {
        status: assetResponse.status,
        headers: { ...Object.fromEntries(assetResponse.headers), ...corsHeaders },
      });
    }

    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
};
