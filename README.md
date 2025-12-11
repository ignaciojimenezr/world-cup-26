# World Cup 2026 MCP App

A complete MCP App for predicting the 2026 FIFA World Cup bracket.

## Features

- **Group predictions**: Assign positions 1–4 for all 12 groups (A–L)
- **Third-place selection**: Pick 8 of 12 third-place teams to advance
- **Knockout bracket**: Interactive Round-of-32 → Final bracket
- **Match details**: View stadium, city, date info
- **Save/load**: Persist predictions via MCP tools

## Quick Start

```bash
# Build UI and start server
cd ui && npm install && npm run build && cd ../server && npm install && npm run dev
```

Then open http://localhost:3000

## Architecture

HTTP-based MCP server:

- `POST /rpc` — JSON-RPC 2.0 for MCP tool calls
- `GET /ui/worldcup/groups` — Groups view (MCP App)
- `GET /ui/worldcup/third-place` — Third-place view
- `GET /ui/worldcup/bracket` — Bracket view

All HTML served with `Content-Type: text/html;profile=mcp-app`

## MCP Tools

| Tool | Description |
|------|-------------|
| `worldcup.getInitialData` | Returns teams, groups, bracket, saved prediction |
| `worldcup.savePrediction` | Persist prediction (in-memory) |
| `worldcup.computeBracket` | Resolve bracket from predictions |
| `worldcup.getBracketTemplate` | Get bracket structure |

## Project Structure

```
world-cup-26/
├── server/          # HTTP server + MCP tools
│   ├── index.ts
│   ├── teams.ts
│   └── bracket-template.ts
├── ui/              # React app
│   └── src/
│       ├── components/
│       └── lib/
└── shared/          # Shared TypeScript types
    └── types.ts
```

## JSON-RPC Example

```bash
curl -X POST http://localhost:3000/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"worldcup.getInitialData","params":{}}'
```

