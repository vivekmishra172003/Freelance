const { test, expect } = require('@playwright/test');

test('my first test', async ({ page }) => {
await page.goto('https://www.csewallah.in/');
    await expect(page).toHaveTitle('Cse Wallah');
});