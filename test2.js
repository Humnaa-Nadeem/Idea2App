const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));
  page.on('response', response => {
    if (response.url().includes('/api/generate')) {
      console.log('API RESPONSE:', response.status());
    }
  });

  await page.goto('http://localhost:3000/new');
  console.log('Navigated to /new');
  
  // Fill the textarea
  await page.waitForSelector('textarea');
  await page.type('textarea', 'I want to build a platform for tutors and students.');
  console.log('Filled textarea');
  
  // Click generate
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const genBtn = buttons.find(b => b.textContent.includes('Generate Project Blueprint'));
    if (genBtn) genBtn.click();
  });
  console.log('Clicked generate button');
  
  // Wait for 5 seconds to see what happens
  await new Promise(r => setTimeout(r, 5000));
  
  console.log('Current URL:', page.url());
  
  await browser.close();
})();
