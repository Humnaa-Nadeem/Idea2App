const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:3000/new');
  
  console.log('Navigated to /new');
  
  // Wait for the button
  await page.waitForSelector('button');
  
  console.log('Clicking generate button...');
  // Click the generate button
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const genBtn = buttons.find(b => b.textContent.includes('Generate Project Blueprint'));
    if (genBtn) genBtn.click();
    else console.log('Generate button not found');
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();
