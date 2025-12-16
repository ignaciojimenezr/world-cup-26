# Troubleshooting Cloudflare Workers Deployment

## Issue: Getting Minified JavaScript Instead of HTML

If you're seeing minified JavaScript code (like `function(K,te){var X=K.sortIndex-te.sortIndex...`) when trying to access your MCP App, this means the widget HTML isn't being loaded or inlined correctly.

### Possible Causes

1. **Assets not found**: The JavaScript/CSS assets referenced in the HTML aren't accessible via the Assets binding
2. **Path resolution issue**: The paths in the HTML don't match the Assets binding structure
3. **Build output mismatch**: The built files don't match what the server expects

### Solutions

1. **Verify the build output**:
   ```bash
   npm run build:widgets
   ls -la ui/dist/widgets/
   ```
   
   You should see:
   - `widgets/worldcup-widget.html`
   - `assets/worldcup-widget-*.js`
   - `assets/worldcup-widget-*.css`

2. **Check the HTML file**:
   ```bash
   cat ui/dist/widgets/widgets/worldcup-widget.html
   ```
   
   The HTML should reference assets like `/assets/worldcup-widget-*.js` and `/assets/worldcup-widget-*.css`

3. **Test locally with Wrangler**:
   ```bash
   npm run dev:worker
   ```
   
   Then check the logs for any errors when loading assets.

4. **Verify Assets binding configuration**:
   
   In `wrangler.jsonc`, ensure:
   ```jsonc
   "assets": {
     "directory": "./ui/dist/widgets",
     "binding": "ASSETS"
   }
   ```
   
   The directory should point to where your built widgets are.

5. **Check Cloudflare Workers logs**:
   ```bash
   npx wrangler tail
   ```
   
   Look for errors like "Failed to fetch" or "Failed to inline".

### Debugging Steps

1. **Add logging to the MCP server**:
   
   The `buildMcpAppHtml` function now includes error handling. Check the Cloudflare Workers logs to see which asset is failing to load.

2. **Verify asset paths**:
   
   The Assets binding root is `ui/dist/widgets`, so:
   - HTML file: `/widgets/worldcup-widget.html`
   - JS file: `/assets/worldcup-widget-*.js`
   - CSS file: `/assets/worldcup-widget-*.css`

3. **Test asset loading directly**:
   
   You can test if assets are accessible by checking the Worker logs when a resource is requested.

### Common Fixes

- **Rebuild widgets**: `npm run build:widgets`
- **Redeploy**: `npm run deploy`
- **Clear cache**: Sometimes Cloudflare caches old assets
- **Check file permissions**: Ensure all files are readable

If the issue persists, check the Cloudflare Workers dashboard logs for detailed error messages.

