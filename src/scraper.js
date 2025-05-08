// Scraper functionality for catinaflat job notices
const puppeteer = require('puppeteer');

async function setupBrowser(headless) {
    const isHeadless = headless === 'true';
    console.log('HEADLESS environment variable:', headless);
    console.log('isHeadless value:', isHeadless);
    console.log(`Starting browser in ${isHeadless ? 'headless' : 'headed'} mode`);

    const launchOptions = {
        headless: isHeadless ? 'new' : false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ]
    };

    // Only set executablePath on Mac
    if (process.platform === 'darwin') {
        launchOptions.executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    }

    return await puppeteer.launch(launchOptions);
}

async function handleCookieConsent(page) {
    try {
        console.log('Waiting for cookie consent banner...');
        await page.waitForSelector('.cky-consent-bar', { 
            timeout: 10000,
            visible: true 
        });

        console.log('Cookie consent banner found, looking for accept button...');
        await page.waitForSelector('.cky-btn.cky-btn-accept[data-cky-tag="accept-button"]', {
            timeout: 5000,
            visible: true
        });

        console.log('Clicking accept cookies button...');
        await page.click('.cky-btn.cky-btn-accept[data-cky-tag="accept-button"]');
        console.log('Cookie consent accepted');
    } catch (error) {
        console.log('Error during cookie consent handling:', error.message);
    }
}

async function login(page, email, password) {
    console.log('Navigating to login page...');
    await page.goto('https://catinaflat.de/en/login', { 
        timeout: 30000 
    });

    // Handle cookie consent
    await handleCookieConsent(page);

    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);

    // Debug: Check if we can find the form elements
    const formExists = await page.evaluate(() => {
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');
        const submitButton = document.querySelector('input[type="submit"]');
        return {
            email: !!emailInput,
            password: !!passwordInput,
            submit: !!submitButton
        };
    });

    console.log('Form elements found:', formExists);

    // Fill in the login form
    console.log('Filling login form...');

    // First focus the email field
    await page.focus('#email');
    await page.evaluate(() => {
        document.querySelector('#email').value = '';
    });
    await page.keyboard.type(email);
    console.log('Email entered');

    await page.waitForTimeout(500);

    // Focus the password field
    await page.focus('#password');
    await page.evaluate(() => {
        document.querySelector('#password').value = '';
    });
    await page.keyboard.type(password);
    console.log('Password entered');

    await page.waitForTimeout(500);

    // Click the login button
    console.log('Submitting login form...');
    await page.click('input[type="submit"]');

    // Wait for navigation after login
    console.log('Waiting for navigation after login...');
    await page.waitForNavigation({ 
        waitUntil: 'networkidle0',
        timeout: 30000 
    });
}

async function checkNoticeBoard(page, userId) {
    console.log('Navigating to target page...');
    await page.goto(`https://catinaflat.de/en/users/${userId}/edit/bookings/sitter`, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
    });

    // Wait for the content to load
    await page.waitForSelector('body');

    // Add a longer wait time for the page to fully load
    console.log('Waiting for page to fully load...');
    await page.waitForTimeout(3000);

    // Try to find the notice board counter using a more general selector
    console.log('Looking for notice board counter...');
    try {
        const noticeCount = await page.evaluate(() => {
            const sections = document.querySelectorAll('section');
            for (const section of sections) {
                const text = section.textContent.trim();
                if (text.includes('New Job Notice Board:')) {
                    const match = text.match(/New Job Notice Board:\s*(\d+)/);
                    if (match) {
                        return parseInt(match[1]);
                    }
                }
            }
            return 0;
        });

        console.log(`Found ${noticeCount} new job notices`);

        if (noticeCount > 0) {
            console.log('New job notices available!');
            // Here you can add additional actions like sending notifications
        }
        return noticeCount;
    } catch (error) {
        console.error('Error finding notice board counter:', error.message);
        // Take a screenshot for debugging
        await page.screenshot({ path: 'error-screenshot.png' });
        console.log('Screenshot saved as error-screenshot.png');
        return 0;
    }
}

async function checkJobNotices(email, password, headless, userId) {
    console.log('Checking for new job notices...');

    // Debug: Check if credentials are loaded
    console.log('Using credentials:', {
        email: email,
        password: password ? '***' : 'not set',
        headless: headless,
        userId: userId
    });

    const browser = await setupBrowser(headless);
    const page = await browser.newPage();

    try {
        // Set a reasonable viewport
        await page.setViewport({ width: 1280, height: 800 });

        // Login process
        await login(page, email, password);

        // Check notice board
        await checkNoticeBoard(page, userId);

    } catch (error) {
        console.error('Error during scraping:', error);
        if (error.message.includes('permission')) {
            console.error('\nPermission Error: Please make sure to:');
            console.error('1. Allow Chrome to run in the Security & Privacy settings');
            console.error('2. Grant necessary permissions when prompted');
            console.error('3. If using macOS, you might need to run:');
            console.error('   xattr -d com.apple.quarantine /Applications/Google\ Chrome.app');
        }
    } finally {
        await browser.close();
    }
}

module.exports = {
    checkJobNotices
};
