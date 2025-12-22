#!/usr/bin/env node

/**
 * FinGrow Google Domains Email Setup Script
 * 
 * This script guides you through setting up email with Google Domains
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupGoogleDomain() {
  console.log('\n🌐 FinGrow Google Domains Email Setup\n');
  
  console.log('This script will help you set up professional email for FinGrow using Google Domains.\n');
  
  // Step 1: Domain Registration
  console.log('📋 STEP 1: Domain Registration');
  console.log('1. Go to: https://domains.google.com');
  console.log('2. Sign in with your Google account');
  console.log('3. Search for and purchase your domain\n');
  
  console.log('💡 Recommended domains for FinGrow:');
  console.log('   • fingrow.com ($12/year) - Classic choice');
  console.log('   • fingrow.app ($20/year) - Modern, app-focused');
  console.log('   • fingrow.dev ($12/year) - Developer-friendly');
  console.log('   • myfingrow.com ($12/year) - Personal touch\n');
  
  const domainPurchased = await question('❓ Have you purchased your domain from Google Domains? (y/N): ');
  
  if (domainPurchased.toLowerCase() !== 'y' && domainPurchased.toLowerCase() !== 'yes') {
    console.log('\n⏸️  Please purchase your domain first, then run this script again.');
    console.log('   Visit: https://domains.google.com\n');
    rl.close();
    return;
  }
  
  // Get domain information
  const domain = await question('\n🌐 What domain did you purchase? (e.g., fingrow.com): ');
  if (!domain) {
    console.log('❌ Domain is required');
    rl.close();
    return;
  }
  
  // Step 2: Resend Setup
  console.log('\n📧 STEP 2: Resend Domain Setup');
  console.log('1. Go to: https://resend.com');
  console.log('2. Login to your Resend account');
  console.log('3. Click "Domains" → "Add Domain"');
  console.log(`4. Enter your domain: ${domain}`);
  console.log('5. Click "Add Domain"\n');
  
  const resendSetup = await question('❓ Have you added your domain to Resend? (y/N): ');
  
  if (resendSetup.toLowerCase() !== 'y' && resendSetup.toLowerCase() !== 'yes') {
    console.log('\n⏸️  Please add your domain to Resend first.');
    console.log('   Visit: https://resend.com → Domains → Add Domain\n');
    rl.close();
    return;
  }
  
  // Step 3: DNS Records
  console.log('\n🔧 STEP 3: DNS Records Setup');
  console.log('Resend should have provided you with DNS records to add.\n');
  
  console.log('📋 You need to add these records to Google Domains:');
  console.log('\n1. TXT Record (Domain Verification):');
  console.log('   Name: @ (leave blank)');
  console.log('   Type: TXT');
  console.log('   Data: resend-verify=abc123... (from Resend)');
  
  console.log('\n2. CNAME Record (DKIM Signing):');
  console.log('   Name: resend._domainkey');
  console.log('   Type: CNAME');
  console.log('   Data: resend._domainkey.resend.com\n');
  
  console.log('🔧 To add these in Google Domains:');
  console.log('1. Go to Google Domains dashboard');
  console.log(`2. Click on your domain (${domain})`);
  console.log('3. Click "DNS" in the left sidebar');
  console.log('4. Scroll to "Custom resource records"');
  console.log('5. Add both records as shown above\n');
  
  const dnsSetup = await question('❓ Have you added the DNS records to Google Domains? (y/N): ');
  
  if (dnsSetup.toLowerCase() !== 'y' && dnsSetup.toLowerCase() !== 'yes') {
    console.log('\n⏸️  Please add the DNS records first.');
    console.log('   Check the GOOGLE_DOMAINS_SETUP.md file for detailed instructions.\n');
    rl.close();
    return;
  }
  
  // Step 4: Domain Verification
  console.log('\n✅ STEP 4: Domain Verification');
  console.log('1. Go back to Resend dashboard');
  console.log('2. Click "Verify" next to your domain');
  console.log('3. Wait for verification (5-60 minutes)\n');
  
  const domainVerified = await question('❓ Is your domain verified in Resend (shows green checkmark)? (y/N): ');
  
  if (domainVerified.toLowerCase() !== 'y' && domainVerified.toLowerCase() !== 'yes') {
    console.log('\n⏳ Domain verification can take up to 1 hour.');
    console.log('   Please wait and try verification again in Resend dashboard.');
    console.log('   You can continue with this script once verified.\n');
    rl.close();
    return;
  }
  
  // Step 5: Update FinGrow Configuration
  console.log('\n⚙️  STEP 5: Update FinGrow Configuration');
  
  const emailPrefix = await question(`📧 Choose email prefix for ${domain} (hello/noreply/support) [default: hello]: `) || 'hello';
  const senderName = await question('👤 Sender name [default: FinGrow]: ') || 'FinGrow';
  
  const newEmailFrom = `${senderName} <${emailPrefix}@${domain}>`;
  
  console.log(`\n✨ New email configuration: ${newEmailFrom}\n`);
  
  const updateConfig = await question('❓ Update .env file with this configuration? (y/N): ');
  
  if (updateConfig.toLowerCase() !== 'y' && updateConfig.toLowerCase() !== 'yes') {
    console.log('❌ Configuration update cancelled');
    rl.close();
    return;
  }
  
  // Update .env file
  const envPath = path.join(__dirname, '.env');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace or add EMAIL_FROM
    if (envContent.includes('EMAIL_FROM=')) {
      envContent = envContent.replace(
        /EMAIL_FROM="[^"]*"/,
        `EMAIL_FROM="${newEmailFrom}"`
      );
    } else {
      envContent = envContent.trim() + `\nEMAIL_FROM="${newEmailFrom}"\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ .env file updated successfully!\n');
    
    // Final steps
    console.log('🎉 Setup Complete! Next steps:\n');
    console.log('1. Restart your development server:');
    console.log('   npm run dev\n');
    console.log('2. Test your email configuration:');
    console.log('   http://localhost:3000/test-email\n');
    console.log('3. Try the signup flow:');
    console.log('   http://localhost:3000/signup\n');
    console.log('📧 Your users will now receive emails from:');
    console.log(`   ${newEmailFrom}\n`);
    console.log('🎯 Professional email setup complete!');
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
    console.log('\nPlease manually update your .env file:');
    console.log(`EMAIL_FROM="${newEmailFrom}"`);
  }
  
  rl.close();
}

// Run the script
setupGoogleDomain().catch(console.error);