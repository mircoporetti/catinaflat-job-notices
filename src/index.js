const path = require('path');
const dotenv = require('dotenv');
const cron = require('node-cron');
// Import logger to override console methods with timestamped versions
require('./logger');
const { checkJobNotices } = require('./scraper');
const { sendEmailNotification } = require('./email_notification');

const result = dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

if (result.error) {
    console.warn('Warning: .env file not found. Using environment variables from the system.');
}

console.log('Environment loaded successfully');
console.log('Current working directory:', process.cwd());

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

if (!process.env.EMAIL_SENDER_USER) {
    console.error('Error: EMAIL_SENDER_USER environment variable is required');
    process.exit(1);
}

if (!process.env.EMAIL_SENDER_PASSWORD) {
    console.error('Error: EMAIL_SENDER_PASSWORD environment variable is required');
    process.exit(1);
}

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

async function checkAndNotify() {
    try {
        const noticeCount = await checkJobNotices(email, password, headless, userId);

        if (noticeCount > 0) {
            console.log(`Sending email notification for ${noticeCount} new job notices`);
            await sendEmailNotification(email, noticeCount);
        }
    } catch (error) {
        console.error('Error in check and notify process:', error);
    }
}

checkAndNotify();

cron.schedule('0 */1 * * *', () => {
    checkAndNotify();
});

console.log('Scraper started. Will check for new job notices every hour.');
