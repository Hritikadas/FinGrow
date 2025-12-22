# 📧 Resend Domain Setup Guide

## Step-by-Step Domain Configuration

### **Step 1: Access Resend Dashboard**

1. **Go to Resend**: [resend.com](https://resend.com)
2. **Login** with your account
3. **Click "Domains"** in the left sidebar
4. **Click "Add Domain"** button

### **Step 2: Add Your Domain**

1. **Enter your domain** (e.g., `fingrow.com`)
2. **Click "Add Domain"**
3. **Resend will generate DNS records**

### **Step 3: DNS Records to Add**

Resend will provide these DNS records to add to your domain:

#### **TXT Record (Domain Verification)**
```
Type: TXT
Name: @ (or root domain)
Value: resend-verify=abc123xyz... (provided by Resend)
TTL: 3600 (or Auto)
```

#### **CNAME Record (DKIM Signing)**
```
Type: CNAME
Name: resend._domainkey
Value: resend._domainkey.resend.com
TTL: 3600 (or Auto)
```

#### **Optional: MX Record (if you want to receive emails)**
```
Type: MX
Name: @ (or root domain)
Value: feedback-smtp.resend.com
Priority: 10
TTL: 3600 (or Auto)
```

### **Step 4: Add DNS Records to Your Domain**

#### **For Cloudflare Users:**

1. **Login to Cloudflare**
2. **Select your domain**
3. **Go to DNS > Records**
4. **Click "Add record"**
5. **Add each record** from Resend:

```
Record 1:
Type: TXT
Name: @
Content: [paste TXT value from Resend]

Record 2:
Type: CNAME
Name: resend._domainkey
Target: resend._domainkey.resend.com
```

#### **For Namecheap Users:**

1. **Login to Namecheap**
2. **Go to Domain List**
3. **Click "Manage" next to your domain**
4. **Go to "Advanced DNS" tab**
5. **Add new records**:

```
Record 1:
Type: TXT Record
Host: @
Value: [paste TXT value from Resend]
TTL: Automatic

Record 2:
Type: CNAME Record
Host: resend._domainkey
Value: resend._domainkey.resend.com
TTL: Automatic
```

#### **For Google Domains Users:**

1. **Login to Google Domains**
2. **Select your domain**
3. **Go to DNS**
4. **Scroll to "Custom resource records"**
5. **Add records**:

```
Record 1:
Name: @ (leave blank)
Type: TXT
Data: [paste TXT value from Resend]

Record 2:
Name: resend._domainkey
Type: CNAME
Data: resend._domainkey.resend.com
```

### **Step 5: Verify Domain in Resend**

1. **Go back to Resend dashboard**
2. **Click "Verify" next to your domain**
3. **Wait for verification** (can take 5-60 minutes)
4. **Status should change to "Verified" ✅**

### **Step 6: Update FinGrow Configuration**

Once verified, update your `.env` file:

```bash
# In fingrow/.env
EMAIL_FROM="FinGrow <hello@yourdomain.com>"
```

**Choose your email address:**
- `hello@yourdomain.com` - Friendly
- `noreply@yourdomain.com` - No replies expected
- `support@yourdomain.com` - Support emails
- `team@yourdomain.com` - Team emails

### **Step 7: Restart Your Application**

```bash
# Stop the current server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

### **Step 8: Test Your Setup**

1. **Visit test page**: `http://localhost:3000/test-email`
2. **Click "Test Email Config"** - should show success
3. **Send test email** to your personal email
4. **Check inbox** (and spam folder)

## Troubleshooting

### **Domain Not Verifying**

**Check DNS propagation:**
```bash
# Check if TXT record is live
nslookup -type=TXT yourdomain.com

# Or use online tool
# https://dnschecker.org
```

**Common issues:**
- DNS changes take 5-60 minutes to propagate
- Wrong record name (use @ not yourdomain.com)
- Extra spaces in record values
- TTL too high (try 300 seconds)

### **Emails Going to Spam**

**Solutions:**
- Warm up your domain gradually
- Use a subdomain for emails (mail.yourdomain.com)
- Add SPF record (optional):
  ```
  Type: TXT
  Name: @
  Value: v=spf1 include:_spf.resend.com ~all
  ```

### **Verification Failed**

1. **Double-check DNS records** in your domain provider
2. **Wait longer** (up to 24 hours for some providers)
3. **Try removing and re-adding** the domain in Resend
4. **Contact Resend support** if still failing

## DNS Record Examples by Provider

### **Cloudflare DNS Records**
```
Type    Name                Content
TXT     @                   resend-verify=abc123...
CNAME   resend._domainkey   resend._domainkey.resend.com
```

### **Namecheap DNS Records**
```
Type          Host              Value
TXT Record    @                 resend-verify=abc123...
CNAME Record  resend._domainkey resend._domainkey.resend.com
```

### **Google Domains DNS Records**
```
Name                Type    Data
@                   TXT     resend-verify=abc123...
resend._domainkey   CNAME   resend._domainkey.resend.com
```

## Verification Checklist

- [ ] Domain purchased and accessible
- [ ] Resend account created
- [ ] Domain added to Resend
- [ ] TXT record added to DNS
- [ ] CNAME record added to DNS
- [ ] DNS records propagated (check with nslookup)
- [ ] Domain verified in Resend dashboard
- [ ] EMAIL_FROM updated in .env
- [ ] Application restarted
- [ ] Test email sent successfully

## Next Steps After Verification

1. **Test email delivery** thoroughly
2. **Monitor delivery rates** in Resend dashboard
3. **Set up email analytics** tracking
4. **Consider adding SPF/DMARC** records for better deliverability
5. **Warm up domain** by sending emails gradually

---

**Need Help?**
- **DNS Checker**: [dnschecker.org](https://dnschecker.org)
- **Resend Docs**: [resend.com/docs](https://resend.com/docs)
- **Test Page**: `http://localhost:3000/test-email`