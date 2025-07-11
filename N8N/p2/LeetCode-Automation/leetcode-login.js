const { chromium } = require('playwright');

async function leetcodeAutoLogin() {
    // Launch browser with settings optimized for better compatibility
    const browser = await chromium.launch({ 
        headless: false,  // This makes the browser visible
        slowMo: 1000,     // Adds 1 second delay between actions for better visibility
        args: [
            '--disable-blink-features=AutomationControlled',  // Helps avoid bot detection
            '--disable-web-security',  // Reduces some security restrictions that might cause issues
            '--no-sandbox',  // Helpful for some Windows configurations
            '--disable-features=VizDisplayCompositor'  // Can help with rendering issues
        ]
    });
    
    // Create a new browser context and page
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
        console.log('🚀 Starting LeetCode auto-login process...');
        
        // Navigate to LeetCode login page with multiple fallback strategies
        console.log('📱 Navigating to LeetCode...');
        
        // First, try with a more lenient loading strategy
        try {
            await page.goto('https://leetcode.com/accounts/login/', { 
                waitUntil: 'domcontentloaded',  // Wait for DOM to be ready, not full network idle
                timeout: 60000  // Increase timeout to 60 seconds
            });
            console.log('✅ Page loaded successfully with DOM strategy');
        } catch (error) {
            console.log('⚠️ DOM strategy failed, trying load strategy...');
            // Fallback: wait for basic load event
            await page.goto('https://leetcode.com/accounts/login/', { 
                waitUntil: 'load',
                timeout: 60000
            });
            console.log('✅ Page loaded successfully with load strategy');
        }
        
        // Wait for the login form to be visible with better error handling
        console.log('⏳ Waiting for login form to load...');
        
        // Try multiple selectors in case LeetCode has different login form layouts
        const loginSelectors = [
            '#id_login',           // Standard login field
            'input[name="login"]', // Alternative name-based selector
            'input[type="email"]', // Email input type
            'input[placeholder*="mail"]', // Placeholder text containing "mail"
            'input[placeholder*="username"]' // Placeholder text containing "username"
        ];
        
        let loginField = null;
        for (const selector of loginSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                loginField = selector;
                console.log(`✅ Found login field with selector: ${selector}`);
                break;
            } catch (error) {
                console.log(`⚠️ Login field not found with selector: ${selector}`);
            }
        }
        
        if (!loginField) {
            throw new Error('Could not find login field with any known selector');
        }
        
        // Fill in the email/username field using the found selector
        console.log('📧 Entering email address...');
        await page.fill(loginField, 'vivekmishra172003@gmail.com');
        
        // Find password field with similar flexibility
        const passwordSelectors = [
            '#id_password',
            'input[name="password"]',
            'input[type="password"]'
        ];
        
        let passwordField = null;
        for (const selector of passwordSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 5000 });
                passwordField = selector;
                console.log(`✅ Found password field with selector: ${selector}`);
                break;
            } catch (error) {
                console.log(`⚠️ Password field not found with selector: ${selector}`);
            }
        }
        
        if (!passwordField) {
            throw new Error('Could not find password field with any known selector');
        }
        
        // Fill in the password field
        console.log('🔐 Entering password...');
        await page.fill(passwordField, '@5803rkxt#$%APP');
        
        // Find and click the login button with multiple strategies
        console.log('🔑 Looking for login button...');
        const loginButtonSelectors = [
            '#signin_btn',
            'button[type="submit"]',
            'button:has-text("Sign In")',
            'button:has-text("Login")',
            'input[type="submit"]'
        ];
        
        let loginButton = null;
        for (const selector of loginButtonSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 3000 });
                loginButton = selector;
                console.log(`✅ Found login button with selector: ${selector}`);
                break;
            } catch (error) {
                console.log(`⚠️ Login button not found with selector: ${selector}`);
            }
        }
        
        if (!loginButton) {
            throw new Error('Could not find login button with any known selector');
        }
        
        // Click the login button
        console.log('🔑 Clicking login button...');
        await page.click(loginButton);
        
        // Wait for successful login with more flexible URL checking
        console.log('⏳ Waiting for login to complete...');
        
        // Wait a bit for the page to start processing the login
        await page.waitForTimeout(3000);
        
        // Check if we're redirected to any of these success pages
        const currentURL = page.url();
        console.log(`📍 Current URL after login attempt: ${currentURL}`);
        
        // Check for common success indicators
        const successPatterns = [
            '/problemset/',
            '/explore/',
            '/problems/',
            '/dashboard/',
            '/contest/',
            '/discuss/'
        ];
        
        const isLoginSuccessful = successPatterns.some(pattern => 
            currentURL.includes(pattern)
        );
        
        if (isLoginSuccessful) {
            console.log('✅ Login successful! Redirected to dashboard area.');
        } else {
            // Maybe we're still on login page, check for error messages
            console.log('⚠️ Still on login page, checking for error messages...');
            
            try {
                // Look for common error message elements
                const errorSelectors = [
                    '.error-message',
                    '.alert-danger',
                    '.form-errors',
                    '[class*="error"]',
                    '[class*="invalid"]'
                ];
                
                for (const selector of errorSelectors) {
                    const errorElement = await page.$(selector);
                    if (errorElement) {
                        const errorText = await errorElement.textContent();
                        console.log(`❌ Error found: ${errorText}`);
                    }
                }
            } catch (error) {
                console.log('No specific error messages found');
            }
            
            // Take a screenshot for debugging
            await page.screenshot({ path: 'leetcode-current-state.png' });
            console.log('📸 Screenshot saved as leetcode-current-state.png');
        }
        
        console.log('✅ Login successful! You are now logged into LeetCode.');
        console.log('🎉 Browser will remain open for you to continue browsing.');
        
        // Optional: Navigate to problems page to confirm we're logged in
        await page.goto('https://leetcode.com/problemset/all/');
        
        // Keep the browser open for manual interaction
        console.log('🔄 Browser staying open for manual use...');
        console.log('Press Ctrl+C in terminal to close when done.');
        
        // Keep the script running so browser stays open
        await new Promise(() => {});
        
    } catch (error) {
        console.error('❌ Login failed:', error.message);
        
        // Take a screenshot for debugging
        await page.screenshot({ path: 'leetcode-login-error.png' });
        console.log('📸 Screenshot saved as leetcode-login-error.png');
        
    } finally {
        // Only close if there was an error
        if (browser) {
            setTimeout(async () => {
                await browser.close();
            }, 5000);
        }
    }
}

// Run the login function
leetcodeAutoLogin().catch(console.error);