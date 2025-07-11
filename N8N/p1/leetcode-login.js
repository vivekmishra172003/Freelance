const { chromium } = require('playwright');

async function loginToLeetCode() {
  console.log('🚀 Starting LeetCode automation...');
  
  // Launch browser (visible so you can see what's happening)
  const browser = await chromium.launch({
    headless: false,  // Set to true once you're confident it works
    slowMo: 2000     // Slow down by 2 seconds between actions
  });

  try {
    const page = await browser.newPage();
    
    // Navigate to LeetCode login
    console.log('📍 Going to LeetCode login page...');
    await page.goto('https://leetcode.com/accounts/login/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Fill email
    console.log('✉️ Filling email...');
    await page.fill('input[name="login"]', 'vivekmishra172003@gmail.com');
    
    // Fill password
    console.log('🔒 Filling password...');
    await page.fill('input[name="password"]', '@5803rkxt#$%APP');
    
    // Click login button
    console.log('🔘 Clicking login button...');
    await page.click('button[type="submit"]');
    
    // Wait for navigation
    console.log('⏳ Waiting for login...');
    await page.waitForNavigation({ timeout: 15000 });
    
    // Check if login successful
    const currentUrl = page.url();
    console.log('🌐 Current URL:', currentUrl);
    
    if (currentUrl.includes('leetcode.com') && !currentUrl.includes('login')) {
      console.log('✅ LOGIN SUCCESSFUL!');
      
      // Take a screenshot as proof
      await page.screenshot({ path: 'login-success.png' });
      
      // Wait 10 seconds to see the result
      await page.waitForTimeout(10000);
      
      return { success: true, message: 'Login successful!' };
      
    } else {
      console.log('❌ LOGIN FAILED');
      await page.screenshot({ path: 'login-failed.png' });
      return { success: false, message: 'Login failed - check credentials' };
    }
    
  } catch (error) {
    console.error('💥 Error occurred:', error.message);
    
    // Take screenshot on error
    try {
      await page.screenshot({ path: 'error-screenshot.png' });
    } catch (screenshotError) {
      console.error('Could not take screenshot:', screenshotError.message);
    }
    
    return { success: false, message: error.message };
    
  } finally {
    // Always close browser
    await browser.close();
    console.log('🏁 Browser closed');
  }
}

// Run the function and output result for n8n
loginToLeetCode()
  .then(result => {
    console.log('RESULT:', JSON.stringify(result));
    process.exit(result.success ? 0 : 1);
  })
  .catch(error => {
    console.error('FATAL ERROR:', error);
    process.exit(1);
  });