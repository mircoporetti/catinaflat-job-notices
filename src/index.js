// Load environment variables first, before any other imports
const path = require('path');
const dotenv = require('dotenv');
const cron = require('node-cron');
const { checkJobNotices } = require('./scraper');

// Load .env file with explicit path
const result = dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (result.error) {
    console.error('Error loading .env file:', result.error);
    process.exit(1);
}

console.log('Environment loaded successfully');
console.log('Current working directory:', process.cwd());

// Validate required environment variables
if (!process.env.CATINAFLAT_EMAIL) {
    console.error('Error: CATINAFLAT_EMAIL environment variable is required');
    process.exit(1);
}

if (!process.env.CATINAFLAT_PASSWORD) {
    console.error('Error: CATINAFLAT_PASSWORD environment variable is required');
    process.exit(1);
}

if (!process.env.CATINAFLAT_USER_ID) {
    console.error('Error: CATINAFLAT_USER_ID environment variable is required');
    process.exit(1);
}

// Store environment variables
const email = process.env.CATINAFLAT_EMAIL;
const password = process.env.CATINAFLAT_PASSWORD;
const userId = process.env.CATINAFLAT_USER_ID;
const headless = process.env.HEADLESS || 'false';

console.log('Environment variables loaded:', {
    email: email,
    password: password ? '***' : 'not set',
    userId: userId,
    headless: headless
});

// Run the check immediately when starting the script
checkJobNotices(email, password, headless, userId);

// Schedule the check to run every 3 hours
cron.schedule('0 */3 * * *', () => {
    checkJobNotices(email, password, headless, userId);
});

console.log('Scraper started. Will check for new job notices every 3 hours.');
