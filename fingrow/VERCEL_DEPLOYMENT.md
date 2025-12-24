# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Database**: Ensure your PostgreSQL database (Neon) is accessible from external connections
3. **Domain**: Optional - custom domain for production

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the `fingrow` folder as the root directory

### 2. Configure Environment Variables

In your Vercel project settings, add these environment variables:

#### Required Variables

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_WH90QmilMkec@ep-cold-fire-adravq3x-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# Authentication
NEXTAUTH_SECRET=2hs0j4rkCiJzQgeANdJWOg5/Ah1HrVTZE4Bg5hBXDuw=
NEXTAUTH_URL=https://your-app-name.vercel.app
JWT_SECRET=0f0b05167557a111fbb607e80095b4435465f3d2aacbaef8d723223bdaf079f6

# Email (Optional)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=FinGrow <noreply@yourdomain.com>

# Node Environment
NODE_ENV=production
```

#### Important Notes:

- **NEXTAUTH_URL**: Update this to your actual Vercel deployment URL
- **DATABASE_URL**: Your current Neon database URL should work
- **Secrets**: Use the same secrets from your local `.env` file
- **Email**: Update with your actual Resend API key and verified domain

### 3. Build Configuration

The project is already configured with:
- `vercel.json` for deployment settings
- Updated `next.config.js` for Vercel optimization
- `postinstall` script for Prisma generation
- `vercel-build` script for database setup

### 4. Deploy

1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Your app will be available at `https://your-app-name.vercel.app`

## Post-Deployment

### 1. Database Setup

The deployment will automatically:
- Generate Prisma client
- Push database schema to your Neon database

### 2. Test the Application

1. Visit your deployed URL
2. Test user registration/login
3. Verify database connections
4. Check email functionality (if configured)

### 3. Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` environment variable

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables are set correctly
   - Ensure DATABASE_URL is accessible from Vercel

2. **Database Connection Issues**
   - Verify Neon database allows external connections
   - Check connection string format

3. **Authentication Issues**
   - Ensure NEXTAUTH_URL matches your deployment URL
   - Verify NEXTAUTH_SECRET is set

4. **Email Issues**
   - Verify RESEND_API_KEY is valid
   - Check EMAIL_FROM domain is verified in Resend

### Logs and Debugging

- View deployment logs in Vercel dashboard
- Use Vercel CLI for local debugging: `vercel logs`
- Check function logs for API routes

## Environment-Specific Configurations

### Development
- NEXTAUTH_URL: `http://localhost:3000`
- Database: Local or development instance

### Production
- NEXTAUTH_URL: `https://your-domain.com`
- Database: Production Neon instance
- Enable all security features

## Security Considerations

1. **Environment Variables**: Never commit secrets to version control
2. **Database**: Use connection pooling for better performance
3. **Authentication**: Ensure NEXTAUTH_SECRET is strong and unique
4. **CORS**: Configure for your specific domain
5. **Rate Limiting**: Consider implementing for API routes

## Performance Optimization

The configuration includes:
- SWC minification
- Standalone output for smaller deployments
- Compression enabled
- Optimized for serverless functions

## Monitoring

Consider adding:
- Vercel Analytics
- Error tracking (Sentry)
- Performance monitoring
- Database monitoring (Neon dashboard)