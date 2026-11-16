---
name: playwright-browser
description: Opens a browser using Playwright to navigate websites, interact with web pages, and capture screenshots for visual inspection and analysis.
metadata:
  required_access:
    - CODEBASE
---

# Playwright Browser Skill

This skill allows agents to open a browser window (headful by default so the user can see it, or headless), navigate to any local or remote site, wait for elements or perform interactions, and capture full-page or viewport screenshots that can then be read and inspected.

## When to Use

- Navigating to running local web applications (e.g., `http://localhost:3000`, `http://localhost:3005`) or remote websites.
- Taking visual screenshots of pages, components, dialogs, or mobile/desktop viewport states.
- Reading and verifying UI layouts, styling, visual errors, responsive behavior, or live changes.

## Usage

Use the helper script located at `.agents/skills/playwright-browser/scripts/browser-inspect.js`:

```powershell
node .agents/skills/playwright-browser/scripts/browser-inspect.js --url <URL> [options]
```

### Options

| Flag | Description | Default |
|------|-------------|---------|
| `--url <URL>` | Target website URL to navigate to (*required*) | - |
| `--output <path>` | Destination path for the captured screenshot PNG | `.agents/screenshots/screenshot-<timestamp>.png` |
| `--headless <true\|false>` | Run headless or open a visible browser window | `false` (visible browser) |
| `--full-page` | Capture full scrollable page instead of only viewport | `false` |
| `--width <px>` | Browser viewport width | `1280` |
| `--height <px>` | Browser viewport height | `800` |
| `--wait <ms>` | Milliseconds to wait before taking screenshot | `1500` |
| `--click <selector>` | Selector to click before screenshot | - |
| `--wait-for <selector>` | Wait for specific selector to appear | - |

## Example Workflows

### 1. View local app in a visible browser and take a screenshot
```powershell
node .agents/skills/playwright-browser/scripts/browser-inspect.js --url http://localhost:3000
```

### 2. Capture full scrollable landing page
```powershell
node .agents/skills/playwright-browser/scripts/browser-inspect.js --url https://rose.machi-asia.com --full-page
```

### 3. Inspect mobile view
```powershell
node .agents/skills/playwright-browser/scripts/browser-inspect.js --url http://localhost:3000 --width 390 --height 844
```

### 4. Reading the Screenshot
Once the script outputs:
```
Screenshot successfully saved to: d:\Repositories\mono\.agents\screenshots\screenshot-1794453896000.png
```
Use the `read_file` tool passing that absolute path to inspect the captured image directly.
