# Vercel Deployment Checklist ✅

## Pre-Deployment Checklist

### 1. Repository Setup
- [ ] Code is pushed to GitHub
- [ ] Repository is public or accessible to Vercel
- [ ] All files are committed (check `git status`)

### 2. Environment Variables (Critical!)
Set these in Vercel Dashboard → Project → Settings → Environment Variables:

```bash
# Required Variables
DATABASE_URL=postgresql://neondb_owner:npg_WH90QmilMkec@ep-cold-fire-adravq3x-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
NEXTAUTH_SECRET=2hs0j4rkCiJzQgeANdJWOg5/Ah1HrVTZE4Bg5hBXDuw=
NEXTAUTH_URL=https://your-app-name.vercel.app
JWT_SECRET=0f0b05167557a111fbb607e80095b4435465f3d2aacbaef8d723223bdaf079f6
NODE_ENV=production

# Optional (Email)
RESEND_API_KEY=re_your_resend_api_key_here
EMAIL_FROM=FinGrow <noreply@yourdomain.com>
```

### 3. Vercel Project Settings
- [ ] Root Directory: `fingrow` (NOT `fin-grow`)
- [ ] Framework Preset: Next.js
- [ ] Build Command: `prisma generate && next build`
- [ ] Install Command: `npm ci`

## Deployment Steps

### Step 1: Connect to Vercel
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select the repository: `Hritikadas/FinGrow`

### Step 2: Configure Project
1. **Root Directory**: Set to `fingrow`
2. **Framework**: Should auto-detect as Next.js
3. **Build Settings**: Leave as default (will use our package.json scripts)

### Step 3: Set Environment Variables
Copy each variable from the list above:
1. Go to Settings → Environment Variables
2. Add each variable one by one
3. **Important**: Update `NEXTAUTH_URL` to your actual Vercel URL

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete (usually 2-3 minutes)
3. Check build logs if there are errors

## Post-Deployment

### Step 1: Update NEXTAUTH_URL
1. Note your deployment URL (e.g., `https://fin-grow-xyz.vercel.app`)
2. Go to Settings → Environment Variables
3. Update `NEXTAUTH_URL` to your actual URL
4. Redeploy (Deployments → Click "..." → Redeploy)

### Step 2: Test Your App
- [ ] Visit your deployment URL
- [ ] Test user registration
- [ ] Test user login
- [ ] Check dashboard functionality
- [ ] Verify database connections

### Step 3: Custom Domain (Optional)
1. Go to Settings → Domains
2. Add your custom domain
3. Follow DNS setup instructions
4. Update `NEXTAUTH_URL` to your custom domain

## Troubleshooting Common Issues

### Build Fails with Prisma Error
**Error**: "Prisma Client is not configured"
**Solution**: 
- Ensure `DATABASE_URL` is set correctly
- Check that build command includes `prisma generate`

### Authentication Not Working
**Error**: NextAuth errors or redirect issues
**Solution**:
- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Check `NEXTAUTH_SECRET` is set
- Ensure `JWT_SECRET` is configured

### Database Connection Issues
**Error**: "Can't reach database server"
**Solution**:
- Verify Neon database is running
- Check `DATABASE_URL` includes `?sslmode=require`
- Test connection string format

### Environment Variables Not Loading
**Error**: `process.env.VARIABLE_NAME` is undefined
**Solution**:
- Double-check all variables are set in Vercel dashboard
- Ensure variable names match exactly (case-sensitive)
- Redeploy after adding variables

## Success Indicators

✅ **Build Successful**: Green checkmark in Vercel dashboard
✅ **App Loads**: Homepage displays without errors
✅ **Database Connected**: User registration/login works
✅ **Authentication Working**: Can create account and login
✅ **Dashboard Accessible**: Can view dashboard after login

## Quick Commands for Local Testing (if needed)

```bash
# Clean install (if local issues persist)
rm -rf node_modules package-lock.json
npm install

# Generate Prisma client
npm run db:generate

# Test build (may fail on Windows/OneDrive)
npm run build
```

## Support Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Vercel Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [NextAuth Deployment](https://next-auth.js.org/deployment)

---

**Note**: Local builds may fail on Windows with OneDrive due to symlink issues. This is normal - Vercel's Linux environment should build successfully with the configurations we've set up.