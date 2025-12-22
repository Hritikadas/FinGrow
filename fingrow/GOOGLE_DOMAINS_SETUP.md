# 🌐 Google Domains Setup for FinGrow Email

## Step 1: Register Domain with Google Domains

### **Go to Google Domains**
1. Visit: [domains.google.com](https://domains.google.com)
2. **Sign in** with your Google account
3. **Search for your domain** (e.g., "fingrow.com", "fingrow.app")

### **Recommended Domain Names for FinGrow**
- `fingrow.com` - $12/year (Classic choice)
- `fingrow.app` - $20/year (Modern, app-focused)
- `fingrow.dev` - $12/year (Developer-friendly)
- `myfingrow.com` - $12/year (Personal touch)
- `getfingrow.com` - $12/year (Action-oriented)

### **Purchase Process**
1. **Select your domain** from search results
2. **Click "Get it"** or "Add to cart"
3. **Review cart** and proceed to checkout
4. **Complete purchase** with your Google account
5. **Domain will be active** within a few minutes

## Step 2: Configure DNS in Google Domains

### **Access DNS Settings**
1. **Go to Google Domains dashboard**
2. **Click on your domain**
3. **Click "DNS" in the left sidebar**
4. **Scroll to "Custom resource records"**

### **Add Resend DNS Records**

You'll need to add these records (get exact values from Resend):

#### **TXT Record (Domain Verification)**
```
Name: @ (leave blank)
Type: TXT
TTL: 3600
Data: resend-verify=abc123xyz... (from Resend)
```

#### **CNAME Record (DKIM Signing)**
```
Name: resend._domainkey
Type: CNAME
TTL: 3600
Data: resend._domainkey.resend.com
```

### **Step-by-Step DNS Addition**

1. **In Google Domains DNS section**
2. **Scroll to "Custom resource records"**
3. **Click "Manage custom records"**

**Add Record 1 (TXT):**
- Name: (leave blank)
- Type: TXT
- TTL: 3600
- Data: [paste verification code from Resend]
- Click "Add"

**Add Record 2 (CNAME):**
- Name: resend._domainkey
- Type: CNAME
- TTL: 3600
- Data: resend._domainkey.resend.com
- Click "Add"

## Step 3: Set Up Domain in Resend

### **Add Domain to Resend**
1. **Go to**: [resend.com](https://resend.com)
2. **Login** to your Resend account
3. **Click "Domains"** in sidebar
4. **Click "Add Domain"**
5. **Enter your domain** (e.g., fingrow.com)
6. **Click "Add Domain"**

### **Get DNS Records from Resend**
Resend will show you the exact DNS records to add:
- TXT record for domain verification
- CNAME record for DKIM signing

### **Copy these values** and add them to Google Domains (as shown above)

## Step 4: Verify Domain

### **In Resend Dashboard**
1. **Wait 5-15 minutes** for DNS propagation
2. **Click "Verify"** next to your domain
3. **Status should change to "Verified" ✅**

### **If Verification Fails**
- Wait longer (up to 1 hour)
- Check DNS records in Google Domains
- Ensure no extra spaces in record values
- Try removing and re-adding domain in Resend

## Step 5: Update FinGrow Configuration

### **Choose Your Email Address**
- `hello@yourdomain.com` - Friendly
- `noreply@yourdomain.com` - No replies expected
- `support@yourdomain.com` - Support emails
- `team@yourdomain.com` - Team emails

### **Update .env File**
```bash
# In fingrow/.env
EMAIL_FROM="FinGrow <hello@yourdomain.com>"
```

**Example:**
```bash
EMAIL_FROM="FinGrow <hello@fingrow.com>"
```

## Step 6: Test Your Setup

### **Restart Development Server**
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### **Test Email Configuration**
1. **Visit**: `http://localhost:3000/test-email`
2. **Click "Test Email Config"** - should show success
3. **Send test email** to your personal email
4. **Check inbox** (and spam folder)

## Complete Example Setup

### **Domain**: fingrow.com (purchased from Google Domains)

### **DNS Records in Google Domains**:
```
Name: (blank)          Type: TXT    Data: resend-verify=abc123...
Name: resend._domainkey Type: CNAME  Data: resend._domainkey.resend.com
```

### **Email Configuration**:
```bash
EMAIL_FROM="FinGrow <hello@fingrow.com>"
```

### **Test Results**:
- Domain verified in Resend ✅
- Test email sent successfully ✅
- Email received in inbox ✅

## Troubleshooting

### **DNS Not Propagating**
```bash
# Check if records are live
nslookup -type=TXT yourdomain.com
nslookup -type=CNAME resend._domainkey.yourdomain.com
```

### **Domain Not Verifying**
- Wait up to 1 hour for DNS propagation
- Double-check record values (no extra spaces)
- Ensure TXT record name is blank (@)
- Try different TTL values (300, 3600)

### **Emails Going to Spam**
- Domain is new (needs time to build reputation)
- Send emails gradually to warm up domain
- Consider adding SPF record:
  ```
  Name: (blank)
  Type: TXT
  Data: v=spf1 include:_spf.resend.com ~all
  ```

## Cost Breakdown

| Domain | Google Domains Price | Annual Cost |
|--------|---------------------|-------------|
| .com   | $12/year           | $12         |
| .app   | $20/year           | $20         |
| .dev   | $12/year           | $12         |
| .io    | $60/year           | $60         |

**Recommended**: `fingrow.com` for $12/year

## Next Steps After Setup

1. ✅ Domain purchased from Google Domains
2. ✅ DNS records added in Google Domains
3. ✅ Domain verified in Resend
4. ✅ EMAIL_FROM updated in .env
5. ✅ Development server restarted
6. ✅ Email configuration tested
7. 🎉 **Ready to send professional emails!**

---

**Quick Links:**
- **Google Domains**: [domains.google.com](https://domains.google.com)
- **Resend Dashboard**: [resend.com](https://resend.com)
- **Test Page**: `http://localhost:3000/test-email`
- **DNS Checker**: [dnschecker.org](https://dnschecker.org)