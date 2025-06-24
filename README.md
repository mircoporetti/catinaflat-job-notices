# Catinaflat Job Notice Scraper

This application automatically checks for new job notices on catinaflat.de every hour and sends email notifications when new opportunities are available, helping cat sitters stay informed about potential jobs.

## Implementation

The app has been implemented by using "Vibe Coding" as an experiment, initially with the usage of Cursor and then with IntelliJ Juniper
to compare the two tools.

Manual intervention was limited to small fixes where the tools struggled, minor cleanup of comments,
and some refactoring to split at least functionality into separate files and functions.

## Local Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the `.env` file with your catinaflat.de credentials, user ID, and email notification settings:
     ```
     CATINAFLAT_EMAIL=your_email@example.com
     CATINAFLAT_PASSWORD=your_password
     CATINAFLAT_USER_ID=your_user_id
     HEADLESS=false
     EMAIL_SENDER_USER=your_email_app_username_here
     EMAIL_SENDER_PASSWORD=your_email_app_password_here
     ```
   - For Gmail, you might need to use an App Password instead of your regular password. Generate one at: https://myaccount.google.com/apppasswords
   - Alternatively, you can set these environment variables directly in your system, and the application will use them if the `.env` file is not present.

## Usage

Start the scraper:
```bash
npm start
```

The scraper will:
- Run immediately when started
- Check for new job notices every hour
- Notify by email if at least a new job notice is found
