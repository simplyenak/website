import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

async function diagnoseStyling() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport for consistent screenshots
  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('Navigating to http://localhost:4322...');
  await page.goto('http://localhost:4322', { waitUntil: 'networkidle' });

  // Wait for page to fully load
  await page.waitForTimeout(2000);

  // Take full-page screenshot
  console.log('Taking full-page screenshot...');
  const screenshotPath = '/tmp/styling-diagnosis.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);

  // Capture console messages
  console.log('\n=== CONSOLE MESSAGES ===');
  const consoleLogs = [];

  page.on('console', (msg) => {
    const logEntry = `[${msg.type().toUpperCase()}] ${msg.text()}`;
    consoleLogs.push(logEntry);
    console.log(logEntry);
  });

  // Capture console errors from page
  page.on('pageerror', (error) => {
    console.log(`[PAGE_ERROR] ${error.message}`);
  });

  // Trigger console messages by reloading or navigating
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Get HTML structure and computed styles
  console.log('\n=== COMPUTED STYLES ANALYSIS ===');

  const stylingAnalysis = await page.evaluate(() => {
    const analysis = {
      documentElement: {
        classes: document.documentElement.className,
        styles: window.getComputedStyle(document.documentElement),
        hasColorScheme: !!document.documentElement.style.colorScheme,
      },
      body: {
        classes: document.body.className,
        styles: window.getComputedStyle(document.body),
        backgroundColor: window.getComputedStyle(document.body).backgroundColor,
        color: window.getComputedStyle(document.body).color,
      },
      headings: {},
      mainContainer: null,
      styleSheets: [],
      tailwindActive: false,
      cssMissing: [],
    };

    // Check for main heading
    const h1 = document.querySelector('h1');
    if (h1) {
      const styles = window.getComputedStyle(h1);
      analysis.headings.h1 = {
        content: h1.textContent?.substring(0, 50),
        classes: h1.className,
        color: styles.color,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
      };
    }

    // Check main container
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main) {
      const styles = window.getComputedStyle(main);
      analysis.mainContainer = {
        classes: main.className,
        backgroundColor: styles.backgroundColor,
        display: styles.display,
        padding: styles.padding,
        color: styles.color,
      };
    }

    // Check for Tailwind CSS
    const htmlClass = document.documentElement.className;
    analysis.tailwindActive = htmlClass.includes('dark') ||
                              document.body.className.includes('tailwind') ||
                              !!document.querySelector('style[data-tailwind]') ||
                              !!Array.from(document.styleSheets).some(sheet => {
                                try {
                                  return sheet.href?.includes('tailwind');
                                } catch (e) {
                                  return false;
                                }
                              });

    // List stylesheets
    try {
      Array.from(document.styleSheets).forEach((sheet, i) => {
        analysis.styleSheets.push({
          index: i,
          href: sheet.href || 'inline',
          disabled: sheet.disabled,
          rules: sheet.cssRules?.length || 0,
        });
      });
    } catch (e) {
      analysis.styleSheets.push({ error: 'Could not access stylesheets' });
    }

    // Check for common styling issues
    const elementsToCheck = [
      { selector: 'header', name: 'header' },
      { selector: 'nav', name: 'nav' },
      { selector: '[data-hero]', name: 'hero section' },
      { selector: 'section', name: 'first section' },
      { selector: 'button', name: 'button' },
      { selector: 'a', name: 'link' },
    ];

    analysis.elementStyles = {};
    elementsToCheck.forEach(({ selector, name }) => {
      const elem = document.querySelector(selector);
      if (elem) {
        const styles = window.getComputedStyle(elem);
        analysis.elementStyles[name] = {
          exists: true,
          display: styles.display,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          opacity: styles.opacity,
          visibility: styles.visibility,
        };
      }
    });

    // Check if CSS variables are defined
    const root = document.documentElement;
    analysis.cssVariables = {
      primary: getComputedStyle(root).getPropertyValue('--primary').trim(),
      secondary: getComputedStyle(root).getPropertyValue('--secondary').trim(),
      background: getComputedStyle(root).getPropertyValue('--background').trim(),
    };

    return analysis;
  });

  console.log('Document HTML classes:', stylingAnalysis.documentElement.classes);
  console.log('Body classes:', stylingAnalysis.body.classes);
  console.log('Body styles - Background:', stylingAnalysis.body.backgroundColor);
  console.log('Body styles - Color:', stylingAnalysis.body.color);
  console.log('Tailwind active:', stylingAnalysis.tailwindActive);
  console.log('CSS Variables:', stylingAnalysis.cssVariables);
  console.log('\nStylesheets loaded:');
  stylingAnalysis.styleSheets.forEach(sheet => {
    console.log(`  - ${sheet.href || 'inline'} (${sheet.rules || 'N/A'} rules, disabled: ${sheet.disabled})`);
  });
  console.log('\nElement Styles:');
  Object.entries(stylingAnalysis.elementStyles).forEach(([name, styles]) => {
    if (styles.exists) {
      console.log(`  ${name}:`);
      console.log(`    - Display: ${styles.display}`);
      console.log(`    - Background: ${styles.backgroundColor}`);
      console.log(`    - Color: ${styles.color}`);
      console.log(`    - Opacity: ${styles.opacity}`);
    }
  });

  // Check for layout issues with viewport
  console.log('\n=== LAYOUT ANALYSIS ===');
  const layoutAnalysis = await page.evaluate(() => {
    return {
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      documentWidth: document.documentElement.scrollWidth,
      documentHeight: document.documentElement.scrollHeight,
      bodyMargin: window.getComputedStyle(document.body).margin,
      bodyPadding: window.getComputedStyle(document.body).padding,
      overflowX: window.getComputedStyle(document.documentElement).overflowX,
      overflowY: window.getComputedStyle(document.documentElement).overflowY,
      hasScrollbar: document.documentElement.scrollHeight > window.innerHeight,
    };
  });

  console.log('Window dimensions:', `${layoutAnalysis.windowWidth}x${layoutAnalysis.windowHeight}`);
  console.log('Document dimensions:', `${layoutAnalysis.documentWidth}x${layoutAnalysis.documentHeight}`);
  console.log('Body margin:', layoutAnalysis.bodyMargin);
  console.log('Body padding:', layoutAnalysis.bodyPadding);
  console.log('Has vertical scrollbar:', layoutAnalysis.hasScrollbar);

  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    url: 'http://localhost:4322',
    screenshotPath,
    styling: stylingAnalysis,
    layout: layoutAnalysis,
  };

  const reportPath = '/tmp/styling-diagnosis-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\nReport saved to: ${reportPath}`);

  await browser.close();
}

diagnoseStyling().catch(console.error);
