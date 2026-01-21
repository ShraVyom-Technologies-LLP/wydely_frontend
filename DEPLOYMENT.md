# Deployment Guide

This guide explains how to deploy the Wydely WhatsApp Frontend application to a server.

## Prerequisites

- Node.js 18+ installed on your server
- Docker (optional, for containerized deployment)
- A web server (nginx, Apache, or similar) for production
- Your backend API URL

## Deployment Options

### Option 1: Docker Deployment (Recommended)

This is the easiest and most portable deployment method.

#### Step 1: Build the Docker Image

```bash
# Build the image with your API URL
docker build -t wydely-whatsapp \
  --build-arg EXPO_PUBLIC_API_URL=https://your-api-domain.com \
  .

# Or use the default API URL
docker build -t wydely-whatsapp .
```

#### Step 2: Run the Container

```bash
# Run the container
docker run -d \
  -p 3000:3000 \
  --name wydely-whatsapp \
  wydely-whatsapp
```

#### Step 3: Access the Application

The application will be available at `http://your-server-ip:3000`

#### Using Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  wydely-whatsapp:
    build:
      context: .
      args:
        EXPO_PUBLIC_API_URL: ${EXPO_PUBLIC_API_URL:-https://api.wydely.io}
    ports:
      - '3000:3000'
    restart: unless-stopped
    environment:
      - EXPO_PUBLIC_API_URL=${EXPO_PUBLIC_API_URL:-https://api.wydely.io}
```

Then run:

```bash
docker-compose up -d
```

### Option 2: Manual Deployment

#### Step 1: Install Dependencies

```bash
npm install
```

#### Step 2: Set Environment Variables

Create a `.env` file in the project root:

```bash
EXPO_PUBLIC_API_URL=https://your-api-domain.com
```

Or export it before building:

```bash
export EXPO_PUBLIC_API_URL=https://your-api-domain.com
```

#### Step 3: Build the Web App

```bash
# Build for web
npx expo export --platform web
```

This will create a `dist` directory with the static files.

#### Step 4: Serve the Application

##### Using Node.js serve (for testing)

```bash
npm install -g serve
serve -s dist -l 3000
```

##### Using PM2 (for production)

```bash
npm install -g pm2
pm2 serve dist 3000 --name wydely-whatsapp --spa
pm2 save
pm2 startup
```

##### Using Nginx (recommended for production)

1. Install nginx:

```bash
sudo apt-get update
sudo apt-get install nginx
```

2. Copy the built files:

```bash
sudo cp -r dist/* /var/www/html/
```

3. Configure nginx (create `/etc/nginx/sites-available/wydely-whatsapp`):

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

4. Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/wydely-whatsapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

5. Set up SSL with Let's Encrypt (optional but recommended):

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: Deploy to Cloud Platforms

#### Vercel

Vercel is fully supported! The project includes a `vercel.json` configuration file for optimal deployment.

**Option 1: Deploy via Vercel Dashboard (Recommended)**

1. Push your code to GitHub, GitLab, or Bitbucket
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your repository
5. Vercel will auto-detect the configuration from `vercel.json`
6. Add environment variable:
   - `EXPO_PUBLIC_API_URL`: Your API URL
7. Click "Deploy"

**Option 2: Deploy via Vercel CLI**

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Login to Vercel:

```bash
vercel login
```

3. Deploy:

```bash
# For preview deployment
vercel

# For production deployment
vercel --prod
```

4. Set environment variables:

```bash
# Set environment variable
vercel env add EXPO_PUBLIC_API_URL

# Or set it in the Vercel dashboard:
# Project Settings → Environment Variables
```

**Vercel Configuration:**

The project includes `vercel.json` which:

- Configures the build command: `npx expo export --platform web`
- Sets output directory to `dist`
- Configures SPA routing (all routes → index.html)
- Sets up caching for static assets

**Environment Variables in Vercel:**

1. Go to your project in Vercel dashboard
2. Navigate to Settings → Environment Variables
3. Add: `EXPO_PUBLIC_API_URL` with your API URL
4. Select environments (Production, Preview, Development)
5. Redeploy after adding variables

**Note:** After adding environment variables, you need to trigger a new deployment for them to take effect.

#### Netlify

1. Install Netlify CLI:

```bash
npm i -g netlify-cli
```

2. Build and deploy:

```bash
npx expo export --platform web
netlify deploy --prod --dir=dist
```

3. Set environment variables in Netlify dashboard

#### AWS S3 + CloudFront

1. Build the app:

```bash
npx expo export --platform web
```

2. Upload to S3:

```bash
aws s3 sync dist/ s3://your-bucket-name --delete
```

3. Configure CloudFront to serve from S3 bucket

## Environment Variables

The application uses the following environment variable:

- `EXPO_PUBLIC_API_URL`: The base URL of your backend API (required)

Set this variable before building the application. For Expo, environment variables must be prefixed with `EXPO_PUBLIC_` to be accessible in the client-side code.

## Production Checklist

- [ ] Set `EXPO_PUBLIC_API_URL` to your production API URL
- [ ] Build the application with production optimizations
- [ ] Set up HTTPS/SSL certificate
- [ ] Configure CORS on your backend API
- [ ] Set up monitoring and logging
- [ ] Configure backup and recovery procedures
- [ ] Test the deployment in a staging environment first

## Troubleshooting

### Build fails

- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that all dependencies are compatible

### API calls fail

- Verify `EXPO_PUBLIC_API_URL` is set correctly
- Check CORS settings on your backend API
- Ensure the API is accessible from your server

### Static files not loading

- Verify the build completed successfully
- Check file permissions in the dist directory
- Ensure the web server is configured to serve static files correctly

## Support

For issues or questions, please refer to the main project documentation or contact the development team.
