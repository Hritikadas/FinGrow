# Email Integration Setup Guide

This guide explains how to set up and test the transactional email system in FinGrow using Resend.

## Overview

FinGrow uses [Resend](https://resend.com) to send transactional emails to users. The email system includes:

1. **Welcome Email** - Sent automatically after successful user signup
2. **Simulation Summary Email** - Sent after running an investment simulation (optional)

All emails include educational disclaimers and are designed to be short, friendly, and professional.

---

## Prerequisites

- Node.js and npm installed
- FinGrow project set up locally
- A Resend account (free tier available)

---

## Setup Instructions

### 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address

### 2. Get Your API Key

1. Log in to your Resend dashboard
2. Navigate to **API Keys** section
3. Click **Create API Key**
4. Give it a name (e.g., "FinGrow Development")
5. Copy the API key (starts with `re_`)

### 3. Configure Your Domain (Optional for Production)

For development, you can use Resend's test domain. For production:

1. Go to **Domains** in Resend dashboard
2. Click **Add Domain**
3. Enter your domain (e.g., `fingrow.app`)
4. Follow DNS verification instructions
5. Wait for verification (usually takes a few minutes)

### 4. Update Environment Variables

1. Copy `.env.example` to `.env` if you haven't already:
   ```bash
   cp .env.example .env
   ```

2. Add your Resend configuration to `.env`:
   ```env
   # Resend API Key
   RESEND_API_KEY="re_your_actual_api_key_here"
   
   # Email sender address
   # For development (using Resend test domain):
   EMAIL_FROM="FinGrow <onboarding@resend.dev>"
   
   # For production (using your verified domain):
   EMAIL_FROM="FinGrow <noreply@fingrow.app>"
   ```

3. Make sure `NEXTAUTH_URL` is set correctly:
   ```env
   NEXTAUTH_URL="http://localhost:3000"
   ```

### 5. Install Dependencies

The Resend package should already be installed. If not:

```bash
npm install resend
```

---

## Testing the Email System

### Test 1: Welcome Email

Test the welcome email by creating a new user account:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/signup`

3. Create a new account with your email address

4. Check your email inbox for the welcome email

**Expected Result:**
- Email subject: "Welcome to FinGrow - Start Your Investment Journey! 🚀"
- Email contains: Welcome message, educational disclaimer, dashboard link
- Email is styled with FinGrow branding

### Test 2: Simulation Summary Email

Test the simulation summary email:

1. Log in to your account

2. Navigate to `http://localhost:3000/simulation`

3. Fill in the simulation parameters:
   - Monthly Amount: ₹5000
   - Duration: 12 months
   - Bundle Type: Balanced
   - **Check the "Email me the simulation results" checkbox**

4. Click "Run Simulation"

5. Check your email inbox for the simulation summary

**Expected Result:**
- Email subject: "Your Balanced Bundle Simulation Results - ₹XX,XXX Projected!"
- Email contains: Simulation details, investment summary, educational disclaimer
- Email is styled with bundle-specific colors

### Test 3: API Endpoints (Optional)

Test the email API endpoints directly using curl or Postman:

#### Welcome Email API

```bash
# First, create a user and get their ID from the database
# Then test the welcome email endpoint:

curl -X POST http://localhost:3000/api/email/welcome \
  -H "Content-Type: application/json" \
  -d '{"userId": "your-user-id-here"}'
```

#### Simulation Summary Email API

```bash
# First, run a simulation to create an InvestmentHistory record
# Then test the summary email endpoint:

curl -X POST http://localhost:3000/api/email/summary \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "your-user-id-here",
    "simulationId": "your-simulation-id-here"
  }'
```

---

## Email Templates

### Welcome Email Features

- Gradient header with FinGrow branding
- Personalized greeting with user's name
- Educational prototype disclaimer (prominent yellow box)
- List of key features
- Call-to-action button to dashboard
- Responsive HTML design

### Simulation Summary Email Features

- Bundle-specific color scheme (green/blue/purple)
- Detailed simulation results table
- Monthly investment, duration, and bundle type
- Total invested vs. final corpus comparison
- Educational disclaimer about simulated returns
- Links to run another simulation or compare strategies
- Responsive HTML design

---

## Troubleshooting

### Email Not Received

1. **Check spam/junk folder** - Transactional emails sometimes land there
2. **Verify API key** - Make sure `RESEND_API_KEY` is correct in `.env`
3. **Check sender address** - For development, use `onboarding@resend.dev`
4. **Check logs** - Look for email-related errors in the console:
   ```bash
   # Look for lines containing "email" or "resend"
   npm run dev | grep -i email
   ```

### API Key Invalid

- Make sure you copied the full API key (starts with `re_`)
- Check for extra spaces or quotes in `.env`
- Regenerate the API key in Resend dashboard if needed

### Domain Not Verified (Production)

- Wait for DNS propagation (can take up to 48 hours)
- Check DNS records are correctly configured
- Use Resend's test domain (`onboarding@resend.dev`) for development

### Email Fails But Signup/Simulation Works

This is expected behavior! The email system is designed to fail gracefully:
- Signup will complete even if welcome email fails
- Simulation will complete even if summary email fails
- Errors are logged but don't break the user experience

Check the logs for specific error messages:
```bash
# In the terminal where you ran npm run dev
# Look for error messages with correlationId
```

---

## Configuration Options

### Email Service Configuration

The email service is located in `src/lib/email.ts` and provides:

- **Type-safe email templates** - TypeScript interfaces for all email data
- **Environment validation** - Checks for required env vars on startup
- **Error handling** - Graceful fallbacks if email fails
- **Logging** - Comprehensive logging with correlation IDs
- **Educational compliance** - All emails include disclaimers

### Customizing Email Templates

To customize the email templates:

1. Open `src/lib/email.ts`
2. Find the `sendWelcomeEmail()` or `sendSimulationSummaryEmail()` function
3. Modify the `htmlContent` variable
4. Test your changes by sending a test email

**Tips:**
- Keep emails short and scannable
- Always include educational disclaimers
- Use inline CSS for styling (better email client support)
- Test in multiple email clients (Gmail, Outlook, Apple Mail)

### Disabling Emails

To disable emails without removing the code:

1. Remove or comment out `RESEND_API_KEY` in `.env`
2. The system will log warnings but continue working
3. No emails will be sent

---

## Production Deployment

### Before Going Live

1. **Verify your domain** in Resend
2. **Update EMAIL_FROM** to use your domain
3. **Test thoroughly** with real email addresses
4. **Set up monitoring** for email delivery rates
5. **Configure SPF/DKIM** records for better deliverability

### Environment Variables for Production

```env
# Production Resend API Key (different from development)
RESEND_API_KEY="re_prod_your_production_api_key"

# Production sender address (verified domain)
EMAIL_FROM="FinGrow <noreply@fingrow.app>"

# Production application URL
NEXTAUTH_URL="https://fingrow.app"
```

### Monitoring Email Delivery

1. Check Resend dashboard for delivery metrics
2. Monitor application logs for email errors
3. Set up alerts for high failure rates
4. Track user engagement (open rates, click rates)

---

## API Reference

### POST /api/email/welcome

Send a welcome email to a user.

**Request Body:**
```json
{
  "userId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully"
}
```

### POST /api/email/summary

Send a simulation summary email to a user.

**Request Body:**
```json
{
  "userId": "string",
  "simulationId": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Simulation summary email sent successfully"
}
```

### POST /api/simulation

Run a simulation and optionally send summary email.

**Request Body:**
```json
{
  "monthlyAmount": 5000,
  "duration": 12,
  "bundleType": "balanced",
  "sendEmail": true
}
```

**Response:**
```json
{
  "success": true,
  "simulation": {
    "id": "string",
    "monthlyInvestments": [...],
    "finalCorpus": 62000,
    "totalInvested": 60000,
    "totalReturns": 2000,
    "bundleType": "balanced",
    "expectedReturn": 10,
    "riskScore": 6,
    "duration": 12,
    "maturityDate": "2025-12-20T00:00:00.000Z"
  },
  "emailSent": true
}
```

---

## Security Considerations

1. **API Key Protection**
   - Never commit `.env` to version control
   - Use different API keys for dev/staging/prod
   - Rotate API keys regularly

2. **Email Content**
   - Never include sensitive financial data
   - Always include educational disclaimers
   - Use simulated data only

3. **Rate Limiting**
   - Resend free tier: 100 emails/day
   - Implement rate limiting for production
   - Monitor for abuse

4. **User Privacy**
   - Only send emails to verified addresses
   - Provide unsubscribe options (future feature)
   - Comply with email regulations (CAN-SPAM, GDPR)

---

## Support

For issues with:
- **Resend service**: Contact [Resend Support](https://resend.com/support)
- **FinGrow email integration**: Check application logs and this documentation
- **Email deliverability**: Check Resend dashboard and DNS configuration

---

## Additional Resources

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [Email Best Practices](https://resend.com/docs/best-practices)
- [HTML Email Guide](https://www.campaignmonitor.com/css/)
