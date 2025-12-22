#!/usr/bin/env node

/**
 * FinGrow Email Domain Update Script
 * 
 * This script helps you quickly update your email domain configuration
 * after setting up your domain in Resend.
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

async function updateEmailDomain() {
  console.log('\n🚀 FinGrow Email Domain Update Script\n');
  
  // Get current configuration
  const envPath = path.join(__dirname, '.env');
  let envContent = '';
  
  try {
    envContent = fs.readFileSync(envPath, 'utf8');
  } catch (error) {
    console.error('❌ Error reading .env file:', error.message);
    process.exit(1);
  }

  console.log('📧 Current email configuration:');
  const currentEmailFrom = envContent.match(/EMAIL_FROM="([^"]+)"/);
  if (currentEmailFrom) {
    console.log(`   ${currentEmailFrom[1]}\n`);
  } else {
    console.log('   EMAIL_FROM not found in .env\n');
  }

  // Get new domain information
  console.log('Please provide your new email domain information:\n');
  
  const domain = await question('🌐 Your domain (e.g., fingrow.com): ');
  if (!domain) {
    console.log('❌ Domain is required');
    rl.close();
    return;
  }

  const emailPrefix = await question('📧 Email prefix (e.g., hello, noreply, support) [default: hello]: ') || 'hello';
  
  const senderName = await question('👤 Sender name [default: FinGrow]: ') || 'FinGrow';

  // Construct new email address
  const newEmailFrom = `${senderName} <${emailPrefix}@${domain}>`;
  
  console.log(`\n✨ New email configuration: ${newEmailFrom}\n`);
  
  const confirm = await question('❓ Update .env file with this configuration? (y/N): ');
  
  if (confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes') {
    console.log('❌ Update cancelled');
    rl.close();
    return;
  }

  // Update .env file
  try {
    let updatedContent;
    
    if (currentEmailFrom) {
      // Replace existing EMAIL_FROM
      updatedContent = envContent.replace(
        /EMAIL_FROM="[^"]+"/,
        `EMAIL_FROM="${newEmailFrom}"`
      );
    } else {
      // Add EMAIL_FROM to end of file
      updatedContent = envContent.trim() + `\nEMAIL_FROM="${newEmailFrom}"\n`;
    }

    fs.writeFileSync(envPath, updatedContent);
    
    console.log('✅ .env file updated successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Make sure your domain is verified in Resend dashboard');
    console.log('2. Restart your development server:');
    console.log('   npm run dev');
    console.log('3. Test your email configuration:');
    console.log('   http://localhost:3000/test-email');
    console.log('\n🎉 Email domain update complete!');
    
  } catch (error) {
    console.error('❌ Error updating .env file:', error.message);
  }

  rl.close();
}

// Run the script
updateEmailDomain().catch(console.error);