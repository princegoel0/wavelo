import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const htmlPath = resolve('apps/docs/dist/index.html');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(`file://${htmlPath}`);
await page.waitForLoadState('networkidle');

console.log('Testing App Screens & Major UI Elements...');

// 1. Audit App UI Screens/Sections
const uiSections = [
  { id: 'site-header', selector: '.site-header', name: 'Site Header & Sticky Navbar' },
  { id: 'hero-section', selector: '.hero', name: 'Hero Section & Quickstart' },
  { id: 'terminal-box', selector: '.terminal-box', name: 'Interactive Terminal Install Box' },
  { id: 'studio-workbench', selector: '.studio-workbench', name: 'Interactive Studio Workbench' },
  { id: 'studio-canvas', selector: '.stage-wrapper', name: 'Studio Stage Canvas & Mocks' },
  { id: 'studio-controls', selector: '.controls-column', name: 'Studio Controls Column' },
  { id: 'filter-bar', selector: '.filter-bar', name: 'Sticky Filter & Search Bar' },
  { id: 'cards-grid', selector: '.grid', name: 'Component Cards Grid' },
  { id: 'card-structure', selector: '.card:first-child', name: 'Individual Card Container & Action Bar' },
  { id: 'site-footer', selector: '.site-footer', name: 'Site Footer & Metadata' }
];

const screenResults = [];
for (const section of uiSections) {
  const el = page.locator(section.selector).first();
  const exists = await el.count() > 0;
  if (!exists) {
    screenResults.push({ ...section, status: 'MISSING', issues: ['Element not found in DOM'] });
    continue;
  }
  const box = await el.boundingBox();
  const overflow = await el.evaluate((node) => {
    return {
      scrollWidth: node.scrollWidth,
      clientWidth: node.clientWidth,
      scrollHeight: node.scrollHeight,
      clientHeight: node.clientHeight,
      hasOverflowX: node.scrollWidth > node.clientWidth + 1,
      hasOverflowY: node.scrollHeight > node.clientHeight + 1,
    };
  });
  
  // Responsive check at mobile (375px)
  await page.setViewportSize({ width: 375, height: 812 });
  const mobileBox = await el.boundingBox();
  const mobileOverflow = await el.evaluate((node) => node.scrollWidth > node.clientWidth + 1);
  await page.setViewportSize({ width: 1440, height: 900 });

  screenResults.push({
    ...section,
    status: (overflow.hasOverflowX || mobileOverflow) ? 'WARN' : 'PASS',
    box,
    mobileBox,
    overflow,
    mobileOverflow
  });
}

console.log('UI Screen Audit complete. Found:', screenResults.length, 'sections.');

// 2. Audit all 153 Loader Components across the 3 Visual Axes
const loaders = await page.evaluate(() => {
  const cards = Array.from(document.querySelectorAll('.card'));
  return cards.map((card) => {
    const id = card.getAttribute('data-id');
    const name = card.getAttribute('data-name');
    const category = card.getAttribute('data-category');
    const dimension = card.getAttribute('data-dimension');
    const preview = card.querySelector('.preview');
    const loader = preview?.querySelector('.wavelo');

    if (!loader) {
      return { id, name, category, dimension, error: 'Loader element missing' };
    }

    const previewRect = preview.getBoundingClientRect();
    const loaderRect = loader.getBoundingClientRect();

    // Axis 1: Alignment / Grid
    // Check centering inside preview container
    const previewCenterX = previewRect.left + previewRect.width / 2;
    const previewCenterY = previewRect.top + previewRect.height / 2;
    const loaderCenterX = loaderRect.left + loaderRect.width / 2;
    const loaderCenterY = loaderRect.top + loaderRect.height / 2;

    const offsetX = Math.abs(previewCenterX - loaderCenterX);
    const offsetY = Math.abs(previewCenterY - loaderCenterY);

    // Aspect ratio & bounding box check
    const width = loaderRect.width;
    const height = loaderRect.height;
    const isSquare = Math.abs(width - height) < 2;

    // Check children / parts alignment
    const parts = Array.from(loader.querySelectorAll('.wavelo__part'));
    const partBoxes = parts.map((p) => {
      const r = p.getBoundingClientRect();
      return { width: r.width, height: r.height, top: r.top - loaderRect.top, left: r.left - loaderRect.left };
    });

    // Axis 2: Hierarchy & States
    const computed = window.getComputedStyle(loader);
    const opacity = parseFloat(computed.opacity);
    const visibility = computed.visibility;
    const display = computed.display;
    const transform = computed.transform;
    const color = computed.color;

    // Check clipping: does loader exceed preview?
    const isClippedX = loaderRect.left < previewRect.left - 1 || loaderRect.right > previewRect.right + 1;
    const isClippedY = loaderRect.top < previewRect.top - 1 || loaderRect.bottom > previewRect.bottom + 1;

    // Axis 3: Animation & Transition Behavior
    const animationName = computed.animationName;
    const animationDuration = computed.animationDuration;
    const animationTimingFunction = computed.animationTimingFunction;
    const animationPlayState = computed.animationPlayState;

    const isAnimating = animationName && animationName !== 'none';
    const childAnimations = parts.map((p) => window.getComputedStyle(p).animationName).filter((n) => n && n !== 'none');

    return {
      id,
      name,
      category,
      dimension,
      alignment: {
        width,
        height,
        offsetX: Math.round(offsetX * 10) / 10,
        offsetY: Math.round(offsetY * 10) / 10,
        isCentered: offsetX < 3 && offsetY < 3,
        isSquare,
        partsCount: parts.length
      },
      hierarchy: {
        opacity,
        visibility,
        display,
        color,
        isClipped: isClippedX || isClippedY
      },
      motion: {
        animationName,
        animationDuration,
        animationTimingFunction,
        animationPlayState,
        isAnimating: isAnimating || childAnimations.length > 0,
        childAnimationCount: childAnimations.length
      }
    };
  });
});

console.log(`Evaluated ${loaders.length} loaders.`);

import { writeFile } from 'node:fs/promises';
await writeFile(
  'scripts/qa-inspection-raw.json',
  JSON.stringify({ screens: screenResults, loaders }, null, 2)
);

console.log('Saved raw QA inspection results.');
await browser.close();

