#!/usr/bin/env node

/**
 * Gmail Delivery Test Script
 * 
 * This script helps test email delivery specifically to Gmail accounts
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function testGmailDelivery() {
  console.log('\n📧 Gmail Delivery Test for FinGrow\n');
  
  const gmailAddress = await question('📧 Enter your Gmail address: ');
  
  if (!gmailAddress || !gmailAddress.includes('@gmail.com')) {
    console.log('❌ Please enter a valid Gmail address');
    rl.close();
    return;
  }
  
  console.log('\n🚀 Sending test email to:', gmailAddress);
  console.log('⏳ Please wait...\n');
  
  try {
    const response = await fetch('http://localhost:3000/api/test-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: gmailAddress,
        name: 'Gmail Test User'
      }),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log(`📧 Sent to: ${result.recipient}\n`);
      
      console.log('🔍 Now check your Gmail account:');
      console.log('1. 📥 Check PRIMARY INBOX first');
      console.log('2. 🏷️  Check PROMOTIONS tab');
      console.log('3. 🚫 Check SPAM/JUNK folder (most likely location)');
      console.log('4. 📂 Check ALL MAIL folder');
      console.log('5. 🔍 Search for "FinGrow" or "onboarding@resend.dev"\n');
      
      console.log('⏰ Email should arrive within 1-5 minutes.');
      console.log('📱 Check both desktop and mobile Gmail apps.\n');
      
      console.log('🎯 If found in SPAM:');
      console.log('   • Click "Not spam" button');
      console.log('   • Add onboarding@resend.dev to contacts');
      console.log('   • Create filter to always allow FinGrow emails\n');
      
    } else {
      console.log('❌ Email sending failed:', result.message);
    }
    
  } catch (error) {
    console.log('❌ Error sending email:', error.message);
    console.log('\n🔧 Make sure your development server is running:');
    console.log('   npm run dev');
  }
  
  rl.close();
}

// Run the test
testGmailDelivery().catch(console.error);