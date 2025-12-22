# 🚀 Google Domains Quick Setup for FinGrow

## ⚡ Quick Setup (5 Steps)

### **1. Buy Domain**
- Go to: [domains.google.com](https://domains.google.com)
- Search: `fingrow.com` (or your preferred name)
- Purchase: $12/year for .com

### **2. Add to Resend**
- Go to: [resend.com](https://resend.com) → Domains
- Click: "Add Domain"
- Enter: your domain name

### **3. Add DNS Records**
In Google Domains → DNS → Custom resource records:

```
Record 1:
Name: (blank)
Type: TXT
Data: [verification code from Resend]

Record 2:
Name: resend._domainkey
Type: CNAME
Data: resend._domainkey.resend.com
```

### **4. Verify Domain**
- In Resend: Click "Verify"
- Wait: 5-60 minutes
- Status: Should show "Verified" ✅

### **5. Update FinGrow**
```bash
# Run the setup script
npm run setup-email

# Or manually update .env:
EMAIL_FROM="FinGrow <hello@yourdomain.com>"

# Restart server
npm run dev
```

## 🧪 Test Your Setup

```bash
# Test configuration
http://localhost:3000/test-email

# Test real signup
http://localhost:3000/signup
```

## 💡 Recommended Domains

| Domain | Price | Best For |
|--------|-------|----------|
| fingrow.com | $12/year | Professional |
| fingrow.app | $20/year | Modern app |
| fingrow.dev | $12/year | Developer focus |

## 🆘 Troubleshooting

**Domain not verifying?**
- Wait up to 1 hour for DNS propagation
- Check DNS records in Google Domains
- Use [dnschecker.org](https://dnschecker.org) to verify

**Emails going to spam?**
- Domain is new (needs reputation building)
- Send emails gradually
- Consider adding SPF record

## 📞 Quick Commands

```bash
# Run guided setup
npm run setup-email

# Update email domain
npm run update-email

# Test email system
curl http://localhost:3000/api/test-email

# Check DNS propagation
nslookup -type=TXT yourdomain.com
```

## ✅ Success Checklist

- [ ] Domain purchased from Google Domains
- [ ] Domain added to Resend
- [ ] DNS records added to Google Domains
- [ ] Domain verified in Resend (green checkmark)
- [ ] EMAIL_FROM updated in .env
- [ ] Development server restarted
- [ ] Test email sent successfully
- [ ] Email received in inbox

## 🎯 Final Result

**Before:** `FinGrow <onboarding@resend.dev>`
**After:** `FinGrow <hello@yourdomain.com>`

**Benefits:**
- ✅ Professional appearance
- ✅ Better email deliverability
- ✅ Custom branding
- ✅ Reduced spam likelihood

---

**Need help?** Run: `npm run setup-email` for guided setup!