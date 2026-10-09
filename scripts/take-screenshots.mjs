import { chromium } from '/home/cfmv/.nvm/versions/node/v26.8.1/lib/node_modules/@playwright/test/node_modules/playwright-core/index.mjs';

async function capture() {
    console.log('Launching browser...');
    const browser = await chromium.launch();

    // 1. Light Mode - Active Sorting State
    const contextLight = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        deviceScaleFactor: 2,
        colorScheme: 'light',
    });
    const pageLight = await contextLight.newPage();
    console.log('Navigating to http://localhost:8080 (Light Mode)...');
    await pageLight.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await pageLight.waitForSelector('canvas');
    await pageLight.waitForTimeout(1000);

    // Target the visible desktop "Run Algorithm" button
    const runBtn = pageLight.locator('button:has-text("Run Algorithm"):visible');
    if (await runBtn.isVisible()) {
        const respPromise = pageLight.waitForResponse(r => r.url().includes('/api/sort'), { timeout: 10000 });
        await runBtn.click();
        await respPromise;
        console.log('Sorting started in light mode, letting animation progress...');
        await pageLight.waitForTimeout(1400);
        // Pause to freeze comparing/swapping colors
        const pauseBtn = pageLight.locator('button:has-text("Pause"):visible');
        if (await pauseBtn.isVisible()) {
            await pauseBtn.click();
        }
        await pageLight.waitForTimeout(400);
    }

    console.log('Saving docs/images/sortpulse-light.png...');
    await pageLight.screenshot({ path: 'docs/images/sortpulse-light.png' });
    await contextLight.close();

    // 2. Dark Mode - Active Sorting State
    const contextDark = await browser.newContext({
        viewport: { width: 1440, height: 960 },
        deviceScaleFactor: 2,
        colorScheme: 'dark',
    });
    const pageDark = await contextDark.newPage();
    console.log('Navigating to http://localhost:8080 (Dark Mode)...');
    await pageDark.goto('http://localhost:8080', { waitUntil: 'networkidle' });
    await pageDark.waitForSelector('canvas');
    await pageDark.waitForTimeout(1000);

    const runBtnDark = pageDark.locator('button:has-text("Run Algorithm"):visible');
    if (await runBtnDark.isVisible()) {
        const respPromise = pageDark.waitForResponse(r => r.url().includes('/api/sort'), { timeout: 10000 });
        await runBtnDark.click();
        await respPromise;
        console.log('Sorting started in dark mode, letting animation progress...');
        await pageDark.waitForTimeout(1400);
        const pauseBtnDark = pageDark.locator('button:has-text("Pause"):visible');
        if (await pauseBtnDark.isVisible()) {
            await pauseBtnDark.click();
        }
        await pageDark.waitForTimeout(400);
    }

    console.log('Saving docs/images/sortpulse-dark.png...');
    await pageDark.screenshot({ path: 'docs/images/sortpulse-dark.png' });
    await contextDark.close();

    await browser.close();
    console.log('All screenshots captured successfully!');
}

capture().catch((err) => {
    console.error('Capture error:', err);
    process.exit(1);
});
