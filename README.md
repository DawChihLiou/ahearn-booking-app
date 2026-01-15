This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

## Deployment with PM2

### Prerequisites

Ensure PM2 is installed globally on your server:

```bash
npm install -g pm2
# or
yarn global add pm2
```

### Initial Setup (First Time Deployment)

1. **SSH into your production server:**

   ```bash
   ssh root@booking.ahearn-chiropractic.de
   ```

2. **Navigate to your project directory and pull the latest code:**

   ```bash
   cd /path/to/your/project
   git pull origin main
   ```

3. **Install dependencies (if needed):**

   ```bash
   yarn install
   ```

4. **Build the Next.js application:**

   ```bash
   yarn build
   ```

5. **Start the application with PM2 using the ecosystem config:**

   ```bash
   pm2 start ecosystem.config.js
   ```

6. **Save PM2 process list for auto-restart on server reboot:**
   ```bash
   pm2 save
   pm2 startup
   ```

### Regular Deployment (Updating Existing Deployment)

1. **SSH into your production server:**

   ```bash
   ssh root@booking.ahearn-chiropractic.de
   ```

2. **Pull the latest codebase:**

   ```bash
   git pull origin main
   ```

3. **Install new dependencies (if package.json changed):**

   ```bash
   yarn install
   ```

4. **Build the application:**

   ```bash
   yarn build
   ```

5. **Restart the PM2 process:**

   ```bash
   # List all PM2 processes to find the app name/id
   pm2 list

   # Restart the application (use the name from ecosystem.config.js: "beta_web")
   pm2 restart beta_web

   # Or if environment variables changed:
   pm2 restart beta_web --update-env

   # Or restart by process ID:
   pm2 restart [id]
   ```

### Using the Deploy Script

You can also use the included `deploy.sh` script from your local machine:

```bash
chmod +x deploy.sh
./deploy.sh
```

This will SSH into the server and run the build script. Make sure `runbuild.sh` exists on the server and contains the deployment commands.

### PM2 Management Commands

```bash
# List all running processes
pm2 list

# View logs
pm2 logs beta_web

# Stop the application
pm2 stop beta_web

# Delete the process from PM2
pm2 delete beta_web

# Restart with environment variable updates
pm2 restart beta_web --update-env

# Monitor processes in real-time
pm2 monit

# View detailed information
pm2 show beta_web
```

### PM2 Configuration

The application is configured in `ecosystem.config.js` to run in cluster mode with maximum instances, using port 3000 (or PORT environment variable). The configuration will automatically:

- Run in cluster mode for better performance
- Use all available CPU cores
- Handle port increments automatically
- Merge logs from all instances
