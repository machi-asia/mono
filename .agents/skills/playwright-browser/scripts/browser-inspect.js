#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

function printUsage() {
  console.log(`
Usage:
  node scripts/browser-inspect.js --url <URL> [options]

Options:
  --url <URL>             Target website URL to navigate to (e.g., http://localhost:3000, https://rose.machi-asia.com)
  --output <path>         Path to save screenshot (default: .agents/screenshots/screenshot-<timestamp>.png)
  --headless <true|false> Run browser in headless mode (default: false — opens visible browser)
  --full-page             Capture full scrollable page screenshot (default: false)
  --width <number>        Viewport width in pixels (default: 1280)
  --height <number>       Viewport height in pixels (default: 800)
  --wait <ms>             Milliseconds to wait after navigation before screenshotting (default: 1500)
  --click <selector>      Selector to click before taking screenshot
  --wait-for <selector>   Wait for specific DOM selector to be visible
`);
}

function parseArgs(args) {
  const options = {
    url: '',
    output: '',
    headless: false,
    fullPage: false,
    width: 1280,
    height: 800,
    wait: 1500,
    click: '',
    waitFor: '',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--help' || arg === '-h') {
      printUsage();
      process.exit(0);
    } else if (arg === '--url' && i + 1 < args.length) {
      options.url = args[++i];
    } else if (arg === '--output' && i + 1 < args.length) {
      options.output = args[++i];
    } else if (arg === '--headless') {
      if (i + 1 < args.length && (args[i + 1] === 'true' || args[i + 1] === 'false')) {
        options.headless = args[++i] === 'true';
      } else {
        options.headless = true;
      }
    } else if (arg === '--full-page') {
      options.fullPage = true;
    } else if (arg === '--width' && i + 1 < args.length) {
      options.width = parseInt(args[++i], 10);
    } else if (arg === '--height' && i + 1 < args.length) {
      options.height = parseInt(args[++i], 10);
    } else if (arg === '--wait' && i + 1 < args.length) {
      options.wait = parseInt(args[++i], 10);
    } else if (arg === '--click' && i + 1 < args.length) {
      options.click = args[++i];
    } else if (arg === '--wait-for' && i + 1 < args.length) {
      options.waitFor = args[++i];
    }
  }

  return options;
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (!options.url) {
    console.error('Error: --url parameter is required.');
    printUsage();
    process.exit(1);
  }

  const screenshotsDir = path.resolve(process.cwd(), '.agents/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const outputPath = options.output
    ? path.resolve(process.cwd(), options.output)
    : path.join(screenshotsDir, `screenshot-${Date.now()}.png`);

  console.log(`[BrowserInspect] Launching browser (headless: ${options.headless})...`);
  const browser = await chromium.launch({
    headless: options.headless,
  });

  try {
    const context = await browser.newContext({
      viewport: { width: options.width, height: options.height },
    });

    const page = await context.newPage();
    console.log(`[BrowserInspect] Navigating to: ${options.url}`);
    await page.goto(options.url, { waitUntil: 'load', timeout: 30000 });

    if (options.waitFor) {
      console.log(`[BrowserInspect] Waiting for selector: ${options.waitFor}`);
      await page.waitForSelector(options.waitFor, { timeout: 10000 });
    }

    if (options.click) {
      console.log(`[BrowserInspect] Clicking element: ${options.click}`);
      await page.click(options.click);
    }

    if (options.wait > 0) {
      console.log(`[BrowserInspect] Waiting ${options.wait}ms for UI stabilization...`);
      await page.waitForTimeout(options.wait);
    }

    const title = await page.title();
    console.log(`[BrowserInspect] Page Title: "${title}"`);

    await page.screenshot({ path: outputPath, fullPage: options.fullPage });
    console.log(`[BrowserInspect] Screenshot successfully saved to: ${outputPath}`);

    // Return structured JSON for agent consumption
    const result = {
      success: true,
      url: page.url(),
      title,
      screenshotPath: outputPath,
      viewport: { width: options.width, height: options.height },
    };
    console.log('\n--- RESULT_JSON ---');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error(`[BrowserInspect] Error:`, err.message || err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

main();
