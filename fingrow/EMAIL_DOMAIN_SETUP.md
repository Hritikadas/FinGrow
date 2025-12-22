# 📧 Email Domain Setup Guide

## Current Configuration
- **From Address**: `FinGrow <onboarding@resend.dev>` (Resend's testing domain)
- **Status**: ✅ Working for development/testing
- **Limitation**: May end up in spam for production use

## 🎯 Setting Up Your Own Domain

### Option 1: Use Your Existing Domain (Recommended)

If you have a domain like `yourdomain.com`, you can set up:
- `noreply@yourdomain.com`
- `hello@yourdomain.com`
- `support@yourdomain.com`

#### Steps:
1. **Login to Resend Dashboard**
   - Go to [resend.com](https://resend.com)
   - Login with your account

2. **Add Your Domain**
   - Click "Domains" in sidebar
   - Click "Add Domain"
   - Enter your domain (e.g., `yourdomain.com`)

3. **Verify Domain**
   - Resend will provide DNS records
   - Add these to your domain's DNS settings:
     ```
     Type: TXT
     Name: @
     Value: [provided by Resend]
     
     Type: CNAME
     Name: resend._domainkey
     Value: [provided by Resend]
     ```

4. **Update Environment Variable**
   ```bash
   # In your .env file
   EMAIL_FROM="FinGrow <noreply@yourdomain.com>"
   ```

### Option 2: Get a New Domain

#### Cheap Domain Options:
- **Namecheap**: $8-12/year for .com
- **Cloudflare**: $8-10/year for .com
- **Google Domains**: $12/year for .com

#### Suggested Domain Names:
- `fingrow.app`
- `fingrow.io`
- `fingrowai.com`
- `myfingrow.com`

### Option 3: Use Resend's Subdomain (Quick Setup)

Resend provides free subdomains:

1. **Go to Resend Dashboard**
2. **Click "Add Domain"**
3. **Choose "Use Resend subdomain"**
4. **Pick a subdomain**: `yourname.resend.dev`
5. **Update .env**:
   ```bash
   EMAIL_FROM="FinGrow <hello@yourname.resend.dev>"
   ```

## 🔧 Updating Email Configuration

### 1. Change From Address
```bash
# In fingrow/.env
EMAIL_FROM="FinGrow <your-email@yourdomain.com>"
```

### 2. Customize Email Templates

The email templates are in `src/lib/email.ts`. You can customize:

#### Welcome Email:
- Subject line
- Header colors/design
- Content sections
- Call-to-action buttons
- Footer information

#### Simulation Email:
- Results formatting
- Bundle-specific styling
- Educational disclaimers
- Action buttons

### 3. Add Your Logo

To add your logo to emails:

```html
<!-- In the email template -->
<img src="https://yourdomain.com/logo.png" 
     alt="FinGrow Logo" 
     style="width: 120px; height: auto; margin-bottom: 20px;">
```

## 🎨 Email Template Customization Options

### Colors & Branding
```javascript
// In src/lib/email.ts, you can change:
const brandColors = {
  primary: '#3B82F6',    // Blue
  secondary: '#8B5CF6',  // Purple
  accent: '#EC4899',     // Pink
  success: '#22C55E',    // Green
  warning: '#F59E0B',    // Orange
};
```

### Content Sections
You can modify:
- Header design and messaging
- Feature highlights
- Educational disclaimers
- Call-to-action buttons
- Footer information
- Social links

### Personalization
Current personalization includes:
- `${user.name}` - User's name
- `${user.email}` - User's email
- Dynamic dashboard links
- Bundle-specific content (for simulation emails)

## 🧪 Testing Your Changes

### 1. Test Email Configuration
```bash
# Visit the test page
http://localhost:3000/test-email
```

### 2. Test Real Signup Flow
1. Create a new account
2. Check your inbox
3. Verify email appearance and links

### 3. Test Simulation Emails
1. Login and run a simulation
2. Check inbox for summary email
3. Verify all data is correct

## 📊 Email Analytics

Resend provides analytics for:
- ✅ Delivery rates
- ✅ Open rates
- ✅ Click rates
- ✅ Bounce rates
- ✅ Spam complaints

Access these in your Resend dashboard.

## 🛡️ Best Practices

### Domain Reputation
- Use a dedicated subdomain for emails (e.g., `mail.yourdomain.com`)
- Don't use your main domain for emails
- Warm up your domain gradually

### Content Guidelines
- Keep subject lines under 50 characters
- Include clear unsubscribe links
- Use responsive design
- Test across email clients

### Compliance
- Include physical address in footer
- Provide easy unsubscribe
- Honor unsubscribe requests immediately
- Include educational disclaimers

## 🚀 Quick Setup Commands

```bash
# 1. Update your domain in .env
echo 'EMAIL_FROM="FinGrow <hello@yourdomain.com>"' >> .env

# 2. Test the configuration
curl http://localhost:3000/api/test-email

# 3. Send a test email
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","name":"Test User"}'
```

## 💡 Pro Tips

1. **Start with Resend subdomain** for quick setup
2. **Test thoroughly** before going live
3. **Monitor delivery rates** in Resend dashboard
4. **Keep templates simple** for better compatibility
5. **Use preview text** to improve open rates

---

**Need Help?** 
- Check Resend documentation: [resend.com/docs](https://resend.com/docs)
- Test your setup: `http://localhost:3000/test-email`
- Monitor logs for email delivery status