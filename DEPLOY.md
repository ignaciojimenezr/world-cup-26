# Deploying World Cup 2026 MCP App to Cloudflare Workers

This guide explains how to deploy the World Cup 2026 MCP App to Cloudflare Workers.

## Prerequisites

1. **Cloudflare Account**: Sign up at [cloudflare.com](https://www.cloudflare.com)
2. **Wrangler CLI**: Already installed as a dev dependency

## Setup

1. **Authenticate with Wrangler** (first time only):
   ```bash
   npx wrangler login
   ```
   This will open your browser to authenticate with Cloudflare.

2. **Build the widgets**:
   ```bash
   npm run build:widgets
   ```
   This builds the React app as a widget that will be served from Cloudflare Assets.

## Deployment

Deploy to Cloudflare Workers:
```bash
npm run deploy
```

This command will:
1. Build the widgets (`npm run build:widgets`)
2. Deploy the Worker to Cloudflare
3. Upload widget assets to the Worker's ASSETS binding

## After Deployment

After deployment, Wrangler will output your Worker URL. Your MCP endpoint will be at:
```
https://<your-worker-name>.<your-subdomain>.workers.dev/mcp
```

## Configuration

The deployment configuration is in `wrangler.jsonc`:

- **name**: Worker name (currently `worldcup-2026-mcp`)
- **main**: Entry point (`server/worker.ts`)
- **assets**: Directory containing built widgets (`./ui/dist/widgets`)
- **compatibility_date**: Cloudflare Workers compatibility date

## Local Development

To test locally before deploying:
```bash
npm run dev:worker
```

This starts Wrangler's development server. The MCP endpoint will be available at `http://localhost:8787/mcp`.

## Testing with MCPJam

You can test your deployed MCP App using MCPJam:

```bash
npx @mcpjam/inspector@latest
```

Then connect to your deployed endpoint:
```
https://<your-worker-name>.<your-subdomain>.workers.dev/mcp
```

## Troubleshooting

### Widget not loading
- Ensure widgets are built: `npm run build:widgets`
- Check that the HTML file exists in `ui/dist/widgets/widgets/worldcup-widget.html`
- Verify the `htmlPath` in the MCP server matches the actual file path

### MCP connection issues
- Verify the endpoint URL is correct: `https://your-worker.workers.dev/mcp`
- Check Cloudflare Workers logs: `npx wrangler tail`
- Ensure the MCP client supports HTTP/SSE transport

### Type errors
- Run `npm run cf-typegen` to regenerate Cloudflare Workers TypeScript types
- Ensure `Env` is imported from `worker-configuration.d.ts`

