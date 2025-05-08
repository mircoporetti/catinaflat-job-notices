# Catinaflat Job Notice Scraper

This Node.js application automatically checks for new job notices on catinaflat.de every 3 hours.

## Local Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the `.env` file with your catinaflat.de credentials and user ID:
     ```
     CATINAFLAT_EMAIL=your_email@example.com
     CATINAFLAT_PASSWORD=your_password
     CATINAFLAT_USER_ID=your_user_id
     ```
   - Alternatively, you can set these environment variables directly in your system, and the application will use them if the `.env` file is not present.

## Usage

Start the scraper:
```bash
npm start
```

The scraper will:
- Run immediately when started
- Check for new job notices every 3 hours
- Log the results to the console

## Docker Deployment

You can build and run the application using Docker:

```bash
# Build the Docker image
docker build -t catinaflat-job-notices .

# Run the container with environment variables
docker run -d \
  -e CATINAFLAT_EMAIL=your_email@example.com \
  -e CATINAFLAT_PASSWORD=your_password \
  -e CATINAFLAT_USER_ID=your_user_id \
  catinaflat-job-notices
```

## Kubernetes Deployment

The repository includes a GitLab CI/CD pipeline for deploying to Kubernetes on a Raspberry Pi:

1. Set up the following GitLab CI/CD variables:
   - `CATINAFLAT_EMAIL`: Your catinaflat.de email
   - `CATINAFLAT_PASSWORD`: Your catinaflat.de password
   - `CATINAFLAT_USER_ID`: Your catinaflat.de user ID
   - `KUBE_CONFIG`: Base64-encoded Kubernetes config file

2. Push to the main branch to trigger the pipeline, which will:
   - Build the Docker image
   - Push it to the GitLab container registry
   - Deploy to your Kubernetes cluster

The Kubernetes deployment uses:
- A dedicated namespace: `catinaflat-job-notices`
- A Kubernetes secret for credentials
- A single replica deployment

## Features

- Automated login to catinaflat.de
- Checks for new job notices every 3 hours
- Extracts the number of new job notices
- Logs results to console
- Docker containerization
- GitLab CI/CD pipeline for Kubernetes deployment
