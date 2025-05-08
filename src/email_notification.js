const nodemailer = require('nodemailer');

async function sendEmailNotification(email, counter) {
    console.log(`Preparing to send email notification to ${email} about ${counter} new job notices`);

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_SENDER_USER,
                pass: process.env.EMAIL_SENDER_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_SENDER_USER,
            to: email,
            subject: 'New Job Notices on Catinaflat.de',
            text: `Hey! It seems there ${counter === 1 ? 'is' : 'are'} ${counter} New Job Notice${counter === 1 ? '' : 's'} on Catinaflat.de. Smell of money!`,
            html: `<h2>New Job Notices Alert!</h2>
                  <p>Hey!</p>
                  <p>It seems there ${counter === 1 ? 'is' : 'are'} <strong>${counter} New Job Notice${counter === 1 ? '' : 's'}</strong> on Catinaflat.de.</p>
                  <p><em>Smell of money!</em></p>
                  <p>Log in to your account to check the details.</p>`
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return true;
    } catch (error) {
        console.error('Error sending email notification:', error);

        if (error.code === 'EAUTH') {
            console.error('\nAuthentication Error: Please check your Gmail credentials.');
            console.error('For Gmail accounts with 2-factor authentication, you must use an App Password.');
            console.error('Generate one at: https://myaccount.google.com/apppasswords');
            console.error('Select "Mail" as the app and "Other" as the device (name it "CatinaFlat")');
        } else if (error.code === 'ESOCKET') {
            console.error('\nConnection Error: Could not connect to the email server.');
            console.error('Please check your internet connection and email server settings.');
        }

        return false;
    }
}

module.exports = {
    sendEmailNotification
};
