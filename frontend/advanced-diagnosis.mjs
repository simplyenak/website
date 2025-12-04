import { chromium } from 'playwright';

async function advancedDiagnosis() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1920, height: 1080 });

  console.log('Analyzing styling issues...\n');
  await page.goto('http://localhost:4322', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Get detailed styling issues
  const issues = await page.evaluate(() => {
    const problems = [];

    // Check body background and text color contrast
    const bodyStyles = window.getComputedStyle(document.body);
    problems.push({
      component: 'body',
      backgroundColor: bodyStyles.backgroundColor,
      textColor: bodyStyles.color,
      issue: bodyStyles.backgroundColor === 'rgba(0, 0, 0, 0)' ? 'No background color set' : 'OK'
    });

    // Check header styling
    const header = document.querySelector('header');
    if (header) {
      const h = window.getComputedStyle(header);
      problems.push({
        component: 'header',
        backgroundColor: h.backgroundColor,
        textColor: h.color,
        issue: h.backgroundColor === 'rgba(0, 0, 0, 0)' ? 'Header has no background' : 'OK'
      });
    }

    // Check all sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, i) => {
      const s = window.getComputedStyle(section);
      const classes = section.className;

      if (s.color === 'rgb(0, 0, 0)' && s.backgroundColor === 'rgba(0, 0, 0, 0)') {
        problems.push({
          component: `section[${i}]`,
          classes: classes || 'no classes',
          backgroundColor: s.backgroundColor,
          textColor: s.color,
          issue: 'Low contrast or missing styling'
        });
      }
    });

    // Check buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach((btn, i) => {
      const b = window.getComputedStyle(btn);
      if (i < 3) {
        problems.push({
          component: `button[${i}]`,
          text: btn.textContent?.substring(0, 30),
          backgroundColor: b.backgroundColor,
          textColor: b.color,
          padding: b.padding,
          classes: btn.className
        });
      }
    });

    // Check if Tailwind classes are present
    const tailwindExample = document.querySelector('[class*="bg-"]') ||
                            document.querySelector('[class*="text-"]') ||
                            document.querySelector('[class*="p-"]');

    problems.push({
      component: 'tailwind-detection',
      hasTailwindClasses: !!tailwindExample,
      tailwindClassExample: tailwindExample?.className || 'None found'
    });

    // Check CSS imports in head
    const head = document.head;
    const styles = Array.from(head.querySelectorAll('style, link[rel="stylesheet"]'));
    problems.push({
      component: 'stylesheet-links',
      count: styles.length,
      styleTags: head.querySelectorAll('style').length,
      linkTags: head.querySelectorAll('link[rel="stylesheet"]').length
    });

    return problems;
  });

  console.log('STYLING ISSUES FOUND:\n');
  issues.forEach((issue, i) => {
    console.log(`[${i}] Component: ${issue.component}`);
    Object.entries(issue).forEach(([key, val]) => {
      if (key !== 'component') {
        console.log(`    ${key}: ${JSON.stringify(val)}`);
      }
    });
    console.log('');
  });

  await browser.close();
}

advancedDiagnosis().catch(console.error);
